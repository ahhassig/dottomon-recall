import test from 'node:test';
import assert from 'node:assert/strict';

// Exercise the actual UI event handler and all templates without a browser dependency.
// Layout and real focus behavior are verified separately in the deployed browser.
test('UI routes render, date follow has no second decision, and archive survives replay/reload',async()=>{
 const elements=new Map(),events=new Map(),saved=new Map();
 const element=()=>({innerHTML:'',textContent:'',open:false,focus(){},showModal(){this.open=true;},close(){this.open=false;},contains(){return true;},querySelector(){return {focus(){}};},addEventListener(){}});
 for(const id of ['#app','#modal','#main','#announcer'])elements.set(id,element());
 globalThis.document={body:{dataset:{}},activeElement:null,querySelector:id=>elements.get(id),addEventListener:(name,fn)=>events.set(name,fn)};
 globalThis.window={scrollTo(){},localStorage:{getItem:key=>saved.get(key)||null,setItem:(key,value)=>saved.set(key,value)}};
 const originalRandom=Math.random;Math.random=()=>0.1;
 try {
  await import('../game.js?ui-test');
  const app=elements.get('#app'),modal=elements.get('#modal');
  const click=(action,data={})=>{
   const button={dataset:{action,...data},disabled:false};events.get('click')({target:{closest:()=>button}});
   assert.doesNotMatch(app.innerHTML,/undefined|NaN/);assert.doesNotMatch(modal.innerHTML,/undefined|NaN/);
  };
  const start=()=>{click('begin');for(let i=0;i<3;i++)click('intro-next');};
  const visit=id=>click('visit',{id});
  const capture=(method='safe')=>{click('capture',{method});if(document.body.dataset.phase==='result')click('continue');};
  const city=(method='safe')=>{visit('pastry');capture(method);visit('alchemy');capture(method);visit('palace');click('map');};
  const report=()=>{assert.doesNotMatch(elements.get('#announcer').textContent,/Stress/);assert.match(elements.get('#announcer').textContent,/recovered/);for(let i=0;i<3;i++)click('ending-next');assert.match(app.innerHTML,/Hints used/);};
  assert.match(app.innerHTML,/0\.3/);click('gallery');assert.equal((modal.innerHTML.match(/<h3>\?\?\?<\/h3>/g)||[]).length,4);click('close');
  click('rules');assert.match(modal.innerHTML,/50% chance/);click('close');start();
  click('call-open');click('call',{person:'marina'});assert.match(modal.innerHTML,/NO NEW IDEAS/);click('close');
  visit('pastry');click('capture',{method:'safe'});assert.match(app.innerHTML,/PARTNER FOLLOWS/);assert.match(app.innerHTML,/2<em> \/ 7/);assert.doesNotMatch(app.innerHTML,/data-action="capture"/);click('continue');
  visit('alchemy');capture();visit('palace');click('map');for(const id of ['archives','operations','service','reagents']){visit(id);capture();}
  assert.match(app.innerHTML,/The last one home/);report();assert.match(app.innerHTML,/All accounted for/);click('reset');assert.equal(elements.get('#announcer').textContent,'');click('gallery');assert.match(modal.innerHTML,/All accounted for/);assert.equal((modal.innerHTML.match(/<h3>\?\?\?<\/h3>/g)||[]).length,3);click('close');
  start();city('risky');for(const id of ['archives','operations','service','reagents']){visit(id);capture('risky');}assert.match(app.innerHTML,/lighter won’t catch/);report();assert.match(app.innerHTML,/Mutiny cancelled/);click('reset');
  start();click('home-open');click('close');assert.equal(document.body.dataset.phase,'map');click('home-open');click('home-confirm');report();assert.match(app.innerHTML,/You had one job/);click('reset');
  start();city();for(let i=0;i<25&&document.body.dataset.phase!=='ending';i++){visit('depot');if(document.body.dataset.phase!=='ending')click('map');}report();assert.match(app.innerHTML,/They found him/);click('reset');
  await import('../game.js?ui-reload');click('gallery');assert.doesNotMatch(modal.innerHTML,/<h3>\?\?\?<\/h3>/);click('gallery-reset');assert.match(modal.innerHTML,/Forget your discovered endings/);click('gallery');assert.match(modal.innerHTML,/4 \/ 4/);click('gallery-reset');click('gallery-reset-confirm');assert.match(modal.innerHTML,/0 \/ 4/);
 } finally {Math.random=originalRandom;delete globalThis.document;delete globalThis.window;}
});
