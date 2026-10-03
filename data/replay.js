import {EXTRAS} from './personality.js?v=0.52';
// Presentation only: stable prose choices never draw from capture/placement randomness.
const beats={
 'tea-one:pastry':['The guest with the teacup has turned its handle away from the aisle. When Feofan comes over, it nudges the spare chair toward its partner.','The first guest checks the pastry box before taking Feofan’s hand. It taps the lid once: keep it level. “Understood,” he says.','The guest ducks behind the teapot. Feofan moves the hot cup out of the way before reaching for it again.'],
 'tea-one:market':['One guest keeps the awning cord from dripping into the other’s tea. Feofan waits for them to finish before he tries again.','Feofan folds the tray into a carrier and offers his hand. The first guest checks the folds, then climbs in.','The pair have moved back beneath the tea stall. Feofan shifts the hot cups to the counter before approaching.'],
 'chemist:alchemy':['The chemist has corrected a label in handwriting so small that Feofan has to bring it almost to his glasses. The correction is right.','The chemist checks the stopper, then climbs into his hand. Feofan gives the corrected label to the shopkeeper.','The chemist watches from behind the reagent case, still holding on to its sample. Feofan sets the vial down before reaching again.'],
 'chemist:promenade':['The samples are lined up beside the canal. One has a label that just says “later.”','Feofan pockets the stoppered samples separately so they cannot knock together. The chemist gives a low trill and lets him pick it up.','The tubes are back on the folded glove. Feofan steadies himself against the railing before reaching again.'],
 'archivist:archives':['A paper marker sits between two reports that disagree with each other. The archivist taps one, then the other.','The archivist checks that Feofan photographed both pages, then climbs down from the ladder. “I’ll send the files upstairs,” he says.','Feofan steadies the cabinet. The archivist is still among the lower files, out of reach.'],
 'archivist:depot':['The page marker is a folded inventory slip with one corner tucked into the crease.','Feofan records the serial numbers. The archivist folds its objections into the folio and lets him lift it from the crate.','The archivist is still inside the packing frame. Feofan braces the lid and tries another angle.'],
 'coordinator:operations':['The revised schedule gives the clerks a break. They seem to approve.','Feofan keeps the useful changes and cancels the unauthorized dispatch. The coordinator climbs into his hand after checking the revised schedule.','The coordinator is still behind the terminal, guarding the requisition. Feofan keeps the dispatch switch covered.'],
 'coordinator:guardroom':['It has left a space beside the stamp for someone else to countersign. The watch has declined that opportunity.','Feofan writes “for later review” across the request. The coordinator inspects the words, releases the stamp, and accepts its revised destination.','The order has been stopped. Feofan keeps the exit covered while its author waits beneath the bench.'],
 'runner:service':['The screws are sorted by length beside a sketch of the ventilation ducts. The runner has a plan. Feofan would like to see less of it.','Feofan offers to keep the duct measurements if the turbine stays unbuilt. The runner gives one sharp chirp, then climbs into his hand.','The open vent is covered. Feofan keeps a hand against it while the runner looks for another way through.'],
 'runner:guardroom':['The watch officer has put the loose screws in a dish. The runner keeps checking them.','Feofan lifts the runner away from the grille and returns the screws to the officer. The assistant points at its route. “I saw it. That’s why I stopped you.”','The runner is still behind the bench. Feofan frees his coat before he reaches in again.'],
 'specialist:reagents':['The transport tray is lined twice. At least the glassware is safe.','Feofan leaves a note beside the sealed materials for Zandik to review. The specialist checks the cabinet latch, then lets Feofan pick it up.','The specialist waits beside the cabinet, watching Feofan and the research door. The release catch is still within reach.'],
 'specialist:depot':['A second bracket has been rejected. The one it chose is an exact fit.','The component is reserved under Zandik’s project number. The specialist checks the receipt, then lets Feofan pick it up.','The instrument stand is steady. Feofan keeps himself between the specialist’s tray and the corridor.'],
 'dottoling:plaza':['A wet sleeve nudges the leaf away from the fountain outlet. The Dottoling Dottomon is keeping it afloat.','The Dottoling Dottomon climbs onto the towel after one last look at the leaf. Feofan wraps the wet sleeves inside. “Your passenger can manage on its own.”','The Dottoling Dottomon watches from the opposite rim. Feofan finds a firmer foothold and reaches again.'],
 'dottoling:courier':['The Dottoling Dottomon’s cat costume has ears stained two shades of slush. It examines one sleeve.','The parcel cloth makes a dry bundle around the Dottoling Dottomon. Feofan thanks the clerk. The assistant points back at the puddle; he shakes his head.','The cart is stopped. The Dottoling Dottomon waits by the far wheel while Feofan blocks the gap again.']
};
export const REPLAY_BEATS=beats;
export function proseChoice(s,key='',count=2) {
 const text=Object.entries(s.placements||{}).sort().map(([id,loc])=>id+loc).join('')+key;
 return [...text].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0)%count;
}
export function pressureLine(s) {
 if(s.timeRemaining<=180)return ['Feofan','“One door at a time. I can still do this.”'];
 if(s.cigarettes>=4)return 'Feofan stops and checks the route. He waits until he can focus, then chooses the next place to search.';
 if(s.stress>=50)return 'He lowers his voice and slows down. The assistant is still here; he can try again.';
 return null;
}
export function replayEncounter(s,target,location,base) {
 const extra=beats[target+':'+location];if(!extra)return base;
 const tries=s.attempts[location]||0,condition=pressureLine(s);
 const story={...base,lines:tries?[extra[2],['Feofan',tries>1?'“Same problem. Different angle.”':'“All right. Once more.”']]:proseChoice(s,target)?[...base.lines.slice(0,1),extra[0],...base.lines.slice(1)]:[...base.lines]};
 const more=EXTRAS[target+':'+location];
 if(more){
  if(!tries&&proseChoice(s,target+':opening'))story.lines[0]=more[0];
  const choice=proseChoice(s,target+':success',3);
  story.success=[base.success,extra[1],more[1]][choice];
  story.risky=proseChoice(s,target+':risky')?base.risky:more[2];
  const failures=[...base.failures,more[3]],offset=proseChoice(s,target+':failure',failures.length);
  story.failures=[...failures.slice(offset),...failures.slice(0,offset)];
  story.return=proseChoice(s,target+':return')?base.return:more[4];
 }
 if(condition)story.lines.push(condition);
 if(!more&&proseChoice(s,target+':success'))story.success=extra[1];
 return story;
}
export function fieldNote(s) {
 if(s.timeRemaining<=180)return 'One room at a time. An unchecked door is still a possibility.';
 if(s.cigarettes>=4)return 'I know the route. I can take a moment before I move.';
 if(s.extraRevealed&&!s.capturedDottomons.includes('dottoling'))return 'The Dottoling Dottomon’s costume is pale blue. I’m bringing a towel.';
 if(s.recovered>=7)return 'Almost there. Then I can ask how Zandik’s feeling.';
 if(s.palaceEntered)return s.stress?'Keep the door to research closed. The rest can wait its turn.':'I’ve negotiated border agreements with fewer objections.';
 return s.recovered?'They’re home. I’m checking the next place.':'They know this city better than I do. They’ll turn up.';
}
export const CODAS={
 good:['The tea has gone comfortably lukewarm. No one gets up to replace it yet.','A requisition stamp emerges from beneath a cushion. Feofan places it face down without comment. Zandik watches him do it, then takes his hand again.'],
 secret:['For once, nothing in the room is waiting for Feofan to solve it.','The assistants remain close. When his sleeve shifts, a tiny arm loosens its grip just enough to let him move, then settles beside his hand.'],
 home:['The recovered assistants stay by the cushions. Feofan counts them again, though he already knows the number.','This time, when a little arm points toward the hall, he shakes his head. They wait with him.'],
 breach:['The corridor settles into quiet. Feofan checks the latch once and leads the assistants away.','The reports and materials can be delivered another day. He keeps his voice low all the way home.']
};
