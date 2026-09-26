// Browser progress is deliberately separate from the pure, resettable mission state.
export const GALLERY_KEY = 'dottomon-recall.endings.v1';
export const ENDING_IDS = Object.freeze(['good','secret','home','breach']);
export function createProgress(storage) {
  let discovered = [];
  let persistent = Boolean(storage);
  try {
    const value = JSON.parse(storage?.getItem(GALLERY_KEY) || '[]');
    if (Array.isArray(value)) discovered = ENDING_IDS.filter(id=>value.includes(id));
  } catch { persistent=false; }
  const save=()=>{
    try { if (!storage) throw Error('Storage unavailable'); storage.setItem(GALLERY_KEY,JSON.stringify(discovered)); persistent=true; }
    catch { persistent=false; }
  };
  return {
    get endings(){return [...discovered];},
    get persistent(){return persistent;},
    discover(id){if(ENDING_IDS.includes(id)&&!discovered.includes(id)){discovered.push(id);save();}},
    reset(){discovered=[];save();}
  };
}
