import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {ENDINGS} from '../data/endings.js';
import {FUGITIVE_CUES} from '../data/visuals.js';
import {speakerIcon} from '../data/characters.js';
import {initialState} from '../engine.js';

test('Ending artwork count and seal agree in the Good Ending',()=>{
  assert.equal(ENDINGS.good.mark,'XX');
  const story=ENDINGS.good.lines(initialState());
  assert.match(story.join(' '),/all twenty assistants|all twenty are/i);
});

test('Bad Ending 1 keeps Zandik’s trip to the lab after he recovers the missing assistants',()=>{
  const story=ENDINGS.home.lines({...initialState(),extraRevealed:false,recovered:4});
  assert.ok(story.some(line=>typeof line==='string'&&/then heads to the lab/i.test(line)));
  assert.ok(story.some(line=>typeof line==='string'&&/collect the rest himself/i.test(line)));
});

test('Dottoling is named as a Dottomon and Feofan’s icon uses glasses chains',()=>{
  assert.match(FUGITIVE_CUES.dottoling.label,/Dottoling Dottomon/);
  assert.match(speakerIcon('Feofan'),/M9 18h11/);
  assert.match(speakerIcon('Feofan'),/m27-11c0 4-1 8-3 11/);
});

test('Dottomon illustration no longer adds the extra oval body',()=>{
  const css=readFileSync(new URL('../style.css',import.meta.url),'utf8');
  assert.doesNotMatch(css,/\.puff:before|\.puff--cat:before/);
  assert.match(css,/\.beak\{/);
});

test('The ending reader copy does not use the canned “search is over” line',()=>{
  const js=readFileSync(new URL('../game.js',import.meta.url),'utf8');
  assert.doesNotMatch(js,/The search is over\. Take your time\./i);
  assert.match(js,/Read at your own pace/);
});
