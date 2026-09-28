// Presentation only: stable prose choices never draw from capture/placement randomness.
const beats={
 'tea-one:pastry':['The guest with the teacup has turned the handle away from the aisle. Even the escape has table manners.','The first guest accepts the pastry box on the condition, communicated with one firm tap, that it stays level. Feofan agrees. He has negotiated less reasonable terms.','The tea is safely out of reach. Both guests remain at their table, regarding him as a disappointing interruption.'],
 'tea-one:market':['One tiny arm keeps the awning cord from dripping into the other guest’s cup. The care is unmistakable.','Feofan folds the tray into a carrier and offers his hand. The first guest checks the folds, then climbs aboard. Apparently his packaging has passed inspection.','The pair have regrouped beneath the tea stall. Feofan moves the hot cups to the counter before approaching again.'],
 'chemist:alchemy':['A label has been corrected in handwriting so small that Feofan has to bring it almost to his glasses. The correction is right.','The chemist checks the stopper one last time and accepts his hand. Feofan leaves the corrected label with the shopkeeper. Someone should benefit from this expedition.','The reagent case is secure. The chemist watches from behind it, still unwilling to abandon its sample.'],
 'chemist:promenade':['The samples are labeled in order of collection. There is also a fourth label, optimistically blank.','Feofan pockets the stoppered samples separately so they cannot knock together. The chemist approves with a low trill, then lets him lift it away from the canal.','The tubes are safe on the folded glove. Feofan braces against the railing and adjusts his approach to the bench.'],
 'archivist:archives':['A paper marker rests across a paragraph that contradicts the report above it. This is a disagreement with supporting documentation.','The archivist verifies that both contradictory pages have been photographed. Only then does it surrender its place on the ladder. Feofan respects the standards, if not the schedule.','Feofan steadies the cabinet. The archivist remains among the lower files; the route to research is still blocked.'],
 'archivist:depot':['The page marker is a folded inventory slip. Its missing corner has been carefully tucked into the same crease.','With the serial plates recorded, the archivist allows itself to be lifted from the crate. Feofan closes the folio around its marker. An argument this well indexed can wait.','The crate lid is braced open. The archivist is still inside the packing frame with its folio.'],
 'coordinator:operations':['The revised schedule includes a break for the clerks. Feofan suspects this has helped its approval rating.','Feofan retains the useful amendments and cancels the unauthorized dispatch. The coordinator climbs into his hand with the air of someone whose advice has finally been taken.','The dispatch switch is secured. The coordinator is still behind the terminal, guarding the requisition.'],
 'coordinator:guardroom':['It has left a space beside the stamp for someone else to countersign. The watch has declined that opportunity.','Feofan writes “for later review” across the request. The coordinator inspects the words, releases the stamp, and accepts its revised destination.','The order has been stopped. Feofan keeps the exit covered while its author waits beneath the bench.'],
 'runner:service':['The screws have been arranged by length. There is a method here, which makes the destination considerably more concerning.','The runner accepts a hand up once Feofan points out that the grille can be closed from this side. He collects every screw before sending its would-be engineer home.','The open vent is covered. Feofan keeps a hand against it while the runner searches for another angle.'],
 'runner:guardroom':['The watch officer has moved the loose screws into a dish. The runner seems to consider this active collaboration.','Feofan lifts the runner away from the grille and returns the dish of screws to the officer. The assistant points once more at its route. “I saw it. That was why I stopped you.”','The research-wing door remains shut. The runner is still behind the bench; Feofan frees his coat before reaching again.'],
 'specialist:reagents':['The transport tray has been lined twice. Whatever else happens, the glassware was going to arrive unchipped.','Feofan puts a collection note beside the sealed materials. The specialist checks the cabinet latch for itself, then reluctantly accepts the lift home.','The release catch is out of reach. The specialist waits beside the cabinet, watching both Feofan and the research door.'],
 'specialist:depot':['A second bracket has been rejected and set aside. The selected one is an exact fit, down to the last mounting hole.','The component is reserved under the correct project number. The specialist takes its receipt in both arms and allows Feofan to send it home.','The instrument stand is steady again. Feofan places himself between the specialist’s tray and the corridor.'],
 'dottoling:plaza':['A damp little sleeve steers the leaf away from the outlet. This is evidently a supervised voyage.','Dottoling climbs onto the towel after one last look at the leaf. Feofan wraps the wet sleeves inside it. “Your passenger will have to make its own arrangements.”','Dottoling watches from the opposite rim. Feofan finds a firmer foothold; neither the leaf nor its self-appointed navigator has left.'],
 'dottoling:courier':['The costume’s ears have collected two different shades of slush. Dottoling examines one sleeve with undiminished interest.','The parcel cloth becomes a dry bundle with one red eye above the fold. Feofan thanks the clerk. Dottoling points back at the puddle; the request is declined.','The cart is stationary. Dottoling waits by the far wheel while Feofan blocks the narrow gap again.']
};
export const REPLAY_BEATS=beats;
export function proseChoice(s,key='') {
 const text=Object.entries(s.placements||{}).sort().map(([id,loc])=>id+loc).join('')+key;
 return [...text].reduce((n,c)=>(n*31+c.charCodeAt(0))>>>0,0)%2;
}
export function pressureLine(s) {
 if(s.timeRemaining<=180)return ['Feofan','“One thing at a time. You first. Then the next door.”'];
 if(s.cigarettes>=4)return 'Feofan pauses with his hand flat against his coat. He checks the route again, giving himself a moment before moving. There is no advantage in missing what is in front of him.';
 if(s.stress>=50)return 'He keeps his voice level and his movements deliberate. The assistant is still here. He can make the next approach carefully.';
 return null;
}
export function replayEncounter(s,target,location,base) {
 const extra=beats[target+':'+location];if(!extra)return base;
 const tries=s.attempts[location]||0,condition=pressureLine(s);
 const story={...base,lines:tries?[extra[2],['Feofan',tries>1?'“Same problem. Different angle.”':'“All right. Once more.”']]:proseChoice(s,target)?[...base.lines.slice(0,1),extra[0],...base.lines.slice(1)]:[...base.lines]};
 if(condition)story.lines.push(condition);
 if(proseChoice(s,target+':success')||(s.attempts[location]||0)>1)story.success=extra[1];
 return story;
}
export function fieldNote(s) {
 if(s.timeRemaining<=180)return 'One room at a time. An unchecked door is still a possibility.';
 if(s.cigarettes>=4)return 'I know the route. I can take a moment before I move.';
 if(s.extraRevealed&&!s.capturedDottomons.includes('dottoling'))return 'A cat costume. In this weather. I’m bringing a towel.';
 if(s.recovered>=7)return 'One more. Then I can ask him how he’s feeling.';
 if(s.palaceEntered)return s.stress?'Keep the door to research closed. The rest can wait its turn.':'I’ve negotiated border agreements with fewer objections.';
 return s.recovered?'Safely home means safely home. I’m checking the next place.':'They have centuries of research experience. They can find their way home.';
}
export const CODAS={
 good:['The tea has gone comfortably lukewarm. No one gets up to replace it yet.','A requisition stamp emerges from beneath a cushion. Feofan places it face down without comment. Zandik watches him do it, then takes his hand again.'],
 secret:['For once, nothing in the room is waiting for Feofan to solve it.','The assistants remain close. When his sleeve shifts, a tiny arm loosens its grip just enough to let him move, then settles beside his hand.'],
 home:['The recovered assistants stay by the cushions. Feofan counts them again, though he already knows the number.','This time, when a little arm points toward the hall, he shakes his head. They wait with him.'],
 breach:['The corridor settles into quiet. Feofan checks the latch once and leads the assistants away.','The reports and materials can be delivered another day. He keeps his voice low all the way home.']
};
