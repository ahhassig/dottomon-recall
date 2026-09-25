import {initialState,transition,cityComplete,remainingAt,locationStatus,isPlaying} from './engine.js';
import {LOCATIONS,CITY_IDS,PALACE_IDS} from './data/locations.js';
import {OPENING,ENCOUNTERS,SCATTER,hintFor} from './data/dialogue.js';
import {ENDINGS} from './data/endings.js';

let state=initialState();
const app=document.querySelector('#app');
const modal=document.querySelector('#modal');
let lastFocus=null;
const time=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toString().padStart(2,'0')}`;
const paths={
  tea:'M5 9h13v7a5 5 0 0 1-5 5h-3a5 5 0 0 1-5-5V9Zm13 1h2a3 3 0 0 1 0 6h-2M8 3v2m5-2v2M3 24h19',
  flask:'M10 3h8m-6 0v8L5 23a2 2 0 0 0 2 3h14a2 2 0 0 0 2-3l-7-12V3M8 18h12',
  market:'M3 10 6 3h16l3 7M4 11v14h20V11M10 25v-8h8v8M2 10c0 5 6 5 6 0 0 5 6 5 6 0 0 5 6 5 6 0 0 5 6 5 6 0',
  water:'M3 10c4-4 7 4 11 0s7 4 11 0M3 17c4-4 7 4 11 0s7 4 11 0M3 24c4-4 7 4 11 0s7 4 11 0M14 2v3',
  palace:'M3 25V12l5-4 5 4v13m2 0V7l5-5 5 5v18M1 25h26M7 15v2m0 3v2m12-12v3m4 3v3m-4 2v4',
  book:'M3 4c4-1 8 0 11 2 3-2 7-3 11-2v20c-4-1-8 0-11 2-3-2-7-3-11-2V4Zm11 2v20M6 10h4m-4 5h4m8-5h4m-4 5h4',
  seal:'M14 2 23 7v10l-9 8-9-8V7l9-5Zm0 6v9m-4-5h8',
  passage:'M4 25V3h20v22M9 25V9h10v16M1 25h26m-13-9v9',
  crate:'M3 8h22v17H3V8Zm0 0 5-5h12l5 5M9 9v16m10-16v16M3 16h22',
  star:'M14 2 17 10 25 14 17 17 14 26 11 17 3 14 11 10Z',
  phone:'M7 3 3 6c0 11 8 19 19 19l3-4-6-5-3 3-7-7 3-3-5-6Z',
  home:'M3 13 14 3l11 10M6 11v14h16V11m-11 14v-8h6v8',
  lock:'M7 12V8a7 7 0 0 1 14 0v4M4 12h20v14H4V12Zm10 5v4',
  check:'m5 14 6 6L24 6'
};
const icon=(name,cls='')=>`<svg class="icon ${cls}" viewBox="0 0 28 28" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name]||paths.star}"/></svg>`;
const button=(label,action,cls='button',extra='')=>`<button class="${cls}" data-action="${action}" ${extra}>${label}</button>`;
const lines=items=>items.map(item=>Array.isArray(item)?`<blockquote class="dialogue"><cite>${item[0]}</cite><p>${item[1]}</p></blockquote>`:`<p>${item}</p>`).join('');
function puff(count=1,small=false) {
  return `<div class="puffs ${small?'puffs--small':''}" aria-hidden="true">${Array.from({length:count},(_,i)=>`<div class="puff puff--${i}"><i class="tuft"></i><i class="eye"></i><i class="foot foot--left"></i><i class="foot foot--right"></i></div>`).join('')}</div>`;
}
const brand=()=>`<header class="brandbar"><div class="wordmark">${icon('star')}<span>DOTTOMON <b>RECALL</b></span></div><span class="edition">MARINA AU <i>·</i> 0.1</span></header>`;
function hud() {
  return `<div class="hud-wrap"><section class="hud" aria-label="Mission status">
    <div class="stat stat--time ${state.timeRemaining<=300?'urgent':''}"><span>TIME</span><strong data-testid="time">${time(state.timeRemaining)}</strong><small>Action-based</small></div>
    <div class="stat ${state.stress?'strained':''}"><span>STRESS</span><strong data-testid="stress">${state.stress}<em>%</em></strong><div class="stress-track" aria-hidden="true"><i style="width:${state.stress}%"></i></div></div>
    <div class="stat"><span>DOTTOMONS RECOVERED</span><strong data-testid="recovered">${state.recovered}<em> / 7</em></strong><div class="pips" aria-hidden="true">${Array.from({length:7},(_,i)=>`<i class="${i<state.recovered?'lit':''}"></i>`).join('')}</div></div>
    <div class="stat"><span>CIGARETTES SMOKED</span><strong data-testid="cigarettes">${state.cigarettes}</strong><small>Automatic breaks</small></div>
    </section><nav class="utilities" aria-label="Mission actions">${button(`${icon('phone')}Call penthouse`,'call-open','utility')}${button(`${icon('home')}Return home`,'home-open','utility')}${button('?','rules','utility utility--help','aria-label="How to play"')}</nav></div>`;
}
function titleScreen() {
  return `<main id="main" class="title-screen" tabindex="-1"><div class="title-copy"><p class="eyebrow">A SNEZHNOGRAD MISADVENTURE</p><h1>Dottomon<br><span>Recall</span></h1><div class="small-rule"></div><p class="title-tag">Seven missing. <br>Thirty minutes. <br>One migraine.</p><p class="title-desc">You’re Feofan. Seven of your husband’s very clever, very opinionated assistants have escaped.<br>Bring them home. Keep his afternoon quiet.</p><div class="title-actions">${button('Begin recall <span aria-hidden="true">↗</span>','begin','button button--primary')}${button('How to play','rules','text-button')}</div><p class="reading-note">Your time only moves when you act. Read at your own pace.</p></div><div class="title-visual"><div class="orbit orbit--one"></div><div class="orbit orbit--two"></div><span class="orbit-tick tick--top">N</span><span class="orbit-tick tick--bottom">SNEZHNOGRAD · WINTER</span>${puff(3)}<div class="count-ticket"><span>ASSISTANTS AT HOME</span><strong>13 <em>/ 20</em></strong><span class="ticket-warning">A small discrepancy.</span></div></div></main><footer class="title-footer"><span>A story from Lex’s Marina AU</span><span>Original interface · Unofficial fan game</span></footer>`;
}
function sceneArt(scene,count=1,tag='') {
  return `<div class="scene-art scene-art--${scene}"><div class="scene-rings" aria-hidden="true"></div><div class="scene-emblem">${icon(scene==='penthouse'?'home':scene==='laboratory'?'flask':LOCATIONS[scene]?.icon||'palace')}</div>${count?puff(count):'<div class="empty-sigil" aria-hidden="true">◇</div>'}<span class="scene-art-label">${tag}</span></div>`;
}
function opening() {
  const story=OPENING[state.intro];
  return `<main id="main" class="opening page" tabindex="-1"><div class="section-heading"><p class="eyebrow">${story.eyebrow}</p><div class="chapter-count">0${state.intro+1} <span>/ 03</span></div><h1>${story.title}</h1></div><div class="story-layout">${sceneArt(story.scene,state.intro===0?1:3,state.intro===1?'13 PRESENT / 20 EXPECTED':'BEFORE THE RECALL')}<article class="prose">${lines(story.lines)}<div class="story-next">${button(state.intro===2?'Start the search <span aria-hidden="true">↗</span>':'Continue <span aria-hidden="true">→</span>','intro-next','button button--primary')}</div></article></div></main>`;
}
const positions={
  pastry:[22,24,25,28],alchemy:[79,48,75,28],market:[22,76,25,73],promenade:[73,83,75,73],palace:[72,15,50,8],
  archives:[23,20,25,22],operations:[78,20,75,22],service:[20,73,25,70],reagents:[81,69,75,70],depot:[53,89,50,91]
};
function mapNode(id) {
  const palace=id==='palace';
  const place=palace?{name:'Zapolyarny Palace',icon:cityComplete(state)?'palace':'lock',travel:60}:LOCATIONS[id];
  const locked=palace&&!cityComplete(state);
  const status=palace?(locked?'LOCKED · FIND ALL 3 IN THE CITY':'UNLOCKED'):locationStatus(state,id);
  const xy=positions[id];
  const done=['CLEARED','SECURED'].includes(status);
  return `<button class="map-node ${done?'node--done':''} ${palace?'node--palace':''} ${locked?'node--locked':''}" style="--x:${xy[0]}%;--y:${xy[1]}%;--mx:${xy[2]}%;--my:${xy[3]}%" data-action="visit" data-id="${id}" ${locked?'disabled':''} aria-label="${place.name}, ${status}, ${place.travel} seconds travel"><span class="node-medallion">${icon(place.icon)}</span><span class="node-label">${place.name}</span><span class="node-state">${done?'✓ ':''}${status}</span>${locked?'':`<span class="node-time">${place.travel}s travel</span>`}</button>`;
}
function mapScreen() {
  const palace=state.palaceEntered;
  const cityCount=state.capturedDottomons.filter(id=>['tea-one','tea-two','chemist'].includes(id)).length;
  return `<main id="main" class="map-page page" tabindex="-1"><header class="section-heading"><p class="eyebrow">${palace?'02 · INSIDE THE PALACE':'01 · THE CITY SEARCH'}</p><h1>${palace?'Zapolyarny Palace':'Snezhnograd'}</h1><p>${palace?'Four assistants. Five rooms. Keep the laboratory quiet.':'Three assistants are somewhere in the city. Choose your next stop.'}</p></header><div class="map-layout"><aside class="mission-panel"><div class="dossier-number">RECALL ORDER <span>№ 007</span></div><h2>A quiet afternoon.</h2><p>Recover all seven before Zandik finishes his work.</p><div class="progress-stage ${cityCount===3?'stage--done':''}"><span>01</span><div><b>Search Snezhnograd</b><small>${cityCount} / 3 recovered ${cityCount===3?'✓':''}</small></div></div><div class="progress-stage ${palace?'stage--active':''}"><span>02</span><div><b>Secure the Palace</b><small>${palace?`${state.recovered-3} / 4 recovered`:'Find all three in the city first'}</small></div></div><div class="dossier-note"><span>FEOFAN</span><p>“${palace?'I’ve negotiated border agreements with fewer objections.':'They have centuries of research experience. They can find their way home.'}”</p></div><div class="map-legend"><span><i class="legend-unexplored"></i>Unexplored</span><span><i class="legend-done"></i>Cleared / secured</span></div><p class="map-help">Travel costs time. An empty-location search adds 30s. Returning to this map is free.</p></aside><section class="node-map ${palace?'node-map--palace':'node-map--city'}" aria-label="${palace?'Palace':'Snezhnograd'} location map"><div class="map-grid" aria-hidden="true"></div><span class="map-coordinate coord-top">${palace?'ZAPOLYARNY · INTERIOR':'SNEZHNOGRAD · CENTRAL DISTRICT'}</span><span class="map-compass" aria-hidden="true">N<br>✧</span><svg class="map-routes routes-desktop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${(palace?PALACE_IDS:[...CITY_IDS,'palace']).map(id=>`<path d="M48 49 L${positions[id][0]} ${positions[id][1]}"/>`).join('')}</svg><svg class="map-routes routes-mobile" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${(palace?PALACE_IDS:[...CITY_IDS,'palace']).map(id=>`<path d="M50 48 L${positions[id][2]} ${positions[id][3]}"/>`).join('')}</svg><button class="hub-node" data-action="hub"><span>${icon(palace?'palace':'star')}</span><b>${palace?'Lobby':'Plaza'}</b><small>YOU ARE HERE</small></button>${(palace?PALACE_IDS:[...CITY_IDS,'palace']).map(mapNode).join('')}<span class="map-coordinate coord-bottom">${palace?'RESEARCH WING · ACCESS RESTRICTED':'NORTHLAND BANK · PENTHOUSE NEARBY'}</span></section></div></main>`;
}
function encounter() {
  const id=state.location,place=LOCATIONS[id],story=ENCOUNTERS[id],remaining=remainingAt(state,id);
  const seen=place.dottomons.length>0 && !remaining.length;
  const content=seen?['The area remains secure. The assistant'+(place.dottomons.length>1?'s are':' is')+' safely back at the penthouse. There’s nothing more to recover here.']:id==='pastry'&&remaining.length===1?story.remaining:story.lines;
  let choices='';
  if (remaining.length) {
    choices=`<div class="capture-panel"><div class="capture-title"><span>${id==='pastry'?'TUTORIAL · A WILLING DEPARTURE':'CHOOSE YOUR APPROACH'}</span><small>${remaining.length} ${remaining.length===1?'assistant':'assistants'} here</small></div><div class="capture-buttons">${button(`<b>Safe capture</b><span>${id==='pastry'?'Guaranteed · 15s · No stress':'50% success · 15s on success'}</span>`,'capture','button button--primary','data-method="safe"')}${id==='pastry'?'':button('<b>Risky capture</b><span>Guaranteed · 15s · +50% stress</span>','capture','button button--risk','data-method="risky"')}</div>${id==='pastry'?'':`<p>A failed safe attempt costs 30s and +50% stress. At 100%: an automatic 60s smoking break resets stress.</p>`}</div>`;
  }
  return `<main id="main" class="encounter page" tabindex="-1"><div class="section-heading"><p class="eyebrow">${place.name} <span class="heading-cost">${place.travel}s travel${place.dottomons.length?'':' + 30s search'}</span></p><h1>${seen?'Already safely home.':story.title}</h1></div><div class="story-layout">${sceneArt(id,remaining.length,seen?'SECURED':place.dottomons.length?'CONTACT ESTABLISHED':'AREA CLEARED')}<article class="prose">${lines(content)}${!place.dottomons.length?'<div class="status-banner">✓ CLEARED · No Dottomons here</div>':''}${seen?'<div class="status-banner">✓ SECURED · No one has escaped again</div>':''}</article></div>${choices}<div class="back-row">${button(`← ${state.palaceEntered?'Palace map':'City map'}`,'map','text-button')}<span>No time cost</span></div></main>`;
}
function resultScreen() {
  const r=state.result,story=ENCOUNTERS[state.location];
  const text=r.success?(Array.isArray(story.success)?story.success[r.target==='tea-one'?0:1]:story.success):story.failures[(state.attempts[state.location]-1)%story.failures.length];
  const left=remainingAt(state,state.location).length;
  return `<main id="main" class="result-page page" tabindex="-1"><div class="result-card ${r.success?'result--success':'result--miss'}"><div class="result-mark">${icon(r.success?'check':'passage')}</div><p class="eyebrow">${r.success?'ASSISTANT RECOVERED':'STILL IN THIS LOCATION'}</p><h1>${r.success?'Safely home.':'A small tactical retreat.'}</h1><p class="result-text">${text}</p><div class="result-receipt"><span>TIME <b>−${r.cost}s</b></span><span>RECOVERED <b>${state.recovered} / 7</b></span><span>STRESS <b>${state.stress}%</b></span></div>${r.smoking?`<div class="smoking-break"><p class="eyebrow">AUTOMATIC BREAK · 100% → 0%</p><h2>A minute in the cold.</h2><p>Feofan steps aside. His hands are unsteady as he lights a cigarette. For a minute, the search has to wait. When he can continue, he puts it out and returns.</p><p class="break-cost">60s included above · Cigarette ${state.cigarettes}</p></div>`:''}${r.unlocked?'<div class="unlock-banner">✧ ZAPOLYARNY PALACE UNLOCKED<br><span>All three city assistants are safe.</span></div>':''}${button(left?(r.success?'Recover the other Dottomon':'Try again'):'Return to map','continue','button button--primary')}<p class="reading-note">Continue when you’re ready. Reading costs no time.</p></div></main>`;
}
function scatterScreen() {
  return `<main id="main" class="page" tabindex="-1"><div class="section-heading"><p class="eyebrow">Zapolyarny Palace · Lobby</p><h1>A moment of recognition.</h1></div><div class="story-layout">${sceneArt('lobby',3,'THREE CONTACTS · THREE DIRECTIONS')}<article class="prose">${lines(SCATTER)}${button('Search the Palace <span aria-hidden="true">↗</span>','map','button button--primary')}</article></div></main>`;
}
function endingScreen() {
  const ending=ENDINGS[state.ending],summary=state.endingSummary;
  return `<main id="main" class="ending-page ending--${ending.color} page" tabindex="-1"><div class="ending-heading"><span class="ending-seal">${ending.mark}</span><p class="eyebrow">${ending.label}</p><h1>${ending.title}</h1><div class="ending-tagline">${ending.tagline.map(x=>`<p>${x}</p>`).join('')}</div></div><div class="ending-layout"><article class="prose ending-prose">${lines(ending.lines(state))}</article><aside class="run-summary"><p class="eyebrow">RECALL REPORT</p><dl><div><dt>Time remaining</dt><dd>${time(summary.timeRemaining)}</dd></div><div><dt>Recovered during search</dt><dd>${summary.recovered} <small>/ 7</small></dd></div><div><dt>Cigarettes smoked</dt><dd>${summary.cigarettes}</dd></div></dl><p class="summary-outcome">${state.ending==='secret'?'All twenty are home. The seven escapees returned voluntarily.':state.ending==='good'?'All twenty are home. The laboratory stayed quiet.':state.ending==='breach'?`${summary.uncapturedPalace.length} uncaptured Palace assistant${summary.uncapturedPalace.length===1?'':'s'} reached the laboratory.`:'Zandik collected the remaining fugitives himself.'}</p>${button('Play again ↗','reset','button button--primary')}<p class="reading-note">A fresh search. Everything resets.</p></aside></div></main>`;
}
function render(focus=true) {
  document.body.dataset.region=state.palaceEntered?'palace':'city';
  document.body.dataset.phase=state.phase;
  const views={title:titleScreen,opening,map:mapScreen,encounter,result:resultScreen,scatter:scatterScreen,ending:endingScreen};
  app.innerHTML=brand()+(isPlaying(state)?hud():'')+views[state.phase]();
  if(focus) {document.querySelector('#main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'});}
}
function dispatch(action) {
  const previous=state;
  state=transition(state,action);
  if(state===previous) return;
  if(state.ending&&modal.open) modal.close();
  render(action.type!=='CALL'&&action.type!=='CLOSE_HINT');
  if(isPlaying(state)) document.querySelector('#announcer').textContent=`${time(state.timeRemaining)} remaining. ${state.recovered} of 7 recovered. Stress ${state.stress} percent. ${state.cigarettes} cigarettes smoked.`;
}
function showModal(content) {
  lastFocus=document.activeElement;
  modal.innerHTML=content;
  if(!modal.open) modal.showModal();
  const first=modal.querySelector('button:not([disabled])');
  first?.focus();
}
function closeModal() {
  modal.close();
  if(state.hint) dispatch({type:'CLOSE_HINT'});
  if(lastFocus?.isConnected) lastFocus.focus();
  else document.querySelector('#main').focus({preventScroll:true});
}
function callOverlay() {
  const hint=state.hint?hintFor(state.hint,state):null;
  const names={marina:'Marina',albedo:'Albedo',durin:'Durin'};
  showModal(`<div class="modal-top"><p class="eyebrow">NORTHLAND BANK · PENTHOUSE</p>${button('×','close','close-button','aria-label="Close call"')}</div><h2 id="modal-title">A familiar voice.</h2><p class="modal-intro">${13+state.recovered} assistants are safely at home. Each person has one useful idea per run.</p><div class="caller-list">${Object.entries(names).map(([id,name])=>`<button class="caller" data-action="call" data-person="${id}" ${state[id+'HintUsed']?'disabled':''}><span class="caller-initial">${name[0]}</span><span><b>${name}</b><small>${id==='marina'?'A feel for their motives':id==='albedo'?'A little behavioral reasoning':'An eye for the overlooked'}</small></span><em>${state[id+'HintUsed']?'NO NEW IDEAS':'CALL · 20s'}</em></button>`).join('')}</div>${hint?`<div class="hint-response"><span>${names[state.hint]}</span><p>${hint.text}</p>${hint.follow?`<p>${hint.follow}</p>`:''}</div>`:''}${button('Back to the search','close','button button--primary')}<p class="reading-note">Only placing a call costs time.</p>`);
}
function rules() {
  showModal(`<div class="modal-top"><p class="eyebrow">YOUR RECALL ORDER</p>${button('×','close','close-button','aria-label="Close instructions"')}</div><h2 id="modal-title">Bring all seven home.</h2><div class="rules-text"><p>Find the three missing city assistants, then enter the Palace and recover the remaining four. Select places on the map to travel and investigate.</p><p><b>The clock waits for you.</b> Only travel, searches, capture attempts, calls, and automatic smoking breaks use time. Reading and opening menus are free.</p><p><b>Safe capture:</b> a 50% chance. Success costs 15s and no stress. Failure costs 30s and adds 50% stress. The assistant stays in the same place.</p><p><b>Risky capture:</b> guaranteed, costing 15s and adding 50% stress. The pastry-shop pair always cooperate with safe capture.</p><p><b>At 100% stress:</b> Feofan automatically stops to smoke. This costs 60s, adds one cigarette, and resets stress. Pay attention to how much the search is taking out of him.</p><p>Call Marina, Albedo, or Durin for one hint each. Return home to end the search early. Captured assistants stay safe.</p></div>${button('Understood','close','button button--primary')}`);
}
function onClick(event) {
  const el=event.target.closest('button[data-action]');
  if(!el||el.disabled) return;
  const action=el.dataset.action;
  if(modal.open&&!modal.contains(el)) return;
  switch(action) {
    case 'begin':dispatch({type:'BEGIN'});break;
    case 'intro-next':dispatch({type:'INTRO_NEXT'});break;
    case 'visit':dispatch({type:'VISIT',id:el.dataset.id});break;
    case 'capture':dispatch({type:'CAPTURE',method:el.dataset.method});break;
    case 'continue':dispatch({type:'CONTINUE'});break;
    case 'map':dispatch({type:'MAP'});break;
    case 'reset':dispatch({type:'RESET'});break;
    case 'rules':rules();break;
    case 'close':closeModal();break;
    case 'call-open':callOverlay();break;
    case 'call':dispatch({type:'CALL',person:el.dataset.person});if(!state.ending) callOverlay();break;
    case 'home-open':showModal(`<p class="eyebrow">END THE RECALL</p><h2 id="modal-title">Return to the penthouse and end the search?</h2><p>You’ve recovered ${state.recovered} of 7. Going home now ends this run.</p><div class="modal-actions">${button('Keep searching','close','button button--primary')}${button('Return home','home-confirm','button button--risk')}</div>`);break;
    case 'home-confirm':modal.close();dispatch({type:'RETURN_HOME'});break;
    case 'hub':showModal(`<p class="eyebrow">${state.palaceEntered?'PALACE LOBBY':'SNEZHNOGRAD PLAZA'}</p><h2 id="modal-title">${state.palaceEntered?'The lobby is clear.':'The center of the search.'}</h2><p>${state.palaceEntered?'The three Dottomons scattered into the Palace. Search the surrounding rooms; no one remains in the lobby.':'Snow settles on the elegant rooftops. Northland Bank and Zapolyarny Palace stand beside each other nearby. There are no missing assistants in the Plaza itself.'}</p>${button('Back to map','close','button button--primary')}`);break;
  }
}
document.addEventListener('click',onClick);
modal.addEventListener('cancel',event=>{event.preventDefault();closeModal();});
render(false);
