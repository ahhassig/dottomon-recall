import {ALL_DOTTOMONS,PALACE_DOTTOMONS} from './data/locations.js?v=0.51';
// Persistent collection state is separate from resettable mission state. v0.3 endings migrate in place.
export const REPORT_KEY='dottomon-recall.reports.v1';
export const GALLERY_KEY='dottomon-recall.endings.v1';
export const ACHIEVEMENT_KEY='dottomon-recall.achievements.v1';
export const ENDING_IDS=Object.freeze(['good','secret','home','breach']);
export const ACHIEVEMENTS=Object.freeze({
 full_recall:{title:'Full Recall',description:'Discover all four endings.'},
 cold_plunge:{title:'Cold Plunge',description:'Fail a Safe capture at the fountain and land in the water without Dottoling.'},
 ahead:{title:'Ahead of Schedule',description:'Recover every mission assistant with at least 05:00 remaining.'},
 no_help:{title:'No Outside Help',description:'Recover every mission assistant without using a hint.'}
});
// Store only known identifiers and bounded numbers, never rendered HTML or dialogue.
export function cleanReport(value) {
  if(!value||typeof value!=='object')return null;
  const r=value.endingSummary,ids=value.capturedDottomons;
  if(!r||!Array.isArray(ids)||ids.some(id=>!ALL_DOTTOMONS.includes(id))||new Set(ids).size!==ids.length)return null;
  if(typeof value.extraRevealed!=='boolean'||r.total!==(value.extraRevealed?8:7)||r.recovered!==ids.length)return null;
  for(const [key,max]of [['timeRemaining',1200],['recovered',8],['cigarettes',5],['hintsUsed',3]])if(!Number.isInteger(r[key])||r[key]<0||r[key]>max)return null;
  if(!value.extraRevealed&&ids.includes('dottoling'))return null;
  if(ids.includes('tea-one')!==ids.includes('tea-two'))return null;
  if(!Array.isArray(r.uncapturedPalace)||r.uncapturedPalace.some(id=>!PALACE_DOTTOMONS.includes(id))||new Set(r.uncapturedPalace).size!==r.uncapturedPalace.length)return null;
  if(PALACE_DOTTOMONS.some(id=>r.uncapturedPalace.includes(id)===ids.includes(id)))return null;
  return {extraRevealed:value.extraRevealed,recovered:r.recovered,capturedDottomons:[...ids],endingSummary:{timeRemaining:r.timeRemaining,recovered:r.recovered,total:r.total,cigarettes:r.cigarettes,hintsUsed:r.hintsUsed,uncapturedPalace:[...r.uncapturedPalace]}};
}
export function createProgress(storage) {
  let persistent=Boolean(storage);
  const read=(key,ids)=>{try{const value=JSON.parse(storage?.getItem(key)||'[]');return Array.isArray(value)?ids.filter(id=>value.includes(id)):[];}catch{persistent=false;return [];}};
  let discovered=read(GALLERY_KEY,ENDING_IDS),earned=read(ACHIEVEMENT_KEY,Object.keys(ACHIEVEMENTS));
  let reports={};
  try{const data=JSON.parse(storage?.getItem(REPORT_KEY)||'{}');for(const id of discovered){const report=cleanReport(data?.[id]);if(report)reports[id]=report;}}catch{}
  const save=()=>{try{if(!storage)throw Error('Unavailable');storage.setItem(GALLERY_KEY,JSON.stringify(discovered));storage.setItem(ACHIEVEMENT_KEY,JSON.stringify(earned));storage.setItem(REPORT_KEY,JSON.stringify(reports));persistent=true;}catch{persistent=false;}};
  const unlock=id=>{if(!earned.includes(id)){earned.push(id);return true;}return false;};
  if(discovered.length===4&&unlock('full_recall'))save();
  return {
    get endings(){return [...discovered];},get achievements(){return [...earned];},get persistent(){return persistent;},
    runFor(id){return discovered.includes(id)&&reports[id]?structuredClone(reports[id]):null;},
    discover(id){if(ENDING_IDS.includes(id)&&!discovered.includes(id)){discovered.push(id);if(discovered.length===4)unlock('full_recall');save();}},
    record(s){
      const before=[...earned];
      if(ENDING_IDS.includes(s.ending)){const report=cleanReport(s);if(report)reports[s.ending]=report;}
      if(s.ending&&ENDING_IDS.includes(s.ending)&&!discovered.includes(s.ending)){discovered.push(s.ending);save();}
      if(discovered.length===4)unlock('full_recall');
      if(s.coldPlunge)unlock('cold_plunge');
      if(s.extraRevealed&&s.recovered===8){
        if(s.timeRemaining>=300)unlock('ahead');
        if(!['lumine','albedo','durin'].some(person=>s[person+'HintUsed']))unlock('no_help');
      }
      const added=earned.filter(id=>!before.includes(id));if(added.length||ENDING_IDS.includes(s.ending))save();return added;
    },
    reset(){discovered=[];earned=[];reports={};save();}
  };
}
