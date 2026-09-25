export const CITY_IDS = ['pastry', 'alchemy', 'market', 'promenade'];
export const PALACE_IDS = ['archives', 'operations', 'service', 'reagents', 'depot'];
export const CITY_DOTTOMONS = ['tea-one', 'tea-two', 'chemist'];
export const PALACE_DOTTOMONS = ['archivist', 'coordinator', 'runner', 'specialist'];
export const ALL_DOTTOMONS = [...CITY_DOTTOMONS, ...PALACE_DOTTOMONS];

export const LOCATIONS = {
  pastry: {name:'Pastry Shop', subtitle:'The Silver Saucer', region:'city', travel:30, icon:'tea', dottomons:['tea-one','tea-two'], mood:'amber'},
  alchemy: {name:'Alchemical Supply', subtitle:'Licensed reagents & glassware', region:'city', travel:30, icon:'flask', dottomons:['chemist'], mood:'teal'},
  market: {name:'Covered Market', subtitle:'Beneath the winter arcade', region:'city', travel:30, icon:'market', dottomons:[], mood:'amber'},
  promenade: {name:'Snowy Promenade', subtitle:'The frozen canal walk', region:'city', travel:45, icon:'water', dottomons:[], mood:'ice'},
  archives: {name:'Archives', subtitle:'Research records & restricted files', region:'palace', travel:30, icon:'book', dottomons:['archivist'], mood:'silver'},
  operations: {name:'Operations Wing', subtitle:'Dispatches & administration', region:'palace', travel:30, icon:'seal', dottomons:['coordinator'], mood:'silver'},
  service: {name:'Service Corridors', subtitle:'Maintenance & interior passages', region:'palace', travel:30, icon:'passage', dottomons:['runner'], mood:'teal'},
  reagents: {name:'Restricted Reagent Storage', subtitle:'Specialist materials', region:'palace', travel:30, icon:'flask', dottomons:['specialist'], mood:'teal'},
  depot: {name:'Equipment Depot', subtitle:'Instruments & apparatus', region:'palace', travel:30, icon:'crate', dottomons:[], mood:'silver'}
};

export const COSTS = Object.freeze({capture:15, failure:30, call:20, smoking:60, search:30, palace:60});
