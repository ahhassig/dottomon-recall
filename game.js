import {fieldNote,CODAS} from './data/replay.js?v=0.5';
import {initialState,transition,cityComplete,cityReady,missionTotal,remainingAt,locationStatus,isPlaying} from './engine.js?v=0.5';
import {LOCATIONS,CITY_IDS,PALACE_IDS} from './data/locations.js?v=0.5';
import {OPENING,SCATTER} from './data/dialogue.js?v=0.5';
import {encounterFor,RECOUNT} from './data/encounters.js?v=0.5';
import {hintFor} from './data/hints.js?v=0.5';
import {assignedAt} from './data/placements.js?v=0.5';
import {ENDINGS} from './data/endings.js?v=0.5';

import {createProgress,ENDING_IDS,ACHIEVEMENTS} from './progress.js?v=0.5';
import {scenery,FUGITIVE_CUES} from './data/visuals.js?v=0.5';
import {DATE_FOLLOW,SMOKING} from './data/flavor.js?v=0.5';
import {speakerIcon} from './data/characters.js?v=0.5';

let storage;
try {storage=window.localStorage;} catch {}
const progress=createProgress(storage);
let state=initialState();
let endingStep=0;
let runAchievements=[];
let archiveId=null,archiveStep=0;
const app=document.querySelector('#app');
const modal=document.querySelector('#modal');
let lastFocus=null;
const time=n=>`${Math.floor(n/60).toString().padStart(2,'0')}:${(n%60).toString().padStart(2,'0')}`;
const paths={
  letter:'M3 6h22v17H3V6Zm0 0 11 9L25 6',
  shield:'M14 2 24 6v8c0 6-6 10-10 12C10 24 4 20 4 14V6l10-4Zm0 5v13m-5-8h10',
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
const lines=items=>items.map(item=>Array.isArray(item)?`<blockquote class="dialogue"><cite>${speakerIcon(item[0])}<span>${item[0]}</span></cite><p>${item[1]}</p></blockquote>`:`<p>${item}</p>`).join('');
function puff(count=1,small=false,identities=[]) {
  return `<div class="puffs ${small?'puffs--small':''} ${count>3?'puffs--group':''}" aria-hidden="true">${Array.from({length:count},(_,i)=>{
    const cue=FUGITIVE_CUES[identities[i]]?.cue;
    return `<div class="puff puff--${i} ${cue?'puff--'+cue:''}" style="--i:${i}"><i class="tuft"></i><i class="eye"></i><i class="beak"></i><i class="arm"></i><i class="foot foot--left"></i><i class="foot foot--right"></i>${cue?`<i class="prop prop--${cue}"></i>`:''}</div>`;
  }).join('')}</div>`;
}
const brand=()=>`<header class="brandbar"><div class="wordmark">${icon('star')}<span>DOTTOMON <b>RECALL</b></span></div><span class="edition">MARINA AU <i>·</i> 0.5</span></header>`;
function hud() {
  return `<div class="hud-wrap"><section class="hud" aria-label="Mission status">
    <div class="stat stat--time ${state.timeRemaining<=300?'urgent':''}"><span>TIME</span><strong data-testid="time">${time(state.timeRemaining)}</strong><small>Action-based</small></div>
    <div class="stat ${state.stress?'strained':''}"><span>STRESS</span><strong data-testid="stress">${state.stress}<em>%</em></strong><div class="stress-track" aria-hidden="true"><i style="width:${state.stress}%"></i></div></div>
    <div class="stat"><span>DOTTOMONS RECOVERED</span><strong data-testid="recovered">${state.recovered}<em> / ${missionTotal(state)}</em></strong><div class="pips" aria-hidden="true">${Array.from({length:missionTotal(state)},(_,i)=>`<i class="${i<state.recovered?'lit':''}"></i>`).join('')}</div></div>
    <div class="stat"><span>CIGARETTES SMOKED</span><strong data-testid="cigarettes">${state.cigarettes}</strong><small>Automatic breaks</small></div>
    </section><nav class="utilities" aria-label="Mission actions">${button(`${icon('phone')}Call penthouse`,'call-open','utility')}${button(`${icon('home')}Return home`,'home-open','utility')}${button('?','rules','utility utility--help','aria-label="How to play"')}</nav></div>`;
}
function titleScreen() {
  return `<main id="main" class="title-screen" tabindex="-1"><div class="title-copy"><p class="eyebrow">A SNEZHNOGRAD MISADVENTURE</p><h1>Dottomon<br><span>Recall</span></h1><div class="small-rule"></div><p class="title-tag">Seven missing. <br>Twenty minutes. <br>One migraine.</p><p class="title-desc">You’re Feofan. Seven of your husband’s very clever, very opinionated assistants have escaped.<br>Bring them home. Keep his afternoon quiet.</p><div class="title-actions">${button('Begin recall <span aria-hidden="true">↗</span>','begin','button button--primary')}${progress.endings.length?button('Skip opening ↗','quick-begin','text-button'):''}${button('How to play','rules','text-button')}${button('Ending archive','gallery','text-button')}${button('Achievements','achievements','text-button')}</div><p class="reading-note">Your time only moves when you act. Read at your own pace.</p></div><div class="title-visual">${scenery('plaza')}<div class="orbit orbit--one"></div><div class="orbit orbit--two"></div><span class="orbit-tick tick--top">N</span><span class="orbit-tick tick--bottom">SNEZHNOGRAD · WINTER</span>${puff(3)}<div class="count-ticket"><span>ASSISTANTS AT HOME</span><strong>13 <em>/ 20</em></strong><span class="ticket-warning">A small discrepancy.</span></div></div></main><footer class="title-footer"><span>A story from Lex’s Marina AU</span><span>Original interface · Unofficial fan game</span></footer>`;
}
function sceneArt(scene,count=1,tag='',identities=[]) {
  return `<div class="scene-art scene-art--${scene}">${scenery(scene)}<div class="scene-emblem">${icon(scene==='penthouse'?'home':scene==='laboratory'?'flask':LOCATIONS[scene]?.icon||'palace')}</div>${count?puff(count,false,identities):''}<span class="scene-art-label">${tag}</span></div>`;
}
function endingArt(id,step=3,summary=state.endingSummary,context=state) {
  const count=id==='good'?20:id==='secret'?(step===1?8:20):id==='breach'?summary.uncapturedPalace.length:20-summary.total+summary.recovered;
  const scene=id==='breach'?'laboratory':id==='secret'&&step===1?'plaza':'penthouse';
  const captions={good:'Twenty present. Nothing to declare.',secret:step===1?'Every argument ends. They bring him home.':'No one is leaving him.',home:'The search is no longer his to finish.',breach:'Only the uncaught assistants reach this door.'};
  return `<figure class="ending-tableau tableau--${id} ${id==='secret'&&step===1?'tableau--rescue':''}" role="img" aria-label="${captions[id]}">${scenery(scene)}${id==='secret'?'<div class="resting-coat"><i></i></div>':''}${id==='home'||id==='breach'?'<div class="threshold-light"></div>':''}${puff(count,true,id==='breach'?summary.uncapturedPalace:(id==='good'||id==='secret'||context.capturedDottomons.includes('dottoling'))?['dottoling']:[])}<figcaption>${captions[id]}</figcaption></figure>`;
}
function opening() {
  const story=OPENING[state.intro];
  return `<main id="main" class="opening page" tabindex="-1"><div class="section-heading"><p class="eyebrow">${story.eyebrow}</p><div class="chapter-count">0${state.intro+1} <span>/ 03</span></div><h1>${story.title}</h1></div><div class="story-layout">${sceneArt(story.scene,state.intro===0?1:3,state.intro===1?'13 PRESENT / 20 EXPECTED':'BEFORE THE RECALL')}<article class="prose">${lines(story.lines)}<div class="story-next">${button(state.intro===2?'Start the search <span aria-hidden="true">↗</span>':'Continue <span aria-hidden="true">→</span>','intro-next','button button--primary')}</div></article></div></main>`;
}
const positions={
  pastry:[20,21,25,20],alchemy:[80,21,75,20],market:[20,79,25,73],promenade:[80,79,75,73],courier:[50,89,50,90],palace:[50,9,50,7],
  archives:[20,20,25,15],operations:[80,20,75,15],service:[20,76,25,64],reagents:[80,76,75,64],depot:[20,47,25,85],guardroom:[80,47,75,85]
};
function mapNode(id) {
  const palace=id==='palace';
  const place=palace?{name:'Zapolyarny Palace',icon:cityReady(state)?'palace':'lock',travel:60}:LOCATIONS[id];
  const locked=palace&&!cityReady(state);
  const status=palace?(locked?(state.extraRevealed?'LOCKED · FIND DOTTOLING':'LOCKED · FIND ALL 3 IN THE CITY'):'UNLOCKED'):locationStatus(state,id);
  const xy=positions[id];
  const done=['CLEARED','SECURED'].includes(status);
  return `<button class="map-node ${done?'node--done':''} ${palace?'node--palace':''} ${locked?'node--locked':''}" style="--x:${xy[0]}%;--y:${xy[1]}%;--mx:${xy[2]}%;--my:${xy[3]}%" data-action="visit" data-id="${id}" ${locked?'disabled':''} aria-label="${place.name}, ${status}, ${place.travel} seconds travel"><span class="node-medallion">${icon(place.icon)}</span><span class="node-label">${place.name}</span><span class="node-state">${done?'✓ ':''}${status}</span>${locked?'':`<span class="node-time">${place.travel}s travel</span>`}</button>`;
}
function mapScreen() {
  const palace=state.palaceEntered;
  const cityCount=state.capturedDottomons.filter(id=>['tea-one','tea-two','chemist'].includes(id)).length;
  return `<main id="main" class="map-page page" tabindex="-1"><header class="section-heading"><p class="eyebrow">${palace?'02 · INSIDE THE PALACE':'01 · THE CITY SEARCH'}</p><h1>${palace?'Zapolyarny Palace':'Snezhnograd'}</h1><p>${palace?'Four assistants. Six rooms. Keep the laboratory quiet.':(state.extraRevealed?(cityReady(state)?'Everyone from the city is home. The Palace is next.':'The recount found one more. Search for Dottoling before entering the Palace.'):'Three assistants are somewhere in the city. Their routes change each run.')}</p></header><div class="map-layout"><aside class="mission-panel"><div class="dossier-number">RECALL ORDER <span>№ 007</span></div><h2>A quiet afternoon.</h2><p>Recover all ${missionTotal(state)===8?'eight':'seven'} before Zandik finishes his work.</p><div class="progress-stage ${cityCount===3?'stage--done':''}"><span>01</span><div><b>Search Snezhnograd</b><small>${cityCount} / 3 recovered ${cityCount===3?'✓':''}</small></div></div><div class="progress-stage ${palace?'stage--active':''}"><span>02</span><div><b>Secure the Palace</b><small>${palace?`${state.capturedDottomons.filter(id=>['archivist','coordinator','runner','specialist'].includes(id)).length} / 4 recovered`:(state.extraRevealed?'Recover Dottoling first':'Find all three in the city first')}</small></div></div>${state.extraRevealed?`<div class="progress-stage"><span>+</span><div><b>The unexpected follower</b><small>${state.capturedDottomons.includes('dottoling')?'Dottoling safely home ✓':'Check the fountain and forecourt'}</small></div></div>`:''}<div class="dossier-note"><span class="dossier-speaker">${speakerIcon('Feofan')} FEOFAN</span><p>“${fieldNote(state)}”</p></div><div class="map-legend"><span><i class="legend-unexplored"></i>Unexplored</span><span><i class="legend-done"></i>Cleared / secured</span></div><p class="map-help">Travel costs time. An empty-location search adds 30s. Returning to this map is free.</p></aside><section class="node-map ${palace?'node-map--palace':'node-map--city'}" aria-label="${palace?'Palace':'Snezhnograd'} location map">${scenery(palace?'lobby':'plaza')}<div class="map-grid" aria-hidden="true"></div><span class="map-coordinate coord-top">${palace?'ZAPOLYARNY · INTERIOR':'SNEZHNOGRAD · CENTRAL DISTRICT'}</span><span class="map-compass" aria-hidden="true">N<br>✧</span><svg class="map-routes routes-desktop" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${(palace?PALACE_IDS:[...CITY_IDS,'palace']).map(id=>`<path d="M50 49 L${positions[id][0]} ${positions[id][1]}"/>`).join('')}</svg><svg class="map-routes routes-mobile" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">${(palace?PALACE_IDS:[...CITY_IDS,'palace']).map(id=>`<path d="M50 ${palace?39:43} L${positions[id][2]} ${positions[id][3]}"/>`).join('')}</svg><button class="hub-node" data-action="${!palace&&state.extraRevealed?'visit':'hub'}" ${!palace&&state.extraRevealed?'data-id="plaza"':''}><span>${icon(palace?'palace':'star')}</span><b>${palace?'Lobby':state.extraRevealed?'Fountain':'Plaza'}</b><small>${!palace&&state.extraRevealed?locationStatus(state,'plaza'):'YOU ARE HERE'}</small></button>${(palace?PALACE_IDS:[...CITY_IDS,'palace']).map(mapNode).join('')}<span class="map-coordinate coord-bottom">${palace?'RESEARCH WING · ACCESS RESTRICTED':'NORTHLAND BANK · PENTHOUSE NEARBY'}</span></section></div></main>`;
}
function encounter() {
  const id=state.location,place=LOCATIONS[id],story=encounterFor(state),remaining=remainingAt(state,id),assigned=assignedAt(state,id);
  const pair=remaining.includes('tea-one');
  const seen=assigned.length>0 && !remaining.length;
  const content=seen?['The area remains secure. The assistant'+(assigned.length>1?'s are':' is')+' safely back at the penthouse. There’s nothing more to recover here.']:story.lines;
  let choices='';
  if (remaining.length) {
    choices=`<div class="capture-panel"><div class="capture-title"><span>CHOOSE YOUR APPROACH</span><small>${remaining.length} ${remaining.length===1?'assistant':'assistants'} here</small></div><div class="capture-buttons">${button(`<b>Safe capture</b><span>50% success · ${pair?'30s for the pair':'15s on success'}</span>`,'capture','button button--primary','data-method="safe"')}${button(`<b>Risky capture</b><span>Guaranteed · ${state.cigarettes===5?'critical stress':(pair?'90':'75')+'s · 1 cigarette'}</span>`,'capture','button button--risk','data-method="risky"')}</div><p>Safe failure: 30s and +50% stress. Risky capture fills the stress bar immediately. The first five critical episodes include a 60s break; a sixth ends the search before a cigarette can be completed.${pair?' The partner follows for another 15s, without a roll or stress.':''}</p></div>`;
  }
  return `<main id="main" class="encounter page" tabindex="-1"><div class="section-heading"><p class="eyebrow">${place.name} <span class="heading-cost">${place.travel}s travel${assigned.length?'':' + 30s search'}</span></p><h1>${seen?'Already safely home.':story.title}</h1></div><div class="story-layout">${sceneArt(id==='plaza'?'fountain':id,remaining.length,seen?'SECURED':assigned.length?'CONTACT ESTABLISHED':'AREA CLEARED',remaining)}<article class="prose">${remaining.length?`<p class="contact-name">${remaining.map(id=>FUGITIVE_CUES[id].label).join(' · ')}</p>`:''}${lines(content)}${!assigned.length?'<div class="status-banner">✓ CLEARED · No Dottomons here</div>':''}${seen?'<div class="status-banner">✓ SECURED · No one has escaped again</div>':''}</article></div>${choices}<div class="back-row">${button(`← ${state.palaceEntered?'Palace map':'City map'}`,'map','text-button')}<span>No time cost</span></div></main>`;
}
function resultScreen() {
  const r=state.result,story=encounterFor(state,state.location,r.target);
  const text=r.success?(r.method==='risky'?story.risky:story.success):story.failures[(state.attempts[state.location]-1)%story.failures.length];
  const left=remainingAt(state,state.location).length;
  return `<main id="main" class="result-page page" tabindex="-1"><div class="result-card ${r.success?'result--success':'result--miss'}"><div class="result-creature ${r.success?'reaction--secured':'reaction--evade'}">${puff(r.partnerFollowed?2:1,true,r.partnerFollowed?['tea-one','tea-two']:[r.target])}</div><p class="eyebrow">${r.partnerFollowed?'TWO ASSISTANTS RECOVERED':r.success?'ASSISTANT RECOVERED':'STILL IN THIS LOCATION'}</p><h1>${r.partnerFollowed?'The date changes venue.':r.success?'Safely home.':'A small tactical retreat.'}</h1><p class="result-text">${text}</p>${r.partnerFollowed?`<div class="partner-follow prose"><p class="eyebrow">PARTNER FOLLOWS · +1 RECOVERED · 15s · NO STRESS</p>${lines(DATE_FOLLOW)}</div>`:''}<div class="result-receipt"><span>TIME <b>−${r.cost}s</b></span><span>RECOVERED <b>${state.recovered} / ${missionTotal(state)}</b></span><span>STRESS <b>${state.stress}%</b></span></div>${r.smoking?`<div class="smoking-break"><p class="eyebrow">AUTOMATIC BREAK · 100% → 0%</p><h2>A minute in the cold.</h2><p>${SMOKING[(state.cigarettes-1)%SMOKING.length]}</p><p class="break-cost">60s included above · Cigarette ${state.cigarettes}</p></div>`:''}${r.unlocked?'<div class="unlock-banner">✧ ZAPOLYARNY PALACE UNLOCKED<br><span>All four city assistants are safe, including Dottoling.</span></div>':''}${r.success?`<p class="return-flavor">${story.return||''}</p>`:''}${achievementNotice()}${button(state.recountPending?'Answer Marina’s call':left?'Try again':'Return to map','continue','button button--primary')}<p class="reading-note">Continue when you’re ready. Reading costs no time.</p></div></main>`;
}
function recountScreen() {
  return `<main id="main" class="page" tabindex="-1"><div class="section-heading"><p class="eyebrow">INCOMING · NORTHLAND BANK</p><h1>One fewer than expected.</h1></div><div class="story-layout">${sceneArt('penthouse',1,'A SECOND COUNT',['dottoling'])}<article class="prose">${lines(RECOUNT)}<div class="unlock-banner">RECALL UPDATED · ${state.recovered} / 8 RECOVERED</div>${button('Find the unexpected follower ↗','recount-next','button button--primary')}</article></div></main>`;
}
function achievementNotice() {
  return runAchievements.length?`<div class="achievement-notice"><p class="eyebrow">DISCOVERED THIS RUN</p><p>${runAchievements.map(id=>ACHIEVEMENTS[id].title).join(' · ')}</p></div>`:'';
}
function achievements() {
  const found=progress.achievements;
  showModal(`<div class="modal-top"><p class="eyebrow">ACHIEVEMENTS · ${found.length} / 4</p>${button('×','close','close-button','aria-label="Close achievements"')}</div><h2 id="modal-title">Small victories.</h2><p class="collection-intro">Four different reasons to remember an afternoon. Each is earned once and stays with you.</p><div class="gallery-grid">${Object.entries(ACHIEVEMENTS).map(([id,a])=>`<article class="gallery-card ${found.includes(id)?'':'gallery--locked'}"><span class="archive-seal" aria-hidden="true">${found.includes(id)?'✓':'◇'}</span><h3>${a.title}</h3><p>${a.description}</p>${id==='full_recall'?`<p class="collection-count">${progress.endings.length} of 4 endings discovered</p>`:''}<p class="eyebrow">${found.includes(id)?'UNLOCKED':'NOT YET DISCOVERED'}</p></article>`).join('')}</div><p class="reading-note">${progress.persistent?'Saved in this browser. Replay keeps your achievements.':'Storage is unavailable. Discoveries last for this page session only.'}</p>${button('Close achievements','close','button button--primary')}`);
}
function scatterScreen() {
  return `<main id="main" class="page" tabindex="-1"><div class="section-heading"><p class="eyebrow">Zapolyarny Palace · Lobby</p><h1>A moment of recognition.</h1></div><div class="story-layout">${sceneArt('lobby',3,'THREE CONTACTS · THREE DIRECTIONS',['archivist','coordinator','runner'])}<article class="prose">${lines(SCATTER)}${button('Search the Palace <span aria-hidden="true">↗</span>','map','button button--primary')}</article></div></main>`;
}
function endingScreen() {
  const ending=ENDINGS[state.ending],summary=state.endingSummary;
  const story=ending.lines(state),breaks=[0,...ending.breaks,story.length];
  if(endingStep<3) {
    const chapter=story.slice(breaks[endingStep],breaks[endingStep+1]);
    return `<main id="main" class="ending-page ending--${ending.color} page" tabindex="-1"><div class="ending-scene"><p class="eyebrow">${ending.scene}</p><div class="ending-beats" aria-label="Scene ${endingStep+1} of 3">${[0,1,2].map(n=>`<i class="${n<=endingStep?'lit':''}"></i>`).join('')}</div><h1>${ending.chapters[endingStep]}</h1>${endingArt(state.ending,endingStep)}<article class="prose">${lines(chapter)}</article>${button(endingStep===2?'See recall report ↗':'Continue →','ending-next','button button--primary')}<p class="reading-note">The search is over. Take your time.</p></div></main>`;
  }
  return `<main id="main" class="ending-page ending--${ending.color} page" tabindex="-1">${endingArt(state.ending)}<div class="ending-heading"><span class="ending-seal">${ending.mark}</span><p class="eyebrow">${ending.label}</p><h1>${ending.title}</h1><div class="ending-tagline">${ending.tagline.map(x=>`<p>${x}</p>`).join('')}</div></div><aside class="run-summary final-summary"><p class="eyebrow">RECALL REPORT</p><dl><div><dt>Ending obtained</dt><dd class="summary-title">${ending.title}</dd></div><div><dt>Time remaining</dt><dd>${time(summary.timeRemaining)}</dd></div><div><dt>Recovered during search</dt><dd>${summary.recovered} <small>/ ${summary.total}</small></dd></div><div><dt>Cigarettes smoked</dt><dd>${summary.cigarettes}</dd></div><div><dt>Hints used</dt><dd>${summary.hintsUsed} <small>/ 3</small></dd></div></dl><p class="summary-outcome">${state.ending==='secret'?'All twenty are home. The search party returned voluntarily.':state.ending==='good'?'All twenty are home. The laboratory stayed quiet.':state.ending==='breach'?`${summary.uncapturedPalace.length} uncaptured Palace assistant${summary.uncapturedPalace.length===1?'':'s'} reached the laboratory.`:'Zandik collected the remaining fugitives himself.'}</p>${achievementNotice()}${button('Play again ↗','reset','button button--primary')}${button('Ending archive','gallery','text-button')}${button('Achievements','achievements','text-button')}<p class="reading-note">A fresh search. Your discovered endings stay in the archive.</p></aside></main>`;
}
function render(focus=true) {
  document.body.dataset.region=state.palaceEntered?'palace':'city';
  document.body.dataset.phase=state.phase;
  const views={title:titleScreen,opening,recount:recountScreen,map:mapScreen,encounter,result:resultScreen,scatter:scatterScreen,ending:endingScreen};
  app.innerHTML=brand()+(isPlaying(state)?hud():'')+views[state.phase]();
  if(focus) {document.querySelector('#main').focus({preventScroll:true}); window.scrollTo({top:0,behavior:'instant'});}
}
function dispatch(action) {
  const previous=state;
  state=transition(state,action);
  if(action.type==='RESET'||(state.ending&&!previous.ending)) endingStep=0;
  if(action.type==='RESET')runAchievements=[];
  if(state===previous) return;
  const unlocked=progress.record(state);runAchievements.push(...unlocked);
  if(state.ending&&modal.open) modal.close();
  render(action.type!=='CALL'&&action.type!=='CLOSE_HINT');
  const announcer=document.querySelector('#announcer');
  if(state.ending) announcer.textContent=`${ENDINGS[state.ending].title}. ${time(state.timeRemaining)} remaining. ${state.recovered} of ${missionTotal(state)} recovered. ${state.cigarettes} cigarettes smoked.`;
  else if(!isPlaying(state)) announcer.textContent='';
  else announcer.textContent=`${time(state.timeRemaining)} remaining. ${state.recovered} of ${missionTotal(state)} recovered. Stress ${state.stress} percent. ${state.cigarettes} cigarettes smoked.`;
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
function callOverlay(reviewPerson=null) {
  const person=state[reviewPerson+'HintUsed']?reviewPerson:state.hint;
  const hint=person?hintFor(person,state):null;
  const names={marina:'Marina',albedo:'Albedo',durin:'Durin'};
  showModal(`<div class="modal-top"><p class="eyebrow">NORTHLAND BANK · PENTHOUSE</p>${button('×','close','close-button','aria-label="Close call"')}</div><h2 id="modal-title">A familiar voice.</h2><p class="modal-intro">${state.extraRevealed?'At home':'Expected at home'}: ${20-missionTotal(state)+state.recovered} assistants. Each person has one useful idea per run.</p><div class="caller-list">${Object.entries(names).map(([id,name])=>`<button class="caller" data-action="call" data-person="${id}" ${state[id+'HintUsed']?'disabled':''}>${speakerIcon(name)}<span><b>${name}</b><small>${id==='marina'?'A feel for their motives':id==='albedo'?'A little behavioral reasoning':'An eye for the overlooked'}</small></span><em>${state[id+'HintUsed']?'NO NEW IDEAS':'CALL · 20s'}</em></button>${state[id+'HintUsed']?button('Review '+name+'’s clue','hint-review','text-button clue-review',`data-person="${id}"`):''}`).join('')}</div>${hint?`<div class="hint-response"><span class="hint-speaker">${speakerIcon(names[person])}${names[person]}</span><p>${hint.text}</p>${hint.follow?`<p>${hint.follow}</p>`:''}</div>`:''}${button('Back to the search','close','button button--primary')}<p class="reading-note">Only placing a new call costs time. Reviewing a clue is free.</p>`);
}
function rules() {
  showModal(`<div class="modal-top"><p class="eyebrow">YOUR RECALL ORDER</p>${button('×','close','close-button','aria-label="Close instructions"')}</div><h2 id="modal-title">Bring everyone home.</h2><div class="rules-text"><p>Find the missing city assistants, then enter the Palace and recover the remaining four. Each assistant has two possible destinations, chosen at the start of the run. The date pair stay together. Listen when Marina calls with a recount.</p><p><b>The clock waits for you.</b> Only travel, searches, capture attempts, calls, and automatic smoking breaks use time. Reading and opening menus are free.</p><p><b>Safe capture:</b> a 50% chance. Success costs 15s and no stress. Failure costs 30s and adds 50% stress. The assistant stays in the same place.</p><p><b>Risky capture:</b> guaranteed. It immediately fills the stress bar. The first five critical episodes cost 60s for a smoking break plus the capture time. On the sixth, Feofan cannot complete the break and the search ends. Wherever the date pair are, only the first guest needs capturing. Its partner follows voluntarily for 15s, with no second roll or stress.</p><p><b>At 100% stress:</b> The first five times, Feofan stops for 60s, completes a cigarette, and resets stress. Five cigarettes alone do not end the search. The sixth critical episode triggers a different ending; no sixth cigarette is completed.</p><p>Call Marina, Albedo, or Durin for one hint each. Return home to end the search early. Captured assistants stay safe.</p></div>${button('Understood','close','button button--primary')}`);
}
function gallery() {
  const found=progress.endings;
  showModal(`<div class="modal-top"><p class="eyebrow">ENDING ARCHIVE · ${found.length} / 4</p>${button('×','close','close-button','aria-label="Close archive"')}</div><h2 id="modal-title">Afternoons to remember.</h2><p>Every search leaves a story. Discover an ending to reveal its card.</p><div class="gallery-grid">${ENDING_IDS.map((id,i)=>{
    const ending=ENDINGS[id],known=found.includes(id);
    return `<article class="gallery-card ending--${known?ending.color:'locked'} ${known?'':'gallery--locked'}"><span class="archive-number">0${i+1}</span><span class="archive-seal" aria-hidden="true">${known?ending.mark:'◇'}</span><p class="eyebrow">${known?ending.label:'UNDISCOVERED'}</p><h3>${known?ending.title:'???'}</h3><p>${known?ending.tagline.join('<br>'):'A different afternoon is waiting.'}</p>${known?button(progress.runFor(id)?'Read ending →':'Read coda →','archive-read','text-button',`data-ending="${id}"`):''}</article>`;
  }).join('')}</div><p class="reading-note">${progress.persistent?'Saved in this browser. Play Again resets only the search.':'Browser storage is unavailable. Discoveries last for this page session only.'}</p><div class="gallery-actions">${button('Close archive','close','button button--primary')}${found.length||progress.achievements.length?button('Reset progress','gallery-reset','text-button'):''}</div>`);
}
function archiveReader(id,step=0) {
  if(!progress.endings.includes(id)||!ENDING_IDS.includes(id))return;
  archiveId=id;archiveStep=Math.max(0,Math.min(2,Number.isInteger(step)?step:0));
  const ending=ENDINGS[id],run=progress.runFor(id);
  const all=run?ending.lines(run):CODAS[id],cuts=run?[0,...ending.breaks,all.length]:[0,all.length];
  const chapter=run?all.slice(cuts[archiveStep],cuts[archiveStep+1]):all;
  const summary=run?.endingSummary;
  showModal(`<div class="modal-top"><p class="eyebrow">ENDING ARCHIVE · ${ending.label}</p>${button('×','close','close-button','aria-label="Close ending reader"')}</div><h2 id="modal-title">${ending.title}</h2><p class="reading-note">${run?'Your most recent visit to this ending. Reading leaves your current search untouched.':'Discovered before run reports were saved. This coda is available now; reach the ending again to save its full scenes and report.'}</p>${run?endingArt(id,archiveStep,summary,run):''}<article class="prose archive-prose">${run?`<p class="eyebrow">SCENE ${archiveStep+1} / 3</p><h3>${ending.chapters[archiveStep]}</h3>`:'<p class="eyebrow">AFTER THE SEARCH</p>'}${lines(chapter)}</article>${run&&archiveStep===2?`<dl class="archive-report"><div><dt>Time left</dt><dd>${time(summary.timeRemaining)}</dd></div><div><dt>Recovered</dt><dd>${summary.recovered} / ${summary.total}</dd></div><div><dt>Cigarettes</dt><dd>${summary.cigarettes}</dd></div><div><dt>Hints</dt><dd>${summary.hintsUsed} / 3</dd></div></dl><div class="archive-coda prose">${lines(CODAS[id])}</div>`:''}<nav class="archive-navigation" aria-label="Ending reader">${run&&archiveStep>0?button('← Previous','archive-prev','text-button'):''}${run&&archiveStep<2?button('Next scene →','archive-next','button button--primary'):button('Back to archive','gallery','button button--primary')}${run&&archiveStep<2?button('Back to archive','gallery','text-button'):''}</nav>`);
  modal.scrollTop=0;
}
function onClick(event) {
  const el=event.target.closest('button[data-action]');
  if(!el||el.disabled) return;
  const action=el.dataset.action;
  if(modal.open&&!modal.contains(el)) return;
  switch(action) {
    case 'archive-read':archiveReader(el.dataset.ending);break;
    case 'archive-next':archiveReader(archiveId,archiveStep+1);break;
    case 'archive-prev':archiveReader(archiveId,archiveStep-1);break;
    case 'hint-review':callOverlay(el.dataset.person);break;
    case 'quick-begin':if(state.phase==='title'&&progress.endings.length){dispatch({type:'BEGIN'});for(let i=0;i<3;i++)dispatch({type:'INTRO_NEXT'});}break;
    case 'begin':dispatch({type:'BEGIN'});break;
    case 'recount-next':dispatch({type:'RECOUNT_NEXT'});break;
    case 'achievements':achievements();break;
    case 'intro-next':dispatch({type:'INTRO_NEXT'});break;
    case 'visit':dispatch({type:'VISIT',id:el.dataset.id});break;
    case 'capture':dispatch({type:'CAPTURE',method:el.dataset.method});break;
    case 'continue':dispatch({type:'CONTINUE'});break;
    case 'map':dispatch({type:'MAP'});break;
    case 'ending-next':if(state.ending&&endingStep<3){endingStep++;render();}break;
    case 'reset':dispatch({type:'RESET'});break;
    case 'rules':rules();break;
    case 'gallery':gallery();break;
    case 'gallery-reset':showModal(`<p class="eyebrow">RESET ENDING ARCHIVE</p><h2 id="modal-title">Reset endings and achievements?</h2><p>This clears ending discoveries, saved reports, and achievements in this browser. Your current run stays unchanged.</p><div class="modal-actions">${button('Keep discoveries','gallery','button button--primary')}${button('Reset progress','gallery-reset-confirm','button button--risk')}</div>`);break;
    case 'gallery-reset-confirm':progress.reset();gallery();break;
    case 'close':closeModal();break;
    case 'call-open':callOverlay();break;
    case 'call':dispatch({type:'CALL',person:el.dataset.person});if(!state.ending) callOverlay();break;
    case 'home-open':showModal(`<p class="eyebrow">END THE RECALL</p><h2 id="modal-title">Return to the penthouse and end the search?</h2><p>You’ve recovered ${state.recovered} of ${missionTotal(state)}. Going home now ends this run.</p><div class="modal-actions">${button('Keep searching','close','button button--primary')}${button('Return home','home-confirm','button button--risk')}</div>`);break;
    case 'home-confirm':modal.close();dispatch({type:'RETURN_HOME'});break;
    case 'hub':showModal(`<p class="eyebrow">${state.palaceEntered?'PALACE LOBBY':'SNEZHNOGRAD PLAZA'}</p><h2 id="modal-title">${state.palaceEntered?'The lobby is clear.':'The center of the search.'}</h2><p>${state.palaceEntered?'The three Dottomons scattered into the Palace. Search the surrounding rooms; no one remains in the lobby.':'Snow settles on the elegant rooftops. Northland Bank and Zapolyarny Palace stand beside each other nearby. There are no missing assistants in the Plaza itself.'}</p>${button('Back to map','close','button button--primary')}`);break;
  }
}
document.addEventListener('click',onClick);
modal.addEventListener('cancel',event=>{event.preventDefault();closeModal();});
render(false);
