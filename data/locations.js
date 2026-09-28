export const CITY_IDS = ['pastry', 'alchemy', 'market', 'promenade', 'courier'];
export const PALACE_IDS = ['archives', 'operations', 'service', 'reagents', 'depot', 'guardroom'];
export const CITY_DOTTOMONS = ['tea-one', 'tea-two', 'chemist'];
export const PALACE_DOTTOMONS = ['archivist', 'coordinator', 'runner', 'specialist'];
export const ORIGINAL_DOTTOMONS = [...CITY_DOTTOMONS, ...PALACE_DOTTOMONS];
export const ALL_DOTTOMONS = [...ORIGINAL_DOTTOMONS, 'dottoling'];

export const LOCATIONS = {
  plaza: {name:'Plaza Fountain', subtitle:'The warm spring beneath the snow', region:'city', travel:0, icon:'water', mood:'ice'},
  pastry: {name:'Pastry Shop', subtitle:'The Silver Saucer', region:'city', travel:30, icon:'tea', mood:'amber'},
  alchemy: {name:'Alchemical Supply', subtitle:'Licensed reagents & glassware', region:'city', travel:30, icon:'flask', mood:'teal'},
  market: {name:'Covered Market', subtitle:'Beneath the winter arcade', region:'city', travel:30, icon:'market', mood:'amber'},
  promenade: {name:'Snowy Promenade', subtitle:'The frozen canal walk', region:'city', travel:45, icon:'water', mood:'ice'},
  courier: {name:'Courier Station', subtitle:'Letters, parcels & winter dispatches', region:'city', travel:45, icon:'letter', mood:'amber'},
  archives: {name:'Archives', subtitle:'Research records & restricted files', region:'palace', travel:30, icon:'book', mood:'silver'},
  operations: {name:'Operations Wing', subtitle:'Dispatches & administration', region:'palace', travel:30, icon:'seal', mood:'silver'},
  service: {name:'Service Corridors', subtitle:'Maintenance & interior passages', region:'palace', travel:30, icon:'passage', mood:'teal'},
  reagents: {name:'Restricted Reagent Storage', subtitle:'Specialist materials', region:'palace', travel:30, icon:'flask', mood:'teal'},
  depot: {name:'Equipment Depot', subtitle:'Instruments & apparatus', region:'palace', travel:30, icon:'crate', mood:'silver'},
  guardroom: {name:'Palace Guardroom', subtitle:'Watch rotations & visitor records', region:'palace', travel:30, icon:'shield', mood:'silver'}
};

export const MISSION_SECONDS = 20 * 60;
export const SAFE_CHANCE = 0.5;
export const COSTS = Object.freeze({capture:15, failure:30, call:20, smoking:60, search:30, palace:60});
