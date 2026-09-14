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
function fmtIvl(days){
  if(days<1) return '<1д';
  if(days<30) return days+'д';
  if(days<365) return Math.round(days/30)+'мес';
  return (days/365).toFixed(1)+'г';
}
function previewIvl(word, grade){
  const ivl = word.ivl || 0;
  if(!ivl) return grade==='hard'?1:2;
  return grade==='hard' ? Math.max(1,Math.round(ivl*1.2)) : Math.max(1,Math.round(ivl*2.5));
}
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
  learnQueue: [], learnFlipped: false,
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
}

const NAV = [
  {id:'home', label:'Главная', icon:'home'},
  {id:'bank', label:'Банк слов', icon:'bank'},
  {id:'stats', label:'Статистика', icon:'stats'},
  {id:'settings', label:'Настройки', icon:'settings'},
];
function currentViewId(){ return (location.hash.replace('#','').split('/')[0]) || 'home'; }
function currentViewArg(){ return location.hash.split('/')[1] || null; }

function renderShell(){
  const view = currentViewId();
  const navViewId = ['blocks','session','practice'].includes(view) ? 'home' : view;
  document.getElementById('sidebar').style.display = '';
  document.getElementById('tabbar').style.display = '';
  document.getElementById('sidebar').innerHTML =
    '<div class="brand"><div class="brand-mark">L</div><div class="brand-name">Lexi</div></div>'+
    '<div class="nav">'+NAV.map(n=>`<button class="nav-item${navViewId===n.id?' active':''}" onclick="location.hash='${n.id}'">${ICONS[n.icon]}<span>${n.label}</span></button>`).join('')+'</div>'+
    '<div class="nav-spacer"></div>'+
    '<div class="sidebar-foot">'+escapeHtml(state.client?.name||'')+(state.client?.name?' · ':'')+'Уровень '+(state.client?.level||'—')+'</div>';
  document.getElementById('tabbar').innerHTML = NAV.map(n=>
    `<button class="tab-item${navViewId===n.id?' active':''}" onclick="location.hash='${n.id}'">${ICONS[n.icon]}<span>${n.label}</span></button>`
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

async function renderHome(el){
  const today = await api('/api/session/today');
  state.today = today;
  const mastered = state.words.filter(w=>w.status==='mastered').length;
  const inProgress = state.words.filter(w=>w.status!=='new').length;
  const overallPct = today.totalTarget>0 ? Math.min(100, Math.round(100*today.totalCompleted/today.totalTarget)) : 0;

  const firstName = (state.client.name||'').split(' ')[0];

  el.innerHTML = `
    <div class="page-head"><div>
      <div class="page-title">Привет${firstName?', '+escapeHtml(firstName):''}!</div>
      <div class="page-sub">${todayLabelRu()} · уровень ${state.client.level} · в изучении ${inProgress} из ${state.words.length} слов</div>
    </div></div>
    <div class="stat-grid">
      <div class="card stat-card"><div class="stat-num">${overallPct}%</div><div class="stat-label">Прогресс за сегодня</div></div>
      <div class="card stat-card"><div class="stat-num">${mastered}</div><div class="stat-label">Освоено твёрдо</div></div>
      <div class="card stat-card"><div class="stat-num">${inProgress}</div><div class="stat-label">В изучении</div></div>
      <div class="card stat-card"><div class="stat-num">${state.words.length}</div><div class="stat-label">Всего слов (${state.client.level})</div></div>
    </div>
    <div class="card cta-card primary">
      <div class="cta-title">Начать занятие</div>
      <div class="cta-sub">6 блоков на сегодня — заполни прогресс-бар по каждому</div>
      <div><button class="btn btn-primary" onclick="location.hash='blocks'">Поехали →</button></div>
    </div>
    <div class="section-title" style="margin-top:28px;">Как устроена Lexi</div>
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

/* ===== block picker ===== */
async function renderBlocks(el){
  const today = await api('/api/session/today');
  state.today = today;
  const byBlock = {}; today.blocks.forEach(b=>byBlock[b.block]=b);
  const overallPct = today.totalTarget>0 ? Math.min(100, Math.round(100*today.totalCompleted/today.totalTarget)) : 0;

  el.innerHTML = `
    <div class="page-head"><div><div class="page-title">Занятие на сегодня</div><div class="page-sub">Заполни прогресс-бар в каждом блоке</div></div></div>
    <div class="card overall-progress">
      <div style="display:flex;justify-content:space-between;font-size:13px;color:var(--ink-muted);"><span>Общий прогресс</span><span>${overallPct}%</span></div>
      <div class="bar-track"><div class="bar-fill" style="width:${overallPct}%"></div></div>
    </div>
    <div class="block-grid">
      ${BLOCKS.map(b=>{
        const bp = byBlock[b.id] || {completed:0, target: state.client.dailyGoal};
        const pct = bp.target>0 ? Math.min(100, Math.round(100*bp.completed/bp.target)) : 0;
        const done = pct>=100;
        return `<div class="card block-card${done?' block-done':''}" onclick="openBlock('${b.id}')">
          <div class="block-ic">${b.ic}</div>
          <div class="block-title">${b.title}${done?' ✓':''}</div>
          <div class="block-desc">${b.desc}</div>
          <div class="block-progress">
            <div class="bar-track"><div class="bar-fill" style="width:${pct}%"></div></div>
            <div class="block-progress-label">${bp.completed}/${bp.target}${done?' · готово, можно продолжать':''}</div>
          </div>
        </div>`;
      }).join('')}
    </div>
  `;
}
function openBlock(id){
  if(id==='learn') location.hash = 'session';
  else location.hash = 'practice/'+id;
}

/* ===== learn session (swipe cards) ===== */
async function renderLearnSession(el){
  if(state.learnQueue.length===0){
    const q = await api('/api/session/queue');
    state.learnQueue = shuffleInterleave(q.due, q.new);
  }
  if(state.learnQueue.length===0){
    el.innerHTML = sessionEmptyHtml();
    return;
  }
  const w = state.learnQueue[0];
  el.innerHTML = `<div class="session-shell">
    <div class="session-top"><div class="bar-track"><div class="bar-fill" style="width:0%"></div></div><div class="session-count" id="learn-count"></div></div>
    <div class="flash-stage"><div class="flash" id="flash-card">
      <div class="flash-badges"><span class="pill pill-level-${w.level}">${w.level}</span>
        <div class="right-badges"><button class="icon-btn" onclick="event.stopPropagation();speak('${w.word.replace(/'/g,"")}')">${ICONS.speak}</button></div></div>
      <div class="swipe-flag know" id="swipe-flag">Знаю ✓</div>
      <div class="flash-word">${escapeHtml(w.word)}</div>
      <div class="flash-ipa">${escapeHtml(w.ipa)} · ${POS_LABELS[w.pos]||w.pos}</div>
      ${state.learnFlipped ? `
        <div class="flash-ru">${escapeHtml(w.ru)}</div>
        <div class="flash-ex">${highlightWord(escapeHtml(w.exampleEn), w.word)}</div>
        <div class="flash-ex-ru">${escapeHtml(w.exampleRu)}</div>
      ` : `<div class="flash-hint">свайпни — если знаешь, тапни — посмотреть перевод</div>`}
    </div></div>
    ${state.learnFlipped ? `<div class="grade-row">
      <button class="grade-btn hard" onclick="gradeLearn('hard')">Трудно<small>${fmtIvl(previewIvl(w,'hard'))}</small></button>
      <button class="grade-btn good" onclick="gradeLearn('good')">Запомнил<small>${fmtIvl(previewIvl(w,'good'))}</small></button>
    </div>` : ''}
  </div>`;
  attachSwipeHandlers(document.getElementById('flash-card'));
}
function sessionEmptyHtml(){
  return `<div class="session-shell"><div class="card session-empty">
    <div class="big-ic">🎉</div>
    <div style="font-weight:700;font-size:17px;margin-bottom:6px;">Все карточки на сегодня пройдены!</div>
    <div style="margin-bottom:18px;">Загляни в другие блоки или вернись позже.</div>
    <button class="btn btn-primary" onclick="location.hash='blocks'">К занятиям</button>
  </div></div>`;
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
  cardEl.addEventListener('pointerdown', e=>{
    dragState = {startX:e.clientX, startY:e.clientY, dx:0, dy:0, moved:false};
    cardEl.setPointerCapture(e.pointerId);
    cardEl.classList.add('swiping');
  });
  cardEl.addEventListener('pointermove', e=>{
    if(!dragState) return;
    dragState.dx = e.clientX - dragState.startX;
    dragState.dy = e.clientY - dragState.startY;
    if(Math.abs(dragState.dx)>6 || Math.abs(dragState.dy)>6) dragState.moved = true;
    cardEl.style.transform = `translate(${dragState.dx}px, ${dragState.dy*0.2}px) rotate(${dragState.dx/18}deg)`;
    const flag = document.getElementById('swipe-flag');
    if(flag) flag.style.opacity = Math.min(1, Math.abs(dragState.dx)/90);
  });
  const finish = e=>{
    if(!dragState) return;
    const {dx, moved} = dragState;
    cardEl.classList.remove('swiping');
    if(!moved){
      dragState = null;
      cardEl.style.transform = '';
      if(!state.learnFlipped){ state.learnFlipped = true; route(); }
      return;
    }
    if(Math.abs(dx) > 90 && !state.learnFlipped){
      const dir = dx>0 ? 1 : -1;
      cardEl.style.transition = 'transform .3s ease, opacity .3s ease';
      cardEl.style.transform = `translate(${dir*700}px, ${dragState.dy}px) rotate(${dir*24}deg)`;
      cardEl.style.opacity = '0';
      dragState = null;
      setTimeout(()=>gradeLearn('easy'), 300);
    } else {
      cardEl.style.transition = 'transform .2s ease';
      cardEl.style.transform = 'translate(0,0) rotate(0)';
      const flag = document.getElementById('swipe-flag');
      if(flag) flag.style.opacity = 0;
      dragState = null;
    }
  };
  cardEl.addEventListener('pointerup', finish);
  cardEl.addEventListener('pointercancel', finish);
}
async function gradeLearn(grade){
  const w = state.learnQueue[0];
  if(!w) return;
  try{ await api('/api/session/review', {method:'POST', body: JSON.stringify({wordId:w.id, grade})}); }
  catch(e){ toast('Не удалось сохранить прогресс'); }
  state.learnQueue.shift();
  state.learnFlipped = false;
  route();
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
  return `<div class="practice-head"><button class="btn btn-ghost btn-sm" onclick="location.hash='blocks'">← Занятия</button>
    <div class="score-pill">${state.practiceIdx}/${state.practicePool.length} · ✓ ${state.practiceScore.correct} ✗ ${state.practiceScore.wrong}</div></div>`;
}
function practiceDone(){
  return practiceHeader()+`<div class="card session-empty"><div class="big-ic">🏁</div>
    <div style="font-weight:700;font-size:17px;margin-bottom:6px;">Раунд завершён</div>
    <div style="margin-bottom:18px;">Правильно ${state.practiceScore.correct} из ${state.practicePool.length}</div>
    <div style="display:flex;gap:10px;justify-content:center;">
      <button class="btn btn-outline" onclick="location.hash='blocks'">К занятиям</button>
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
  el.innerHTML = `<div class="page-head"><div><div class="page-title">Банк слов</div><div class="page-sub">${state.words.length} слов уровня ${state.client.level}</div></div></div>
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
  el.innerHTML = `<div class="page-head"><div><div class="page-title">Статистика</div><div class="page-sub">Твой прогресс в изучении</div></div></div>
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
    state.client = await api('/api/client/level', {method:'PUT', body: JSON.stringify({level})});
    const words = await api('/api/words');
    state.words = words; rebuildWordIndex();
    toast('Уровень изменён на '+level);
    route();
  }catch(e){ toast('Не удалось изменить уровень'); }
}

boot();
