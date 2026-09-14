async function api(path, opts={}){
  const res = await fetch(path, {...opts, headers:{'Content-Type':'application/json', ...(opts.headers||{})}});
  if(!res.ok){ let b={}; try{b=await res.json();}catch(e){} const err=new Error(b.error||res.statusText); err.status=res.status; throw err; }
  if(res.status===204) return null;
  return res.json();
}
let toastTimer=null;
function toast(msg){ const el=document.getElementById('toast'); el.textContent=msg; el.classList.add('show'); clearTimeout(toastTimer); toastTimer=setTimeout(()=>el.classList.remove('show'),2200); }
function escapeHtml(s){ return String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }

async function boot(){
  try{
    const me = await api('/api/admin/me');
    renderPanel(me.username);
  }catch(e){
    renderLogin();
  }
}

function renderLogin(){
  document.getElementById('root').innerHTML = `<div class="card" style="padding:28px;">
    <div class="onboard-title" style="text-align:center;">Вход для администратора</div>
    <div class="field-group" style="margin-top:20px;">
      <div class="field-label">Логин</div>
      <input class="search-input" id="username" style="width:100%;">
    </div>
    <div class="field-group">
      <div class="field-label">Пароль</div>
      <input class="search-input" id="password" type="password" style="width:100%;">
    </div>
    <button class="btn btn-primary btn-block" id="login-btn">Войти</button>
    <div class="onboard-error" id="login-error"></div>
  </div>`;
  document.getElementById('login-btn').addEventListener('click', async ()=>{
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    try{
      const res = await api('/api/admin/login', {method:'POST', body: JSON.stringify({username, password})});
      renderPanel(res.username);
    }catch(e){ document.getElementById('login-error').textContent = 'Неверный логин или пароль'; }
  });
}

async function renderPanel(username){
  document.getElementById('root').innerHTML = `
    <div class="card panel">
      <div style="display:flex;justify-content:space-between;align-items:center;">
        <div class="section-title" style="margin:0;">Здравствуй, ${escapeHtml(username)}</div>
        <button class="btn btn-ghost btn-sm" id="logout-btn">Выйти</button>
      </div>
      <button class="btn btn-primary btn-block" id="gen-btn" style="margin-top:18px;">Сгенерировать код</button>
      <div id="code-display"></div>
    </div>
    <div class="card panel" style="margin-top:16px;">
      <div class="section-title">Последние коды</div>
      <table id="codes-table"><thead><tr><th>Код</th><th>Создан</th><th>Истекает</th><th>Статус</th></tr></thead><tbody></tbody></table>
    </div>`;
  document.getElementById('logout-btn').addEventListener('click', async ()=>{ await api('/api/admin/logout', {method:'POST'}); location.reload(); });
  document.getElementById('gen-btn').addEventListener('click', async ()=>{
    try{
      const code = await api('/api/admin/codes', {method:'POST'});
      document.getElementById('code-display').innerHTML = `<div class="code-big">${code.code}</div><div class="field-hint" style="text-align:center;">Действует 30 минут, одноразовый. Продиктуй клиенту.</div>`;
      await loadCodes();
    }catch(e){ toast('Не удалось создать код'); }
  });
  await loadCodes();
}

async function loadCodes(){
  const codes = await api('/api/admin/codes');
  const tbody = document.querySelector('#codes-table tbody');
  tbody.innerHTML = codes.map(c=>{
    const status = c.usedAt ? 'использован' : (new Date(c.expiresAt) < new Date() ? 'истёк' : 'активен');
    return `<tr><td style="font-family:var(--font-mono);">${c.code}</td><td>${new Date(c.createdAt).toLocaleString('ru-RU')}</td><td>${new Date(c.expiresAt).toLocaleString('ru-RU')}</td><td>${status}</td></tr>`;
  }).join('');
}

boot();
