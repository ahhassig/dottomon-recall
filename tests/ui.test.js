import test from 'node:test';
import assert from 'node:assert/strict';
import {VALID_PLACEMENTS} from '../data/placements.js';
// Actual UI templates and event handlers; browser checks separately cover layout/focus.
test('UI routes: every placement, recount, dynamic counts, captures, all endings, hints and persistent collections',async()=>{
 const elements=new Map(),events=new Map(),saved=new Map();
 const element=()=>({innerHTML:'',textContent:'',open:false,focus(){},showModal(){this.open=true;},close(){this.open=false;},contains(){return true;},querySelector(){return {focus(){}};},addEventListener(){}});
 for(const id of ['#app','#modal','#main','#announcer'])elements.set(id,element());
 globalThis.document={body:{dataset:{}},activeElement:null,querySelector:id=>elements.get(id),addEventListener:(name,fn)=>events.set(name,fn)};
 globalThis.window={scrollTo(){},localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)}};
 const oldRandom=Math.random;Math.random=()=>0;
 try {
  await import('../game.js?ui-v05');
  const app=elements.get('#app'),modal=elements.get('#modal');
  const click=(action,data={})=>{const button={dataset:{action,...data},disabled:false};events.get('click')({target:{closest:()=>button}});assert.doesNotMatch(app.innerHTML,/undefined|NaN|\[object Object\]/);assert.doesNotMatch(modal.innerHTML,/undefined|NaN/);};
  let placement=VALID_PLACEMENTS[0];
  const start=(n=0)=>{Math.random=()=>n/VALID_PLACEMENTS.length;placement=VALID_PLACEMENTS[n];click('begin');Math.random=()=>0;for(let i=0;i<3;i++)click('intro-next');};
  const visit=id=>click('visit',{id});
  const capture=(method='safe')=>{click('capture',{method});if(document.body.dataset.phase==='result')click('continue');};
  const find=(id,method)=>{visit(placement[id]);capture(method);};
  const city=(method='safe')=>{find('tea-one',method);find('chemist',method);assert.match(app.innerHTML,/One fewer than expected/);assert.match(app.innerHTML,/3 \/ 8 RECOVERED/);assert.doesNotMatch(app.innerHTML,/data-id="palace"/);click('recount-next');find('dottoling',method);visit('palace');click('map');};
  const report=()=>{assert.doesNotMatch(elements.get('#announcer').textContent,/Stress/);for(let i=0;i<3;i++)click('ending-next');assert.match(app.innerHTML,/Hints used/);};
  assert.match(app.innerHTML,/0\.5/);click('gallery');assert.equal((modal.innerHTML.match(/<h3>\?\?\?<\/h3>/g)||[]).length,4);click('close');click('achievements');assert.match(modal.innerHTML,/Cold Plunge/);click('close');click('rules');assert.match(modal.innerHTML,/50% chance/);click('close');
  // Render both sides of every authored placement pool through real UI events.
  for(const n of VALID_PLACEMENTS.keys()){start(n);click('call-open');click('call',{person:'marina'});assert.match(modal.innerHTML,/NO NEW IDEAS/);click('close');const beforeReview=app.innerHTML;click('hint-review',{person:'marina'});assert.match(modal.innerHTML,/Review Marina/);click('close');assert.equal(app.innerHTML,beforeReview);city();for(const id of ['archivist','coordinator','runner','specialist'])find(id);assert.match(app.innerHTML,/The last one home/);report();assert.match(app.innerHTML,/8 <small>\/ 8/);const finished=app.innerHTML;click('gallery');click('archive-read',{ending:'good'});assert.match(modal.innerHTML,/SCENE 1 \/ 3/);click('archive-next');click('archive-next');assert.match(modal.innerHTML,/archive-report/);click('archive-prev');assert.match(modal.innerHTML,/SCENE 2 \/ 3/);click('close');assert.equal(app.innerHTML,finished);click('reset');assert.equal(elements.get('#announcer').textContent,'');}
  start();city('risky');for(const id of ['archivist','coordinator','runner'])find(id,'risky');assert.match(app.innerHTML,/lighter won’t catch/);report();assert.match(app.innerHTML,/Mutiny cancelled/);click('reset');
  start();click('home-open');click('close');assert.equal(document.body.dataset.phase,'map');click('home-open');click('home-confirm');report();assert.match(app.innerHTML,/You had one job/);click('reset');
  start();city();for(let i=0;i<30&&document.body.dataset.phase!=='ending';i++){visit('depot');if(document.body.dataset.phase!=='ending')click('map');}report();assert.match(app.innerHTML,/They found him/);click('reset');
  // Real Safe failure at fountain, then a successful complete no-hint run.
  start();find('tea-one');find('chemist');click('recount-next');visit('plaza');Math.random=()=>.99;click('capture',{method:'safe'});assert.match(app.innerHTML,/lands in the shallow fountain/);assert.match(app.innerHTML,/Cold Plunge/);click('continue');Math.random=()=>0;capture();visit('palace');click('map');for(const id of ['archivist','coordinator','runner','specialist'])find(id);report();assert.match(app.innerHTML,/No Outside Help/);click('reset');
  await import('../game.js?ui-v05-reload');for(const ending of ['good','secret','home','breach']){click('archive-read',{ending});assert.match(modal.innerHTML,/SCENE 1 \/ 3/);click('archive-next');click('archive-next');assert.match(modal.innerHTML,/archive-report/);click('close');}click('quick-begin');assert.equal(document.body.dataset.phase,'map');assert.match(app.innerHTML,/20:00/);click('reset');click('gallery');assert.doesNotMatch(modal.innerHTML,/<h3>\?\?\?<\/h3>/);click('close');click('achievements');assert.match(modal.innerHTML,/ACHIEVEMENTS · 4 \/ 4/);click('close');click('gallery');click('gallery-reset');assert.match(modal.innerHTML,/Reset endings and achievements/);click('gallery');assert.match(modal.innerHTML,/4 \/ 4/);click('gallery-reset');click('gallery-reset-confirm');assert.match(modal.innerHTML,/0 \/ 4/);click('close');click('achievements');assert.match(modal.innerHTML,/ACHIEVEMENTS · 0 \/ 4/);
 } finally {Math.random=oldRandom;delete globalThis.document;delete globalThis.window;}
});
