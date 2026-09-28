// Persistent collection state is separate from resettable mission state. v0.3 endings migrate in place.
export const GALLERY_KEY='dottomon-recall.endings.v1';
export const ACHIEVEMENT_KEY='dottomon-recall.achievements.v1';
export const ENDING_IDS=Object.freeze(['good','secret','home','breach']);
export const ACHIEVEMENTS=Object.freeze({
 full_recall:{title:'Full Recall',description:'Discover all four endings.'},
 cold_plunge:{title:'Cold Plunge',description:'Fail a Safe capture at the fountain and land in the water without Dottoling.'},
 ahead:{title:'Ahead of Schedule',description:'Recover every mission assistant with at least 10:00 remaining.'},
 no_help:{title:'No Outside Help',description:'Recover every mission assistant without using a hint.'}
});
export function createProgress(storage) {
  let persistent=Boolean(storage);
  const read=(key,ids)=>{try{const value=JSON.parse(storage?.getItem(key)||'[]');return Array.isArray(value)?ids.filter(id=>value.includes(id)):[];}catch{persistent=false;return [];}};
  let discovered=read(GALLERY_KEY,ENDING_IDS),earned=read(ACHIEVEMENT_KEY,Object.keys(ACHIEVEMENTS));
  const save=()=>{try{if(!storage)throw Error('Unavailable');storage.setItem(GALLERY_KEY,JSON.stringify(discovered));storage.setItem(ACHIEVEMENT_KEY,JSON.stringify(earned));persistent=true;}catch{persistent=false;}};
  const unlock=id=>{if(!earned.includes(id)){earned.push(id);return true;}return false;};
  if(discovered.length===4&&unlock('full_recall'))save();
  return {
    get endings(){return [...discovered];},get achievements(){return [...earned];},get persistent(){return persistent;},
    discover(id){if(ENDING_IDS.includes(id)&&!discovered.includes(id)){discovered.push(id);if(discovered.length===4)unlock('full_recall');save();}},
    record(s){
      const before=[...earned];
      if(s.ending&&ENDING_IDS.includes(s.ending)&&!discovered.includes(s.ending)){discovered.push(s.ending);save();}
      if(discovered.length===4)unlock('full_recall');
      if(s.coldPlunge)unlock('cold_plunge');
      if(s.extraRevealed&&s.recovered===8){
        if(s.timeRemaining>=600)unlock('ahead');
        if(!['marina','albedo','durin'].some(person=>s[person+'HintUsed']))unlock('no_help');
      }
      const added=earned.filter(id=>!before.includes(id));if(added.length)save();return added;
    },
    reset(){discovered=[];earned=[];save();}
  };
}
