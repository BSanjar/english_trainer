const TOKEN_KEY = 'lexi_device_token';
const LEVELS = ['A1','A2','B1','B2','C1'];
const LEVEL_LABELS = {A1:'Начальный',A2:'Элементарный',B1:'Средний',B2:'Выше среднего',C1:'Продвинутый'};
const POS_LABELS = {n:'сущ.',v:'гл.',adj:'прил.',adv:'нареч.',prep:'предл.',pron:'мест.',conj:'союз',det:'опред.',num:'числ.',interj:'межд.',phr:'фраза'};
const BLOCKS = [
  {id:'learn', title:'Изучение слов', desc:'Карточки: свайп — если знаешь, тап — посмотреть перевод.', ic:'🗂️'},
  {id:'mc', title:'Квиз', desc:'Слово на английском → выбери верный перевод.', ic:'🧩'},
  {id:'type_en', title:'Введи слово', desc:'По переводу набери слово на английском.', ic:'⌨️'},
  {id:'fill', title:'Заполни пропуск', desc:'Впиши пропущенное слово в примере.', ic:'✏️'},
  {id:'listen', title:'Аудирование', desc:'Прослушай слово и запиши, что услышал(а).', ic:'🎧'},
  {id:'speak', title:'Произношение', desc:'Повтори слово вслух — проверим через микрофон.', ic:'🎤'},
];
const ICONS = {
  home:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 11.5 12 4l9 7.5"/><path d="M5.5 10v9a1 1 0 0 0 1 1H10v-6h4v6h3.5a1 1 0 0 0 1-1v-9"/></svg>',
  bank:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5V6a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v13.5"/><path d="M4 19.5A1.5 1.5 0 0 1 5.5 18H19"/><path d="M8 7h7M8 10h7"/></svg>',
  stats:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 20V10M12 20V4M20 20v-7"/></svg>',
  settings:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-1.87-.34 1.7 1.7 0 0 0-1 1.55V21a2 2 0 0 1-4 0v-.09A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.87.34l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3a2 2 0 0 1 0-4h.09A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3a2 2 0 0 1 4 0v.09a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.87-.34l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21a2 2 0 0 1 0 4h-.09a1.7 1.7 0 0 0-1.55 1Z"/></svg>',
  tasks:'<svg class="ic" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8.5 12.5 2.3 2.3L16 10"/></svg>',
  speak:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/><path d="M19 6a8.5 8.5 0 0 1 0 12"/></svg>',
  star:'<svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" stroke="currentColor" stroke-width="1"><path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.3l-6.1 3.4 1.5-6.7-5.1-4.6 6.8-.7L12 2.5Z"/></svg>',
  starOutline:'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2.5l2.9 6.2 6.8.7-5.1 4.6 1.5 6.7L12 17.3l-6.1 3.4 1.5-6.7-5.1-4.6 6.8-.7L12 2.5Z"/></svg>',
  mic:'<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3"/></svg>',
  close:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 5l14 14M19 5 5 19"/></svg>',
};

/* ===== API ===== */
function authHeaders(){
  const t = localStorage.getItem(TOKEN_KEY);
  return t ? {'Authorization':'Bearer '+t} : {};
}
async function api(path, opts={}){
  const res = await fetch(path, {
    ...opts,
    headers: {'Content-Type':'application/json', ...authHeaders(), ...(opts.headers||{})},
  });
  if(!res.ok){
    let body = {};
    try{ body = await res.json(); }catch(e){}
    const err = new Error(body.error || res.statusText);
    err.status = res.status; err.body = body;
    throw err;
  }
  if(res.status===204) return null;
  return res.json();
}

