// Original miniature character emblems, designed for legibility beside dialogue.
const CHARACTERS = {
  Feofan: {color:'#c8b5e4', path:'M8 17c2-6 7-9 16-9s14 3 16 9M9 24h12m6 0h12M21 24h6M9 24v4c0 7 12 7 12 0v-4m6 0v4c0 7 12 7 12 0v-4M20 39h8M11 17l3-6m21 6-3-6'},
  Marina: {color:'#e8bd89', path:'M24 5a19 19 0 1 0 0 38 19 19 0 0 0 0-38M24 11l4 9 10 4-10 4-4 9-4-9-10-4 10-4 4-9M7 8l4 3M37 37l4 3'},
  Albedo: {color:'#d6cf9a', path:'M24 5l12 19-12 19L12 24 24 5M7 13h6M35 35h6M24 5v38M12 24h24M24 17l5 7-5 7-5-7 5-7'},
  Durin: {color:'#c6ade8', path:'M24 31C17 14 10 13 5 10l4 20 8-3 7 10 7-10 8 3 4-20c-5 3-12 4-19 21M24 16v21m-4-24 4 3 4-3M14 39l10 4 10-4'},
  Zandik: {color:'#9bd2e5', path:'M6 12l18 6 18-6-7 17-11 10-11-10L6 12M12 21l8 3m8 0 8-3M24 18v21M18 8l6-3 6 3'}
};

export function speakerIcon(name) {
  const character=CHARACTERS[name];
  if(!character) return '';
  return `<span class="speaker-icon" data-speaker="${name}" style="--speaker-color:${character.color}" aria-hidden="true"><svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="${character.path}"/></svg></span>`;
}
