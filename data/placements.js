import {CITY_DOTTOMONS,PALACE_DOTTOMONS} from './locations.js?v=0.4';
// Each identity has exactly two authored destinations. The date is one placement unit.
export const POOLS=Object.freeze({
  'tea-one':['pastry','market'],chemist:['alchemy','promenade'],
  archivist:['archives','depot'],coordinator:['operations','guardroom'],
  runner:['service','guardroom'],specialist:['reagents','depot'],dottoling:['plaza','courier']
});
const units=Object.keys(POOLS);
// Curated combinations exclude shared rooms; no reroll loop or impossible assignment.
export const VALID_PLACEMENTS=[];
for(let bits=0;bits<2**units.length;bits++) {
  const assignment=Object.fromEntries(units.map((id,i)=>[id,POOLS[id][(bits>>i)&1]]));
  if(new Set(Object.values(assignment)).size!==units.length) continue;
  assignment['tea-two']=assignment['tea-one'];
  VALID_PLACEMENTS.push(Object.freeze(assignment));
}
export function assignLocations(random=Math.random) {
  return {...VALID_PLACEMENTS[Math.min(VALID_PLACEMENTS.length-1,Math.floor(random()*VALID_PLACEMENTS.length))]};
}
export const missionTotal=s=>s.extraRevealed?8:7;
export const cityComplete=s=>CITY_DOTTOMONS.every(id=>s.capturedDottomons.includes(id));
export const cityReady=s=>cityComplete(s)&&s.extraRevealed&&s.capturedDottomons.includes('dottoling');
export const assignedAt=(s,location)=>Object.keys(s.placements).filter(id=>s.placements[id]===location&&(id!=='dottoling'||s.extraRevealed));
export const remainingAt=(s,location)=>assignedAt(s,location).filter(id=>!s.capturedDottomons.includes(id));
export const remainingPalace=s=>PALACE_DOTTOMONS.filter(id=>!s.capturedDottomons.includes(id));
