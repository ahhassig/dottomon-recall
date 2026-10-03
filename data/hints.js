import {CITY_DOTTOMONS,PALACE_DOTTOMONS,LOCATIONS} from './locations.js?v=0.52';
import {cityComplete,cityReady} from './placements.js?v=0.52';
const clues={
 'tea-one:pastry':'Somewhere warm enough to sit over tea, with proper plates and a bill.',
 'tea-one:market':'A shared tray of pastries, under an awning where the stalls sell tea.',
 'chemist:alchemy':'A commercial reagent case would have exactly what that empty vial needs.',
 'chemist:promenade':'After taking a shop sample without paying, it might compare it with natural frost along the canal.',
 'archivist:archives':'Old resonance reports could supply the frequency for its own very loud experiment.',
 'archivist:depot':'A resonator’s manual would be stored with the apparatus among the equipment crates. It wants to test its own theory.',
 'coordinator:operations':'Its pressure demonstration needs a department’s worth of deliveries. It would want the dispatch schedules.',
 'coordinator:guardroom':'An escort for its pressure rig would require the watch roster and visitor ledger.',
 'runner:service':'Its turbine experiment needs a route through the maintenance openings toward the laboratory.',
 'runner:guardroom':'The heating grille beneath the watch benches could be a shortcut for its turbine experiment.',
 'specialist:reagents':'The helpful one needs the sealed specialist cabinet, one short passage from the laboratory.',
 'specialist:depot':'The helpful one could be selecting a mounting bracket among the apparatus stock beside the laboratory.',
 'dottoling:plaza':'The Dottoling Dottomon left in a clean cat costume. The warm fountain has open water.',
 'dottoling:courier':'The dispatch carts track slush into the courier forecourt. There are very tempting puddles.'
};
const preferences={lumine:['tea-one','coordinator','specialist','chemist','archivist','runner','dottoling'],albedo:['chemist','archivist','specialist','coordinator','runner','tea-one','dottoling'],durin:['runner','tea-one','dottoling','chemist','coordinator','specialist','archivist']};
const voice={
 lumine:{'tea-one':'“They took two napkins, Feo. This sounds planned. ',coordinator:'“Someone here has very strong opinions about the schedule. ',dottoling:'“I’ve put a towel by the door. You may want one too. ',default:'“Feo, think about what it wanted to finish. '},
 albedo:{chemist:'“An empty sample tube suggests a specific errand. ',archivist:'“It will want evidence, not merely a plausible claim. ',specialist:'“It knows the apparatus. I would expect a carefully selected component. ',default:'“Its destination should follow its objective. '},
 durin:{runner:'“It watched the corridor map for a long time. I think it found a shorter route. ','tea-one':'“They made room for each other before they left. I think they wanted an afternoon together. ',dottoling:'“The Dottoling Dottomon stopped to look at every puddle on the way in. ',default:'“I think it has a project it is very determined to finish. '}
};
const reassurance={lumine:'“We’re keeping everyone here. You don’t have to check our end too.”',albedo:'“The assistants already recovered are accounted for. Your remaining search can stay focused.”',durin:'“I’m watching the door with Lumine. No one else is following you.”'};
export function chooseHint(person,s) {
  if(!s.palaceEntered&&cityReady(s))return {target:null,location:null,text:'“Everyone from the city is home now. Head into the Palace; we’ll keep this end quiet.”'};
  if(!s.extraRevealed&&cityComplete(s))return {target:null,location:null,text:'“Let us finish the recount before you head inside. I’ll call you straight back.”'};
  const candidates=(s.palaceEntered?PALACE_DOTTOMONS:s.extraRevealed?['dottoling']:CITY_DOTTOMONS).filter(id=>id!=='tea-two'&&!s.capturedDottomons.includes(id));
  const told=Object.values(s.hintDetails).map(h=>h.target);
  const ranked=[...candidates].sort((a,b)=>{
    const score=id=>(told.includes(id)?10:0)+(s.locationsVisited[s.placements[id]]?0:4)+(preferences[person].indexOf(id)/10);
    return score(a)-score(b);
  });
  const target=ranked[0];if(!target)return {target:null,location:null,text:'“Keep everyone already home safe. There is no new lead to add.”'};
  const location=s.placements[target],known=s.locationsVisited[location];
  return {target,location,text:known?`“You already found the assistant at ${LOCATIONS[location].name}. It is still there; you haven’t recovered it yet.”`:(voice[person][target]||voice[person].default)+clues[target+':'+location]+'”',
    follow:s.cigarettes>=5?'“You’ve already had to stop five times. Another critical episode will end the search; please be careful.”':(s.attempts[location]||0)>=3?'“If you choose a guaranteed capture, remember how much another critical-stress episode will cost you.”':told.includes(target)?'“That is still the best lead we have.”':reassurance[person]};
}
export const hintFor=(person,s)=>s.hintDetails[person]||chooseHint(person,s);