/* ===== helpers ===== */
function escapeHtml(s){ return String(s ?? '').replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function escapeRegex(s){ return s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&'); }
function highlightWord(sentence, word){
  try{ return sentence.replace(new RegExp('\\b('+escapeRegex(word)+')\\b','ig'), '<mark>$1</mark>'); }
  catch(e){ return sentence; }
}
function normalizeAnswer(s){ return s.trim().toLowerCase().replace(/[.,!?;:'"()]/g,''); }
function shuffle(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; }
function speak(text, rate){
  if(!('speechSynthesis' in window)) return;
  try{ speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text); u.lang='en-US'; u.rate=rate||1; speechSynthesis.speak(u); }catch(e){}
}
let toastTimer=null;
function toast(msg){
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer); toastTimer = setTimeout(()=>el.classList.remove('show'), 2200);
}

/* ===== state ===== */
const state = {
  client: null,
  words: [], wordsById: {},
  today: null,
  learnQueue: [], learnFlipped: false, learnQueueLoaded: false, learnTodayCompleted: null, learnTodayTarget: null,
  practiceMode: null, practicePool: [], practiceIdx: 0, practiceScore:{correct:0,wrong:0},
  bankQuery:'', bankStatus:null, bankPage:1,
};

function rebuildWordIndex(){ state.wordsById = {}; state.words.forEach(w=>state.wordsById[w.id]=w); }

/* ===== boot ===== */
async function boot(){
  const token = localStorage.getItem(TOKEN_KEY);
  if(!token){ renderCodeScreen(); return; }
  try{
    const me = await api('/api/auth/me');
    state.client = me;
    if(!me.level){ renderLevelPicker(); return; }
    await startApp();
  }catch(e){
    if(e.status===401){ localStorage.removeItem(TOKEN_KEY); renderCodeScreen(); }
    else { renderFatalError(e); }
  }
}

function renderFatalError(e){
  document.getElementById('sidebar').style.display='none'; document.getElementById('tabbar').style.display='none';
  document.getElementById('view').innerHTML = `<div class="onboard-wrap"><div class="card onboard-card">
    <div class="onboard-title">Что-то пошло не так</div>
    <div class="onboard-sub">${escapeHtml(e.message||'Ошибка сети')}</div>
    <button class="btn btn-primary btn-block" onclick="location.reload()">Обновить страницу</button>
  </div></div>`;
}

/* ===== onboarding ===== */
function renderCodeScreen(){
  document.getElementById('sidebar').style.display='none'; document.getElementById('tabbar').style.display='none';
  document.getElementById('view').className='view';
  document.getElementById('view').innerHTML = `<div class="onboard-wrap"><div class="card onboard-card">
    <div class="onboard-title">Добро пожаловать в Lexi</div>
    <div class="onboard-sub">Представься и введи одноразовый код, который тебе дал преподаватель</div>
    <div style="text-align:left;margin-bottom:14px;">
      <div class="field-label" style="margin-bottom:6px;">Как тебя зовут?</div>
      <input class="search-input" id="name-input" style="width:100%;" placeholder="Имя" maxlength="60" autofocus>
    </div>
    <input class="code-input" id="code-input" maxlength="6" inputmode="numeric" placeholder="000000">
    <div class="onboard-error" id="code-error"></div>
    <button class="btn btn-primary btn-block" id="code-submit" style="margin-top:14px;">Войти</button>
  </div></div>`;
  const nameInput = document.getElementById('name-input');
  const input = document.getElementById('code-input');
  const submit = async ()=>{
    const name = nameInput.value.trim();
    const code = input.value.trim();
    if(name.length===0){ document.getElementById('code-error').textContent='Укажи имя'; nameInput.focus(); return; }
    if(code.length!==6){ document.getElementById('code-error').textContent='Код должен содержать 6 цифр'; return; }
    try{
      const res = await api('/api/auth/redeem', {method:'POST', body: JSON.stringify({code, name})});
      localStorage.setItem(TOKEN_KEY, res.deviceToken);
      state.client = res.client;
      if(!res.client.level){ renderLevelPicker(); } else { await startApp(); }
    }catch(e){
      document.getElementById('code-error').textContent = e.status===400 ? 'Код неверный, уже использован или истёк' : 'Ошибка сети, попробуй ещё раз';
    }
  };
  document.getElementById('code-submit').addEventListener('click', submit);
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') submit(); });
  nameInput.addEventListener('keydown', e=>{ if(e.key==='Enter') input.focus(); });
}

function renderLevelPicker(){
  document.getElementById('sidebar').style.display='none'; document.getElementById('tabbar').style.display='none';
  document.getElementById('view').innerHTML = `<div class="onboard-wrap"><div class="card onboard-card" style="max-width:460px;">
    <div class="onboard-title">Какой у тебя уровень?</div>
    <div class="onboard-sub">Материалы и слова будут подобраны под этот уровень</div>
    <div class="level-grid">${LEVELS.map(lv=>`
      <button class="level-btn" onclick="chooseLevel('${lv}')">
        <div class="lv-code">${lv}</div><div class="lv-name">${LEVEL_LABELS[lv]}</div>
      </button>`).join('')}</div>
  </div></div>`;
}
async function chooseLevel(level){
  try{
    const res = await api('/api/client/level', {method:'PUT', body: JSON.stringify({level})});
    state.client = res;
    await startApp();
  }catch(e){ toast('Не удалось сохранить уровень'); }
}

/* ===== app shell ===== */
async function startApp(){
  const words = await api('/api/words');
  state.words = words; rebuildWordIndex();
  window.addEventListener('hashchange', route);
  if(!location.hash) location.hash = 'home';
  route();
  renderHelpButton();
  if(!localStorage.getItem('lexi_onboarding_seen')) showHelpModal(true);
}

const HELP_KEY = 'lexi_onboarding_seen';
function renderHelpButton(){
  if(document.getElementById('help-btn')) return;
  const btn = document.createElement('button');
  btn.id = 'help-btn';
  btn.className = 'help-fab';
  btn.innerHTML = '?';
  btn.onclick = ()=>showHelpModal(false);
  document.body.appendChild(btn);
}
function showHelpModal(firstTime){
  localStorage.setItem(HELP_KEY, '1');
  document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop"><div class="modal card">
    <div class="modal-top"><div class="onboard-title" style="font-size:22px;text-align:left;">${firstTime?'Добро пожаловать!':'Как пользоваться Lexi'}</div>
      <button class="icon-btn" onclick="closeModal()">${ICONS.close}</button></div>
    <div class="help-list">
      <div class="help-item"><div class="help-num">1</div><div><b>6 задач в день</b> — Изучение слов, Квиз, Введи слово, Заполни пропуск, Аудирование, Произношение. Открываются с экрана «Задачи».</div></div>
      <div class="help-item"><div class="help-num">2</div><div><b>Карточки слов:</b> тапни — увидишь перевод и пример; свайпни вверх — «знаю»/«запомнил»; свайпни вниз — «трудно».</div></div>
      <div class="help-item"><div class="help-num">3</div><div>У каждой задачи своя цель на день — прогресс-бар. Проходи в любом порядке, повторы не ограничены.</div></div>
      <div class="help-item"><div class="help-num">4</div><div>Слова уровня и статистика — в <b>Настройках</b>, в разделе «Категории».</div></div>
      <div class="help-item"><div class="help-num">5</div><div>Кнопка <b>«?»</b> в углу экрана — это окно, если понадобится ещё раз.</div></div>
    </div>
    <button class="btn btn-primary btn-block" style="margin-top:18px;" onclick="closeModal()">Понятно${firstTime?', начать':''}</button>
  </div></div>`;
}

const NAV = [
  {id:'home', label:'Главная', icon:'home'},
  {id:'blocks', label:'Задачи', icon:'tasks', main:true},
  {id:'settings', label:'Настройки', icon:'settings'},
];
function currentViewId(){ return (location.hash.replace('#','').split('/')[0]) || 'home'; }
function currentViewArg(){ return location.hash.split('/')[1] || null; }

function renderShell(){
  const view = currentViewId();
  const navViewId = ['session','practice'].includes(view) ? 'blocks' : (['bank','stats'].includes(view) ? 'settings' : view);
  document.getElementById('sidebar').style.display = '';
  document.getElementById('tabbar').style.display = '';
  document.getElementById('sidebar').innerHTML =
    '<div class="brand"><div class="brand-mark">L</div><div class="brand-name">Lexi</div></div>'+
    '<div class="nav">'+NAV.map(n=>`<button class="nav-item${navViewId===n.id?' active':''}" onclick="location.hash='${n.id}'">${ICONS[n.icon]}<span>${n.label} ${n.id==='blocks'?'на сегодня':''}</span></button>`).join('')+'</div>'+
    '<div class="nav-spacer"></div>'+
    '<div class="sidebar-foot">'+escapeHtml(state.client?.name||'')+(state.client?.name?' · ':'')+'Уровень '+(state.client?.level||'—')+'</div>';
  document.getElementById('tabbar').innerHTML = NAV.map(n=>
    n.main
      ? `<button class="tab-item tab-item-main${navViewId===n.id?' active':''}" onclick="location.hash='${n.id}'"><span class="tab-main-circle">${ICONS[n.icon]}</span><span>${n.label}</span></button>`
      : `<button class="tab-item${navViewId===n.id?' active':''}" onclick="location.hash='${n.id}'">${ICONS[n.icon]}<span>${n.label}</span></button>`
  ).join('');
}

async function route(){
  renderShell();
  const view = currentViewId();
  const el = document.getElementById('view');
  el.className = 'view' + (['session','practice','blocks'].includes(view) ? ' view-narrow' : '');
  if(view==='home') await renderHome(el);
  else if(view==='blocks') await renderBlocks(el);
  else if(view==='session') await renderLearnSession(el);
  else if(view==='practice') await renderPractice(el);
  else if(view==='bank') renderBank(el);
  else if(view==='stats') await renderStats(el);
  else if(view==='settings') renderSettings(el);
  else await renderHome(el);
  window.scrollTo(0,0);
}

/* ===== home ===== */
const MONTHS_RU = ['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'];
function todayLabelRu(){ const d=new Date(); return d.getDate()+' '+MONTHS_RU[d.getMonth()]+' '+d.getFullYear(); }

function todayChipsHtml(today){
  const byBlock = {}; today.blocks.forEach(b=>byBlock[b.block]=b);
  return `<div class="today-chip-grid">${BLOCKS.map(b=>{
    const bp = byBlock[b.id] || {completed:0, target: state.client.dailyGoal};
    const done = bp.target>0 && bp.completed>=bp.target;
    return `<div class="today-chip${done?' done':''}" onclick="openBlock('${b.id}')" title="${b.title}">
      <div class="tc-ic">${done?'✓':b.ic}</div>
      <div class="tc-label">${b.title}</div>
      <div class="tc-count">${done?'готово':bp.completed+'/'+bp.target}</div>
    </div>`;
  }).join('')}</div>`;
}
async function renderHome(el){
  if(state.today) paintHome(el, state.today);
  const today = await api('/api/session/today');
  state.today = today;
  if(currentViewId()==='home') paintHome(el, today);
}
function paintHome(el, today){
  const mastered = state.words.filter(w=>w.status==='mastered').length;
  const inProgress = state.words.filter(w=>w.status!=='new').length;
  const remaining = state.words.length - inProgress;
  const overallPct = today.totalTarget>0 ? Math.min(100, Math.round(100*today.totalCompleted/today.totalTarget)) : 0;
  const doneBlocks = today.blocks.filter(b=>b.target>0 && b.completed>=b.target).length;

  const firstName = (state.client.name||'').split(' ')[0];

  el.innerHTML = `
    <div class="home-head">
      <div class="page-title">Привет${firstName?', '+escapeHtml(firstName):''}!</div>
      <div class="home-head-row">
        <span class="page-sub">${todayLabelRu()}</span>
        <span class="pill pill-level-${state.client.level} level-pill-big">Уровень ${state.client.level}</span>
      </div>
    </div>
    <div class="compact-stat-row">
      <div class="compact-stat"><div class="cs-num">${inProgress}</div><div class="cs-label">Изучено</div></div>
      <div class="compact-stat"><div class="cs-num">${remaining}</div><div class="cs-label">Осталось</div></div>
      <div class="compact-stat"><div class="cs-num">${mastered}</div><div class="cs-label">Освоено твёрдо</div></div>
    </div>
    <div class="card home-tasks-card">
      <div class="home-tasks-head">
        <div>
          <div class="section-title" style="margin:0;">Задачи на сегодня</div>
          <div class="field-hint" style="margin:3px 0 0;">Выполнено блоков: ${doneBlocks}/6 · ${today.totalCompleted}/${today.totalTarget} (${overallPct}%)</div>
        </div>
        <button class="btn btn-primary btn-sm" onclick="location.hash='blocks'">Все задачи →</button>
      </div>
      <div class="bar-track" style="margin-bottom:14px;"><div class="bar-fill" style="width:${overallPct}%"></div></div>
      ${todayChipsHtml(today)}
    </div>
    <div class="section-title" style="margin-top:24px;">Как устроена Lexi</div>
    <div class="info-grid">
      <div class="card info-card">
        <div class="info-ic">📖</div>
        <div class="info-title">Частотный словарь</div>
        <div class="info-text">2500+ слов подобраны по принципу Oxford 3000/5000 — не любые слова, а самые нужные: от базовых (A1) до продвинутых (C1), с переводом и живым примером.</div>
      </div>
      <div class="card info-card">
        <div class="info-ic">🧠</div>
        <div class="info-title">Интервальное повторение</div>
        <div class="info-text">Слово возвращается к тебе прямо перед тем, как ты готов(а) его забыть (алгоритм SM-2). Меньше зубрёжки — крепче память надолго.</div>
      </div>
      <div class="card info-card">
        <div class="info-ic">🔄</div>
        <div class="info-title">Input → Output</div>
        <div class="info-text">Сначала пробуешь вспомнить слово сам(а) — и только потом смотришь перевод. Активное вспоминание работает в разы лучше, чем просто чтение.</div>
      </div>
    </div>
  `;
}

/* ===== tasks / block picker ===== */
function blockGridHtml(today){
  const byBlock = {}; today.blocks.forEach(b=>byBlock[b.block]=b);
  return `<div class="block-grid">
    ${BLOCKS.map(b=>{
      const bp = byBlock[b.id] || {completed:0, target: state.client.dailyGoal};
      const pct = bp.target>0 ? Math.min(100, Math.round(100*bp.completed/bp.target)) : 0;
      const done = pct>=100;
      return `<div class="card block-card${done?' block-done':''}" onclick="openBlock('${b.id}')">
        <div class="block-ic">${b.ic}</div>
        <div class="block-body">
          <div class="block-title">${b.title}${done?' ✓':''}</div>
          <div class="block-desc">${b.desc}</div>
          <div class="block-progress">
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <div class="block-progress-label">${bp.completed}/${bp.target}${done?' · готово, можно продолжать':''}</div>
          </div>
        </div>
      </div>`;
    }).join('')}
  </div>`;
}
async function renderBlocks(el){
  if(state.today) paintBlocks(el, state.today);
  const today = await api('/api/session/today');
  state.today = today;
  if(currentViewId()==='blocks') paintBlocks(el, today);
}
function paintBlocks(el, today){
  const overallPct = today.totalTarget>0 ? Math.min(100, Math.round(100*today.totalCompleted/today.totalTarget)) : 0;
  const learnBlock = today.blocks.find(b=>b.block==='learn') || {completed:0, target:state.client.dailyGoal};
  const startedLearn = learnBlock.completed>0;

  el.innerHTML = `
    <div class="page-head"><div><div class="page-title">Задачи на сегодня</div><div class="page-sub">Заполни прогресс-бар в каждом блоке</div></div></div>
    <div class="tasks-cta">
      <button class="btn btn-primary" onclick="openBlock('learn')">${startedLearn ? 'Продолжить изучение слов ('+learnBlock.completed+'/'+learnBlock.target+')' : 'Начать — изучение слов'} →</button>
    </div>
    <div class="overall-progress-strip">
      <span class="ops-label">Общий прогресс за сегодня</span>
      <div class="bar-track"><div class="bar-fill" style="width:${overallPct}%"></div></div>
      <span class="ops-pct">${overallPct}%</span>
    </div>
    ${blockGridHtml(today)}
  `;
}
function openBlock(id){
  if(id==='learn'){
    state.learnQueue = []; state.learnQueueLoaded = false; state.learnFlipped = false;
    state.learnTodayCompleted = null; state.learnTodayTarget = null;
    if(location.hash.replace('#','')==='session') route(); else location.hash = 'session';
  } else {
    const target = 'practice/'+id;
    if(location.hash.replace('#','')===target){ state.practicePool=[]; route(); }
    else location.hash = target;
  }
}

/* ===== feedback: sound + haptics =====
   Web Audio (AudioContext + oscillators) proved unreliable on the user's
   phone across two rounds of fixes. HTMLAudioElement playback of a tiny
   pre-baked WAV is the more universally-supported path on mobile browsers,
   so a single beep sample is pitch-shifted per grade via playbackRate. */
const BEEP_DATA_URI = 'data:audio/wav;base64,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';
let _beepPool = [];
let _beepReady = false;
function unlockAudio(){
  if(_beepReady) return;
  try{
    for(let i=0;i<3;i++){
      const a = new Audio(BEEP_DATA_URI);
      a.preload = 'auto'; a.volume = 0.001;
      a.play().then(()=>{ a.pause(); a.currentTime = 0; a.volume = 1; }).catch(()=>{});
      _beepPool.push(a);
    }
    _beepReady = true;
  }catch(e){}
}
['pointerdown','touchstart','click','keydown'].forEach(evt=>
  document.addEventListener(evt, unlockAudio, {passive:true, once:true})
);
function playBeep(rate){
  try{
    const a = _beepPool.find(x=>x.paused) || new Audio(BEEP_DATA_URI);
    a.currentTime = 0;
    a.playbackRate = rate;
    a.volume = 1;
    a.play().catch(()=>{});
  }catch(e){}
}
function feedbackFor(grade){
  try{ if(navigator.vibrate) navigator.vibrate(grade==='hard' ? [12,40,12] : 16); }catch(e){}
  if(grade==='hard') playBeep(0.5);
  else if(grade==='good') playBeep(1.5);
  else playBeep(2);
}
function feedbackGoalMet(){
  try{ if(navigator.vibrate) navigator.vibrate([15,60,15,60,25]); }catch(e){}
  playBeep(1.5); setTimeout(()=>playBeep(2),100);
}

/* ===== learn session (vertical swipe cards) ===== */
async function renderLearnSession(el){
  if(state.learnTodayCompleted==null){
    const today = await api('/api/session/today');
    const lb = today.blocks.find(b=>b.block==='learn');
    state.learnTodayCompleted = lb ? lb.completed : 0;
    state.learnTodayTarget = lb ? lb.target : state.client.dailyGoal;
  }
  if(state.learnQueue.length===0 && !state.learnQueueLoaded){
    const q = await api('/api/session/queue');
    state.learnQueue = shuffleInterleave(q.due, q.new);
    state.learnQueueLoaded = true;
  }

  const pct = state.learnTodayTarget>0 ? Math.min(100, Math.round(100*state.learnTodayCompleted/state.learnTodayTarget)) : 0;
  const goalMet = state.learnTodayCompleted >= state.learnTodayTarget;
  const goalBar = `<div class="session-goal${goalMet?' goal-met':''}">
      <div class="session-goal-row"><span>Изучение слов сегодня</span><span><b>${state.learnTodayCompleted}</b>/${state.learnTodayTarget}</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
    </div>`;
  const backRow = `<button class="btn btn-ghost btn-sm session-back" onclick="location.hash='blocks'">← Задачи на сегодня</button>`;

  if(state.learnQueue.length===0){
    el.innerHTML = `<div class="session-shell">${backRow}${goalBar}<div class="card session-empty">
      <div class="big-ic">🎉</div>
      <div style="font-weight:700;font-size:17px;margin-bottom:6px;">Все карточки на сегодня пройдены!</div>
      <div style="margin-bottom:18px;">Загляни в другие задачи или вернись позже.</div>
      <button class="btn btn-primary" onclick="location.hash='blocks'">К задачам</button>
    </div></div>`;
    return;
  }
  const w = state.learnQueue[0];
  const flipped = state.learnFlipped;
  el.innerHTML = `<div class="session-shell">
    ${backRow}${goalBar}
    <div class="flash-stage">
      <div class="flash" id="flash-card">
        <div class="swipe-zone up" id="zone-up"><span class="sz-arrow">↑</span><span class="sz-label">${flipped?'Запомнил':'Знаю'}</span></div>
        <div class="swipe-zone down" id="zone-down"><span class="sz-arrow">↓</span><span class="sz-label">Трудно</span></div>
        <div class="flash-badges"><span class="pill pill-level-${w.level}">${w.level}</span>
          <div class="right-badges"><button class="icon-btn" onclick="event.stopPropagation();speak('${w.word.replace(/'/g,"")}')">${ICONS.speak}</button></div></div>
        <div class="flash-content">
          <div class="flash-word">${escapeHtml(w.word)}</div>
          <div class="flash-ipa">${escapeHtml(w.ipa)} · ${POS_LABELS[w.pos]||w.pos}</div>
          ${flipped ? `
            <div class="flash-translation">
              <div class="flash-ru">${escapeHtml(w.ru)}</div>
              <div class="flash-ex">${highlightWord(escapeHtml(w.exampleEn), w.word)}</div>
              <div class="flash-ex-ru">${escapeHtml(w.exampleRu)}</div>
            </div>
          ` : `<div class="flash-hint">тапни — посмотреть перевод</div>`}
        </div>
      </div>
    </div>
  </div>`;
  attachSwipeHandlers(document.getElementById('flash-card'));
}
function shuffleInterleave(due, fresh){
  const out=[]; let di=0, ni=0;
  while(di<due.length || ni<fresh.length){
    for(let k=0;k<4 && di<due.length;k++) out.push(due[di++]);
    if(ni<fresh.length) out.push(fresh[ni++]);
  }
  return out;
}

let dragState = null;
function attachSwipeHandlers(cardEl){
  if(!cardEl) return;
  const zoneUp = document.getElementById('zone-up');
  const zoneDown = document.getElementById('zone-down');
  const THRESH = 80;
  cardEl.addEventListener('pointerdown', e=>{
    dragState = {startX:e.clientX, startY:e.clientY, dx:0, dy:0, moved:false};
    try{ cardEl.setPointerCapture(e.pointerId); }catch(err){}
    cardEl.classList.add('swiping');
  });
  cardEl.addEventListener('pointermove', e=>{
    if(!dragState) return;
    dragState.dx = e.clientX - dragState.startX;
    dragState.dy = e.clientY - dragState.startY;
    if(Math.abs(dragState.dx)>6 || Math.abs(dragState.dy)>6) dragState.moved = true;
    cardEl.style.transform = `translate(${dragState.dx*0.25}px, ${dragState.dy}px) rotate(${dragState.dx/28}deg)`;
    if(zoneUp) zoneUp.style.opacity = 0.55 + (dragState.dy<0 ? Math.min(0.42, -dragState.dy/THRESH*0.42) : 0);
    if(zoneDown) zoneDown.style.opacity = 0.55 + (dragState.dy>0 ? Math.min(0.42, dragState.dy/THRESH*0.42) : 0);
  });
  const resetZones = ()=>{ if(zoneUp) zoneUp.style.opacity=''; if(zoneDown) zoneDown.style.opacity=''; };
  const finish = e=>{
    if(!dragState) return;
    const {dx, dy, moved} = dragState;
    cardEl.classList.remove('swiping');
    if(!moved){
      dragState = null;
      cardEl.style.transform = '';
      state.learnFlipped = !state.learnFlipped; route();
      return;
    }
    const vertical = Math.abs(dy) > Math.abs(dx);
    if(vertical && Math.abs(dy) > THRESH){
      const goingUp = dy < 0;
      const grade = goingUp ? (state.learnFlipped ? 'good' : 'easy') : 'hard';
      feedbackFor(grade);
      cardEl.style.transition = 'transform .28s ease, opacity .28s ease';
      cardEl.style.transform = `translate(${dx*0.4}px, ${goingUp?-700:700}px) rotate(${dx/28}deg)`;
      cardEl.style.opacity = '0';
      dragState = null;
      resetZones();
      setTimeout(()=>gradeLearn(grade), 260);
    } else {
      cardEl.style.transition = 'transform .2s ease';
      cardEl.style.transform = 'translate(0,0) rotate(0)';
      resetZones();
      dragState = null;
    }
  };
  cardEl.addEventListener('pointerup', finish);
  cardEl.addEventListener('pointercancel', finish);
}
function showGoalMetModal(){
  feedbackGoalMet();
  const nextBlock = BLOCKS[BLOCKS.findIndex(b=>b.id==='learn')+1];
  document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop"><div class="modal card goal-modal">
    <div class="big-ic">🎯</div>
    <div class="flash-word" style="font-size:22px;">Дневная цель выполнена!</div>
    <div class="flash-ex-ru" style="max-width:none;margin-top:8px;">Ты закрыл(а) ${state.learnTodayTarget} слов в «Изучении слов» на сегодня. Можно остановиться или продолжать — как захочешь.</div>
    <div class="modal-actions" style="justify-content:center;margin-top:20px;flex-direction:column;">
      ${nextBlock ? `<button class="btn btn-primary btn-block" onclick="closeModal();openBlock('${nextBlock.id}');">Следующая задача: ${nextBlock.title} →</button>` : ''}
      <button class="btn btn-outline btn-block" onclick="closeModal();">Продолжать здесь</button>
    </div>
  </div></div>`;
}
async function gradeLearn(grade){
  const w = state.learnQueue[0];
  if(!w) return;
  try{ await api('/api/session/review', {method:'POST', body: JSON.stringify({wordId:w.id, grade})}); }
  catch(e){ toast('Не удалось сохранить прогресс'); }
  state.learnQueue.shift();
  if(grade==='hard'){
    state.learnQueue.splice(Math.min(state.learnQueue.length,3), 0, w);
  }
  const wasMet = state.learnTodayCompleted >= state.learnTodayTarget;
  state.learnTodayCompleted++;
  state.learnFlipped = false;
  route();
  if(!wasMet && state.learnTodayCompleted >= state.learnTodayTarget){
    setTimeout(showGoalMetModal, 320);
  }
}

/* ===== practice (mc / type_en / fill / listen / speak) ===== */
function buildPracticePool(){
  let pool = state.words.filter(w=>w.status!=='new');
  if(pool.length<10) pool = pool.concat(shuffle(state.words).slice(0, 10-pool.length));
  return shuffle(pool).slice(0,20);
}
function currentPracticeWord(){ return state.practicePool[state.practiceIdx]; }
async function logBlockProgress(block, wordId){
  try{ await api('/api/session/progress', {method:'POST', body: JSON.stringify({block, wordId})}); }catch(e){}
}
function nextPracticeItem(block, wordId, correct){
  state.practiceScore[correct?'correct':'wrong']++;
  logBlockProgress(block, wordId);
  setTimeout(()=>{ state.practiceIdx++; route(); }, 700);
}
function practiceHeader(){
  return `<div class="practice-head"><button class="btn btn-ghost btn-sm" onclick="location.hash='blocks'">← Задачи</button>
    <div class="score-pill">${state.practiceIdx}/${state.practicePool.length} · ✓ ${state.practiceScore.correct} ✗ ${state.practiceScore.wrong}</div></div>`;
}
function practiceDone(){
  return practiceHeader()+`<div class="card session-empty"><div class="big-ic">🏁</div>
    <div style="font-weight:700;font-size:17px;margin-bottom:6px;">Раунд завершён</div>
    <div style="margin-bottom:18px;">Правильно ${state.practiceScore.correct} из ${state.practicePool.length}</div>
    <div style="display:flex;gap:10px;justify-content:center;">
      <button class="btn btn-outline" onclick="location.hash='blocks'">К задачам</button>
      <button class="btn btn-primary" onclick="state.practicePool=buildPracticePool();state.practiceIdx=0;state.practiceScore={correct:0,wrong:0};route();">Ещё раунд</button>
    </div></div>`;
}
let currentMcOptions = [];
function mcOptions(w){
  const correctText = w.ru.split(';')[0].trim();
  let pool = state.words.filter(x=>x.id!==w.id && x.topic===w.topic);
  if(pool.length<3) pool = state.words.filter(x=>x.id!==w.id);
  const distractors = shuffle(pool).slice(0,3).map(d=>({text:d.ru.split(';')[0].trim(), correct:false}));
  return shuffle([{text:correctText, correct:true}, ...distractors]);
}
function renderMC(el, w){
  currentMcOptions = mcOptions(w);
  el.innerHTML = practiceHeader()+
    `<div class="card flash" style="min-height:200px;position:relative;"><div style="position:absolute;top:16px;right:16px;"><button class="icon-btn" onclick="speak('${w.word.replace(/'/g,'')}')">${ICONS.speak}</button></div>
    <div class="flash-word">${escapeHtml(w.word)}</div><div class="flash-ipa">${escapeHtml(w.ipa)}</div></div>
    <div class="mc-options" id="mc-options">${currentMcOptions.map((o,i)=>`<button class="mc-opt" id="mc-opt-${i}" onclick="answerMC(${i})">${escapeHtml(o.text)}</button>`).join('')}</div>`;
}
function answerMC(i){
  const w = currentPracticeWord();
  const opts = currentMcOptions; const chosen = opts[i];
  opts.forEach((o,idx)=>{
    const btn = document.getElementById('mc-opt-'+idx); if(!btn) return;
    btn.onclick=null;
    if(o.correct) btn.classList.add('correct'); else if(idx===i) btn.classList.add('wrong');
  });
  nextPracticeItem('mc', w.id, chosen.correct);
}
function renderTypeEn(el, w){
  el.innerHTML = practiceHeader()+
    `<div class="card flash" style="min-height:200px;"><div class="flash-ru" style="font-size:30px">${escapeHtml(w.ru.split(';')[0])}</div>
    <div class="flash-ex-ru" style="max-width:440px">${escapeHtml(w.exampleRu)}</div></div>
    <input class="type-input" id="type-input" placeholder="Напиши слово по-английски…" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div class="feedback-row" id="type-feedback"></div>
    <div style="display:flex;gap:10px;margin-top:6px;"><button class="btn btn-primary" onclick="checkTypeEn()">Проверить</button></div>`;
  const input = document.getElementById('type-input'); input.focus();
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') checkTypeEn(); });
}
function checkTypeEn(){
  const w = currentPracticeWord(); const input = document.getElementById('type-input');
  if(input.disabled) return;
  const correct = normalizeAnswer(input.value)===normalizeAnswer(w.word);
  input.classList.add(correct?'correct':'wrong'); input.disabled=true;
  const fb = document.getElementById('type-feedback'); fb.className='feedback-row '+(correct?'correct':'wrong');
  fb.innerHTML = correct? 'Верно!' : 'Правильный ответ: <b>'+escapeHtml(w.word)+'</b>';
  nextPracticeItem('type_en', w.id, correct);
}
function blankOutWord(sentence, word){
  try{ return escapeHtml(sentence).replace(new RegExp('\\b('+escapeRegex(word)+')\\b','i'), '<mark>____</mark>'); }
  catch(e){ return escapeHtml(sentence); }
}
function renderFill(el, w){
  el.innerHTML = practiceHeader()+
    `<div class="card flash" style="min-height:200px;"><div class="flash-ex" style="font-size:18px;max-width:480px">${blankOutWord(w.exampleEn,w.word)}</div>
    <div class="flash-ex-ru" style="max-width:480px">${escapeHtml(w.exampleRu)}</div></div>
    <input class="type-input" id="type-input" placeholder="Пропущенное слово…" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div class="feedback-row" id="type-feedback"></div>
    <div style="display:flex;gap:10px;margin-top:6px;"><button class="btn btn-primary" onclick="checkFill()">Проверить</button></div>`;
  const input = document.getElementById('type-input'); input.focus();
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') checkFill(); });
}
function checkFill(){
  const w = currentPracticeWord(); const input = document.getElementById('type-input');
  if(input.disabled) return;
  const correct = normalizeAnswer(input.value)===normalizeAnswer(w.word);
  input.classList.add(correct?'correct':'wrong'); input.disabled=true;
  const fb = document.getElementById('type-feedback'); fb.className='feedback-row '+(correct?'correct':'wrong');
  fb.innerHTML = correct? 'Верно!' : 'Правильный ответ: <b>'+escapeHtml(w.word)+'</b>';
  nextPracticeItem('fill', w.id, correct);
}
function renderListen(el, w){
  el.innerHTML = practiceHeader()+
    `<div class="card flash" style="min-height:200px;">
      <button class="icon-btn" style="width:60px;height:60px;border-radius:50%;background:var(--accent);color:var(--accent-ink);border:none;" onclick="speak('${w.word.replace(/'/g,'')}')">
      <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5H4Z"/><path d="M16.5 8.5a5 5 0 0 1 0 7"/></svg></button>
      <div class="flash-hint" style="position:static;margin-top:10px;">Нажми, чтобы прослушать ещё раз</div>
    </div>
    <input class="type-input" id="type-input" placeholder="Что ты услышал(а)?" autocomplete="off" autocapitalize="off" spellcheck="false">
    <div class="feedback-row" id="type-feedback"></div>
    <div style="display:flex;gap:10px;margin-top:6px;"><button class="btn btn-primary" onclick="checkListen()">Проверить</button></div>`;
  speak(w.word);
  const input = document.getElementById('type-input'); input.focus();
  input.addEventListener('keydown', e=>{ if(e.key==='Enter') checkListen(); });
}
function checkListen(){
  const w = currentPracticeWord(); const input = document.getElementById('type-input');
  if(input.disabled) return;
  const correct = normalizeAnswer(input.value)===normalizeAnswer(w.word);
  input.classList.add(correct?'correct':'wrong'); input.disabled=true;
  const fb = document.getElementById('type-feedback'); fb.className='feedback-row '+(correct?'correct':'wrong');
  fb.innerHTML = correct ? 'Верно! — '+escapeHtml(w.ru.split(';')[0]) : 'Ты написал(а) «'+escapeHtml(input.value)+'». Правильно: <b>'+escapeHtml(w.word)+'</b>';
  nextPracticeItem('listen', w.id, correct);
}
function renderSpeak(el, w){
  const supported = !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  el.innerHTML = practiceHeader()+
    `<div class="card flash" style="min-height:200px;position:relative;"><div style="position:absolute;top:16px;right:16px;"><button class="icon-btn" onclick="speak('${w.word.replace(/'/g,'')}')">${ICONS.speak}</button></div>
    <div class="flash-word">${escapeHtml(w.word)}</div><div class="flash-ipa">${escapeHtml(w.ipa)}</div></div>
    ${supported ?
      `<div class="mic-row"><button class="mic-btn" id="mic-btn" onclick="startSpeakCheck()">${ICONS.mic}</button><div class="heard-text" id="heard-text">Нажми и произнеси слово вслух</div></div>`
      : `<div class="feedback-row" style="text-align:center">Распознавание речи не поддерживается в этом браузере. Попробуй Chrome на компьютере.</div>
        <div style="display:flex;justify-content:center;margin-top:10px;"><button class="btn btn-outline" onclick="nextPracticeItem('speak', ${w.id}, true)">Пропустить →</button></div>`}`;
}
function startSpeakCheck(){
  const w = currentPracticeWord();
  const Rec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if(!Rec) return;
  const rec = new Rec();
  rec.lang='en-US'; rec.interimResults=false; rec.maxAlternatives=3;
  const btn = document.getElementById('mic-btn'); const heard = document.getElementById('heard-text');
  btn.classList.add('listening'); heard.textContent='Слушаю…';
  rec.onresult = (e)=>{
    const alts = Array.from(e.results[0]).map(r=>normalizeAnswer(r.transcript));
    const target = normalizeAnswer(w.word);
    const correct = alts.some(t=>t===target || t.includes(target));
    heard.textContent = 'Услышано: «'+e.results[0][0].transcript+'»'+(correct?' ✓':' — попробуй ещё раз');
    btn.classList.remove('listening');
    nextPracticeItem('speak', w.id, correct);
  };
  rec.onerror = ()=>{ btn.classList.remove('listening'); heard.textContent='Не удалось распознать. Попробуй снова.'; };
  rec.onend = ()=>{ btn.classList.remove('listening'); };
  try{ rec.start(); }catch(e){ heard.textContent='Ошибка микрофона.'; btn.classList.remove('listening'); }
}
async function renderPractice(el){
  const mode = currentViewArg();
  if(state.practiceMode!==mode || state.practicePool.length===0){
    state.practiceMode = mode;
    state.practicePool = buildPracticePool();
    state.practiceIdx = 0;
    state.practiceScore = {correct:0,wrong:0};
  }
  if(state.practiceIdx>=state.practicePool.length){ el.innerHTML=practiceDone(); return; }
  const w = currentPracticeWord();
  const dispatch = {mc:renderMC, type_en:renderTypeEn, fill:renderFill, listen:renderListen, speak:renderSpeak};
  (dispatch[mode]||renderMC)(el, w);
}

/* ===== word bank ===== */
function statusLabelRu(s){ return {new:'Новое', review:'В изучении', mastered:'Освоено'}[s] || s; }
function bankFiltered(){
  const q = state.bankQuery.trim().toLowerCase();
  return state.words.filter(w=>{
    if(state.bankStatus && w.status!==state.bankStatus) return false;
    if(q && !(w.word.toLowerCase().includes(q) || w.ru.toLowerCase().includes(q))) return false;
    return true;
  });
}
function bankRowHtml(w){
  return `<tr class="bank-row" onclick="openWordModal(${w.id})">
    <td style="width:34px"><button class="star-btn ${w.starred?'on':''}" onclick="event.stopPropagation();toggleStarRow(${w.id})">${w.starred?ICONS.star:ICONS.starOutline}</button></td>
    <td><div class="bank-word">${escapeHtml(w.word)}</div><div style="font-size:11.5px;color:var(--ink-faint)">${escapeHtml(w.ipa)}</div></td>
    <td class="bank-ru">${escapeHtml(w.ru.split(';')[0])}</td>
    <td><span class="tag">${escapeHtml(w.topic)}</span></td>
    <td class="status-${w.status}"><span class="status-dot"></span>${statusLabelRu(w.status)}</td>
    <td style="width:34px"><button class="icon-btn" style="width:28px;height:28px" onclick="event.stopPropagation();speak('${w.word.replace(/'/g,"")}')">${ICONS.speak}</button></td>
  </tr>`;
}
function updateBankResults(){
  const container = document.getElementById('bank-results'); if(!container) return;
  const list = bankFiltered(); const pageSize=100;
  const shown = list.slice(0, state.bankPage*pageSize);
  container.innerHTML = `<div class="bank-count">${list.length} слов найдено</div>
    <div class="bank-table-wrap"><table class="bank-table"><tbody>${shown.map(bankRowHtml).join('')}</tbody></table></div>
    ${shown.length<list.length ? `<div class="load-more"><button class="btn btn-outline" onclick="state.bankPage++;updateBankResults();">Показать ещё (${list.length-shown.length})</button></div>` : ''}`;
}
function renderBank(el){
  el.innerHTML = `<button class="btn btn-ghost btn-sm session-back" onclick="location.hash='settings'">← Настройки</button>
    <div class="page-head"><div><div class="page-title">Слова уровня <span class="pill pill-level-${state.client.level}">${state.client.level}</span></div><div class="page-sub">${state.words.length} слов</div></div></div>
    <div class="bank-controls">
      <input class="search-input" id="bank-search" placeholder="Искать слово или перевод…" value="${escapeHtml(state.bankQuery)}">
      <select class="chip-select" id="bank-status-sel">
        <option value="">Любой статус</option>
        <option value="new" ${state.bankStatus==='new'?'selected':''}>Новое</option>
        <option value="review" ${state.bankStatus==='review'?'selected':''}>В изучении</option>
        <option value="mastered" ${state.bankStatus==='mastered'?'selected':''}>Освоено</option>
      </select>
    </div>
    <div id="bank-results"></div>`;
  document.getElementById('bank-search').addEventListener('input', e=>{ state.bankQuery=e.target.value; state.bankPage=1; updateBankResults(); });
  document.getElementById('bank-status-sel').addEventListener('change', e=>{ state.bankStatus=e.target.value||null; state.bankPage=1; updateBankResults(); });
  updateBankResults();
}
async function toggleStarRow(id){
  try{
    const res = await api(`/api/words/${id}/star`, {method:'POST'});
    const w = state.wordsById[id]; if(w) w.starred = res.starred;
    updateBankResults();
  }catch(e){ toast('Не удалось сохранить'); }
}
function openWordModal(id){
  const w = state.wordsById[id]; if(!w) return;
  document.getElementById('modal-root').innerHTML = `<div class="modal-backdrop" onclick="if(event.target===this) closeModal()"><div class="modal card">
    <div class="modal-top"><div>
      <div class="flash-word" style="font-size:30px">${escapeHtml(w.word)}</div>
      <div class="flash-ipa">${escapeHtml(w.ipa)} · ${POS_LABELS[w.pos]||w.pos}</div>
    </div><button class="icon-btn" onclick="closeModal()">${ICONS.close}</button></div>
    <div class="modal-meta"><span class="pill pill-level-${w.level}">${w.level}</span><span class="tag">${escapeHtml(w.topic)}</span><span class="pill pill-muted status-${w.status}"><span class="status-dot"></span>${statusLabelRu(w.status)}</span></div>
    <div class="flash-ru" style="margin-top:14px;font-size:22px">${escapeHtml(w.ru)}</div>
    <div class="flash-ex" style="margin-top:12px;max-width:none;text-align:left">${highlightWord(escapeHtml(w.exampleEn),w.word)}</div>
    <div class="flash-ex-ru" style="max-width:none;text-align:left">${escapeHtml(w.exampleRu)}</div>
    <div class="modal-actions">
      <button class="btn btn-outline" onclick="speak('${w.word.replace(/'/g,"")}')">${ICONS.speak} Слово</button>
      <button class="btn btn-outline" onclick="speak('${w.exampleEn.replace(/'/g,"")}')">${ICONS.speak} Пример</button>
      <button class="btn btn-ghost" onclick="toggleStarRow(${w.id});setTimeout(()=>openWordModal(${w.id}),50)">${w.starred?'★ В избранном':'☆ В избранное'}</button>
    </div>
  </div></div>`;
}
function closeModal(){ document.getElementById('modal-root').innerHTML=''; }

/* ===== stats ===== */
function heatColor(n, target){
  if(n<=0) return 'var(--surface-2)';
  const ratio = target>0 ? n/target : 0;
  if(ratio<0.5) return 'var(--accent-soft)';
  if(ratio<1) return 'color-mix(in srgb, var(--accent) 55%, var(--surface-2))';
  return 'var(--accent)';
}
async function renderStats(el){
  const now = new Date();
  const data = await api(`/api/stats/month?year=${now.getFullYear()}&month=${now.getMonth()+1}`);
  const byDate = {}; data.days.forEach(d=>byDate[d.date]=d);
  const daysInMonth = new Date(now.getFullYear(), now.getMonth()+1, 0).getDate();
  const cells = [];
  for(let d=1; d<=daysInMonth; d++){
    const key = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const row = byDate[key];
    cells.push(`<div class="heat-cell" style="background:${heatColor(row?.completed||0, row?.target||state.client.dailyGoal)}" title="${key}: ${row?.completed||0}/${row?.target||0}"></div>`);
  }
  el.innerHTML = `<button class="btn btn-ghost btn-sm session-back" onclick="location.hash='settings'">← Настройки</button>
    <div class="page-head"><div><div class="page-title">Статистика</div><div class="page-sub">Твой прогресс в изучении</div></div></div>
    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-num">${data.totalMastered}</div><div class="stat-label">Освоено</div></div>
      <div class="card stat-card"><div class="stat-num">${data.totalInProgress}</div><div class="stat-label">В изучении</div></div>
      <div class="card stat-card"><div class="stat-num">${data.accuracyPercent}%</div><div class="stat-label">Точность</div></div>
      <div class="card stat-card"><div class="stat-num">${data.streak}</div><div class="stat-label">Дней подряд</div></div>
    </div>
    <div class="card chart-wrap"><div class="section-title">Календарь занятий — ${MONTHS_RU[now.getMonth()]}</div>
      <div class="heatmap" style="grid-template-rows:repeat(7,1fr);">${cells.join('')}</div>
    </div>`;
}

/* ===== settings ===== */
function renderSettings(el){
  const c = state.client;
  el.innerHTML = `<div class="page-head"><div><div class="page-title">Настройки</div><div class="page-sub">Профиль и цели</div></div></div>
    <div class="card panel">
      <div class="field-group"><div class="field-label">Уровень</div><div class="field-hint">Материалы и слова будут показаны только для выбранного уровня</div>
        <div class="level-grid" style="grid-template-columns:repeat(5,1fr);">${LEVELS.map(lv=>`<button class="level-btn ${c.level===lv?'on':''}" style="${c.level===lv?'border-color:var(--accent);background:var(--accent-soft);':''}" onclick="changeLevel('${lv}')"><div class="lv-code">${lv}</div></button>`).join('')}</div></div>
      <div class="field-group"><div class="field-label">Цель в день (на каждый блок)</div>
        <div class="slider-row"><input type="range" min="5" max="50" step="5" value="${c.dailyGoal}" id="goal-range"><div class="range-val" id="goal-val">${c.dailyGoal}</div></div></div>
    </div>
    <div class="section-title" style="margin-top:22px;">Категории</div>
    <div class="card panel" style="padding:8px 20px;">
      <div class="category-row" onclick="location.hash='bank'">
        <div class="cat-row-main">${ICONS.bank}<div><div class="cat-row-title">Слова уровня <span class="pill pill-level-${c.level}">${c.level}</span></div><div class="field-hint" style="margin:2px 0 0;">${state.words.length} слов, поиск и статусы</div></div></div>
        <span class="cat-row-arrow">›</span>
      </div>
      <div class="category-row" onclick="location.hash='stats'">
        <div class="cat-row-main">${ICONS.stats}<div><div class="cat-row-title">Статистика</div><div class="field-hint" style="margin:2px 0 0;">Прогресс, точность, календарь занятий</div></div></div>
        <span class="cat-row-arrow">›</span>
      </div>
    </div>`;
  document.getElementById('goal-range').addEventListener('input', e=>{ document.getElementById('goal-val').textContent=e.target.value; });
  document.getElementById('goal-range').addEventListener('change', async e=>{
    try{ state.client = await api('/api/client/goal', {method:'PUT', body: JSON.stringify({dailyGoal: parseInt(e.target.value,10)})}); toast('Сохранено'); }
    catch(err){ toast('Не удалось сохранить'); }
  });
}
async function changeLevel(level){
  if(level===state.client.level) return;
  try{
    await api('/api/client/level', {method:'PUT', body: JSON.stringify({level})});
    location.hash = 'home';
    location.reload();
  }catch(e){ toast('Не удалось изменить уровень'); }
}

boot();
