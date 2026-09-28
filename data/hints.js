import {CITY_DOTTOMONS,PALACE_DOTTOMONS,LOCATIONS} from './locations.js?v=0.5';
import {cityComplete,cityReady} from './placements.js?v=0.5';
const clues={
 'tea-one:pastry':'Somewhere warm enough to sit over tea, with proper plates and a bill.',
 'tea-one:market':'A shared tray of pastries, under an awning where the stalls sell tea.',
 'chemist:alchemy':'A commercial reagent case would have exactly what that empty vial needs.',
 'chemist:promenade':'Natural frost samples would take it along the frozen canal, away from the shops.',
 'archivist:archives':'Old research reports can supply the evidence it wants to bring him.',
 'archivist:depot':'Some technical manuals are stored beside their apparatus, among the equipment crates.',
 'coordinator:operations':'Dispatch schedules would give it a whole department to reorganize.',
 'coordinator:guardroom':'An escort request would take it to the watch roster and visitor ledger.',
 'runner:service':'A shortcut through maintenance openings would appeal to that one.',
 'runner:guardroom':'The heating grille beneath the watch benches is small enough for an ambitious shortcut.',
 'specialist:reagents':'Specialist materials are kept in a sealed cabinet near the research wing.',
 'specialist:depot':'The project’s mounting bracket comes from general apparatus stock, not a reagent cabinet.',
 'dottoling:plaza':'The warm fountain still has open water. That costume was much too clean when it left.',
 'dottoling:courier':'The dispatch carts track slush into the courier forecourt. There are very tempting puddles.'
};
const preferences={marina:['tea-one','coordinator','specialist','chemist','archivist','runner','dottoling'],albedo:['chemist','archivist','specialist','coordinator','runner','tea-one','dottoling'],durin:['runner','tea-one','dottoling','chemist','coordinator','specialist','archivist']};
const voice={
 marina:{'tea-one':'“They took two napkins, Feo. This sounds planned. ',coordinator:'“Someone here has very strong opinions about the schedule. ',dottoling:'“I’ve put a towel by the door. You may want one too. ',default:'“Feo, think about what it wanted to finish. '},
 albedo:{chemist:'“An empty sample tube suggests a specific errand. ',archivist:'“It will want evidence, not merely a plausible claim. ',specialist:'“It knows the apparatus. I would expect a carefully selected component. ',default:'“Its destination should follow its objective. '},
 durin:{runner:'“It watched the corridor map for a long time. I think it found a shorter route. ','tea-one':'“They made room for each other before they left. I think they wanted an afternoon together. ',dottoling:'“It stopped to look at every puddle on the way in. ',default:'“I think it still wants to bring him something useful. '}
};
const reassurance={marina:'“We’re keeping everyone here. You don’t have to check our end too.”',albedo:'“The assistants already recovered are accounted for. Your remaining search can stay focused.”',durin:'“I’m watching the door with Marina. No one else is following you.”'};
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
