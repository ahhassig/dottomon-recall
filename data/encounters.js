import {replayEncounter} from './replay.js?v=0.52';
import {ENCOUNTERS} from './dialogue.js?v=0.52';
import {CAPTURE_FLAVOR} from './flavor.js?v=0.52';
import {remainingAt,assignedAt} from './placements.js?v=0.52';
const defaults={'tea-one':'pastry',chemist:'alchemy',archivist:'archives',coordinator:'operations',runner:'service',specialist:'reagents'};
export const VARIANTS={};
for(const [id,location]of Object.entries(defaults)) {
  const story=ENCOUNTERS[location];
  VARIANTS[id+':'+location]={...story,success:Array.isArray(story.success)?story.success[0]:story.success,...CAPTURE_FLAVOR[location]};
}
Object.assign(VARIANTS,{
 'tea-one:market':{
  title:'Tea beneath the awning.',
  lines:['At a tea stall beneath the glass arcade, two folded scarves have become chair cushions. The date pair sit opposite each other with a paper tray of warm pastries between them.', ['Feofan','“A change of venue. How enterprising.”'], 'One Dottomon turns the tray so its partner can reach the last honey cake. The other shields the tea from a draft with the stall’s menu. Neither has any interest in the nearby Palace.', ['Feofan','“Finish the mouthful. We’re taking the rest home.”'], 'A small arm covers the tray. The invitation requires negotiation.'],
  success:'The first guest accepts the takeaway tray and climbs into reach. Feofan thanks the vendor for the tea. It is the only part of the excursion anyone has paid for willingly.',
  failures:['The guest ducks beneath the stall bench while Feofan takes the hot tea out of its path. A customer steps backward into the narrow aisle; Feofan catches the cup and steers them clear, his chance gone.', 'A blue tuft vanishes behind the menu. Feofan reaches the far side of the bench in time to block the exit, but has to twist beneath the awning pole to do it. His shoulder and his patience register separate objections.'],
  risky:'Feofan steps across the narrow bench opening and intercepts the guest before it can slide beneath the counter. The awning rattles against his shoulder. He keeps both the assistant and the tea upright, then needs a moment out of the crowd.',
  return:'The vendor offers a loyalty card. Feofan declines on behalf of the entire household.'},
 'chemist:promenade':{
  title:'The chemist’s canal experiment.',
  lines:['Beside the frozen canal, the chemist has arranged three stoppered sample tubes on a folded glove. A blue tuft bends over a patch of frost as one tiny arm scrapes a measured sample. One sealed tube bears the alchemical shop’s stock label; a price tag still hangs from the borrowed-without-asking glove.', ['Feofan','“Fieldwork requires telling someone which field.”'], 'The Dottomon taps the three tubes in order, then presents a remarkably careful temperature chart. It has found a difference worth investigating and acquired the comparison material without paying for it. Feofan sets the sealed shop tube apart for return.', ['Feofan','“Keep your notes. Leave the canal.”'], 'It pulls the glove closer and huffs. Apparently the experiment has not reached a convenient stopping point.'],
  success:'Feofan waits while the last tube is stoppered, then collects the chemist and its notes. The frost can continue being scientifically interesting without an audience.',
  failures:['The chemist slides behind the canal bench with its samples. Feofan plants his foot on the icy path to block it, slips a fraction, and catches the railing hard. The tubes remain safe; his pulse does not settle as quickly.', 'It offers him the chart, then ducks beneath the bench. A tube rolls toward the canal edge. Feofan catches it before the drop and has to begin the approach again, still gripping the cold glass.'],
  risky:'Feofan braces against the railing, reaches around the bench and gathers the chemist with its glove of samples. The icy footing demands a hard, awkward twist. He waits until his hands settle before checking the stoppers.',
  return:'He marks the samples “later.” The chemist underlines the word.'},
 'archivist:depot':{
  title:'An open crate and a very large manual.',
  lines:['A crate stands open in the equipment depot. The archivist is perched inside it, comparing a resonator’s serial number with a maintenance folio almost larger than itself. Its own experiment proposes testing the laboratory model at maximum amplitude while Zandik works.', ['Feofan','“You could have requested a copy.”'], 'A little arm points at the folio’s missing revision page, then at a second crate. The search has apparently become recursive.', ['Feofan','“Photographs. Then home. The crates stay here.”']],
  success:'The archivist permits photographs of the serial plates and folds its page marker into the folio. Feofan sends it home with the evidence and leaves the apparatus where it belongs.',
  failures:['It slips behind the open crate lid as he lowers the camera. The lid tips toward the folio; Feofan catches it with his forearm and loses the opening. The quartermaster arrives just as he is disentangling his sleeve.', 'The archivist scoots beneath a packing frame, still pointing toward the next crate. Feofan crouches to block the gap and catches a sliding instrument case with his knee. The case stops; his leg takes a moment to stop shaking.'],
  risky:'Feofan holds the crate lid back and reaches inside before the archivist can climb into the packing frame. He supports both the creature and the heavy folio; the cramped lift leaves him needing a quiet minute.',
  return:'The quartermaster asks whether the manual is defective. “Only its reader’s sense of timing.”'},
 'coordinator:guardroom':{
  title:'The coordinator changed the schedule.',
  lines:['Two guards stand over the visitor ledger. Between them, the coordinator has laid a ribbon across the duty roster and is tapping a proposed new route toward the laboratory.', ['Watch officer','“It wants an escort, my lord.”'], ['Feofan','“It has one. The destination is changing.”'], 'The assistant pushes a neatly stamped requisition toward him: a pressure rig, three canisters, and space in the occupied laboratory for its own demonstration. The guards have sensibly refused to act on a signature made of chirps.'],
  success:'The coordinator yields the stamp when Feofan folds its proposal for later discussion. The watch keeps its original route. The smallest applicant is escorted home.',
  failures:['The coordinator takes shelter behind the visitor ledger. Its ribbon catches the desk bell; every guard looks up. Feofan stops the outgoing order and explains the interruption while keeping one hand across the escape route.', 'It darts beneath the bench with the duty roster. Feofan blocks the corridor before it can reach the open door, then has to crouch in his coat while the watch waits for instructions. His voice remains level; the effort is considerable.'],
  risky:'Feofan closes the ledger over the unsigned order and intercepts its author beside the bench. The entire watch stands to attention at the scrape of his chair. He dismisses them calmly, then takes his minute in the corridor.',
  return:'The watch is reminded that administrative confidence is not a rank.'},
 'runner:guardroom':{
  title:'Under the guardroom bench.',
  lines:['A damp trail leads beneath the guardroom bench. The runner’s untidy blue tuft appears beside a heating grate, inches from a neatly arranged row of screws.', ['Feofan','“Put those back.”'], 'It glances at the watch officer, then at the corridor map. A tiny arm traces a shortcut under the bench. Beside the map, its own turbine experiment calls for smoke tracers and a full-speed test in Zandik’s laboratory. It has planned everything except how anyone else might keep working.', ['Feofan','“I can read a floor plan too.”'], 'He closes the door toward research before lowering himself beside the grate. The officer quietly moves the spare cloaks out of his way.'],
  success:'The runner grudgingly lets him lift it clear of the grate. The screws return to their holes; the assistant returns home. The watch officer promises to check the other grilles.',
  failures:['It doubles back beneath the bench. Feofan blocks the grate with one hand and catches a falling helmet with the other, preventing a crash that would carry down the corridor. His breath catches with the effort.', 'A little black shape shoots behind the cloak stand. Feofan reaches the door first, but the sudden turn pulls his coat beneath the bench. He has to free himself without opening the route again.'],
  risky:'Feofan lowers himself beside the bench and intercepts the runner at the grille. The angle is cramped, the floor cold, and the officer tactfully looks away while he gets upright. He needs to stop before continuing.',
  return:'“Excellent initiative,” Feofan tells the officer who brought a screwdriver. He does not mean the runner.'},
 'specialist:depot':{
  title:'Selected for the project.',
  lines:['The specialist has occupied a padded instrument tray in the depot, one short passage from Zandik’s laboratory. It is testing the fit of a mounting bracket against the exact model used in Zandik’s laboratory.', ['Feofan','“Yes. That is the correct part.”'], 'An eager trill. Two small arms lift the bracket toward him.', ['Feofan','“No. That was not permission to deliver it.”'], 'Feofan places the tray away from the corridor door. The Dottomon keeps one arm firmly around its chosen component.'],
  success:'He labels the component for collection after the experiment and closes the tray. The specialist accepts the receipt and goes home still studying the model number.',
  failures:['The specialist releases the bracket but ducks behind the instrument stand. A loose clamp drops toward the floor. Feofan catches it before the crash, then has to reposition himself between the assistant and the door.', 'It slips through the tray handle, dragging a strip of packing felt. The tray starts sliding off the bench. Feofan steadies it with both hands while the assistant retreats, leaving his pulse racing.'],
  risky:'Feofan blocks the tray handle and gathers the specialist before it can reach the door with the bracket. He catches the shifting instrument stand with his shoulder. Nothing falls, but the near miss costs him a pause.',
  return:'The component is reserved. Its self-appointed courier has been recalled.'},
 'dottoling:plaza':{
  title:'In the fountain.',
  lines:['The fountain’s warm spring keeps a small pool clear of ice. The pale blue cat costume bobs across it, its ears dark with water. Inside the hood, the Dottoling Dottomon watches a leaf circle the pool.', ['Feofan','“You followed me out here for this?”'], 'The Dottoling rolls onto its back and sends a small splash toward the leaf. When Feofan reaches out, it grabs the fountain rim. It is not ready to leave.', ['Feofan','“I’ve got a towel. That’s the offer.”'], 'The stone edge is wet. Feofan checks his footing before reaching down.'],
  success:'The Dottoling Dottomon takes the towel in both arms. Feofan lifts it out of the spring and wraps the dripping costume around it. The leaf keeps circling.',
  failures:['The Dottoling Dottomon rolls just beyond his hand. Feofan follows; his boot slips on the wet rim and he lands in the shallow fountain. He comes up soaked and empty-handed. The Dottoling paddles to the other side while several pedestrians suddenly find the snow very interesting.'],
  risky:'Feofan steps into the shallow fountain and catches the Dottoling Dottomon on its next roll. He keeps its face clear of the water and wraps it in the towel. Water fills his boots. He waits a moment before climbing back out.',
  return:'The Dottoling points at the leaf. “It has its own transport,” Feofan tells it.'},
 'dottoling:courier':{
  title:'Special delivery: slush.',
  lines:['In the courier station forecourt, the pale blue cat costume is picking up a coat of slush. The Dottoling Dottomon rolls through a puddle, then watches the ripples spread.', ['Feofan','“Lumine’s going to ask what happened to that costume.”'], 'It holds up one muddy arm.', ['Feofan','“I know. I can see it.”'], 'Feofan borrows a clean parcel cloth and blocks the gap beside the dispatch cart. The Dottoling watches the cloth, then rolls straight back toward the puddle.'],
  success:'The Dottoling Dottomon lets him wrap the parcel cloth around the muddy costume. Feofan checks its feet, thanks the clerk, and carries it out of the slush.',
  failures:['The Dottoling Dottomon rolls beneath the dispatch cart. Feofan catches the cart with his shoulder, splashing slush up his coat, then crouches beside the waiting parcels to keep it in sight.', 'A paw-shaped sleeve takes the cloth, then lets go. The Dottoling Dottomon rolls around the cart wheel. Feofan steps into the puddle to block it and sinks ankle-deep in slush. The clerk asks if he needs help. “Dry socks,” he says. “And another try.”'],
  risky:'Feofan kneels in the slush and catches the Dottoling Dottomon before it rolls beneath the cart. Cold soaks through his trousers. He wraps it in the parcel cloth and steps aside to catch his breath.',
  return:'The clerk marks the borrowed cloth “return when dry.” Feofan accepts the deadline.'}
});
const emptyOverrides={
 pastry:['The table is available.','The Silver Saucer’s smallest table is empty. Feofan checks beneath it and asks the server about unusual guests. No blue tuft has disturbed the tea service today.'],
 alchemy:['Stock accounted for.','The shopkeeper checks her register while Feofan examines the shelves. Every reagent is in its case, and none of the customers has tried to pay in authoritative chirps.'],
 archives:['The papers stay put.','The restricted reports are filed, the ladder is parked, and the archivist on duty has seen no small assistants. Feofan checks the lower drawers himself before marking the room clear.'],
 operations:['Business as scheduled.','The dispatch schedule is unaltered. Feofan checks beneath the desks while the clerks confirm that no small, insistent visitor has attempted to reorganize them.'],
 service:['No shortcut today.','Every grille is fastened. Feofan checks the maintenance openings and speaks to the porter. There is no fugitive in these corridors; he leaves the research-wing route secured.'],
 reagents:['The seals are intact.','The specialist cabinet remains locked, the transport tray empty. Feofan checks the research-wing door, then the lower shelves. No assistant has made it here.'],
 plaza:['Ripples without a passenger.','Feofan checks the fountain and the sheltered spaces beneath its rim. Only a leaf circles the water. The Dottoling Dottomon is not here.']
};
export function encounterFor(s,location=s.location,target=remainingAt(s,location)[0]) {
  if(target)return replayEncounter(s,target,location,VARIANTS[target+':'+location]);
  if(assignedAt(s,location).length)return {title:'Already safely home.',lines:['The area remains secure. Everyone recovered here is safely at the penthouse. No one has escaped again.']};
  const override=emptyOverrides[location];
  return override?{title:override[0],lines:[override[1]]}:ENCOUNTERS[location];
}
export const RECOUNT=[
 'The receiver rings just as Feofan finishes sending the third city fugitive home. Lumine’s voice is steady, but she has clearly counted more than once.',
 ['Lumine','“Feo. You said we should have sixteen now.”'],['Feofan','“We should.”'],
 ['Lumine','“We have fifteen. The one in the cat costume is missing. Durin found little damp footprints beside the door. I think it followed you when you left.”'],
 'Feofan looks back across the city. The original escapees were not the entire problem. Somewhere behind him, one more assistant has been conducting its own afternoon.',
 ['Feofan','“Eight. Of course. The committee has recruited.”'],
 ['Lumine','“We’ve checked everyone else. Find that one, then go to the Palace. And Feo? Take a breath before you move.”'],
 'One additional recovery is added to the recall. Its destination is unknown. The fountain and courier forecourt need a fresh check, even if he passed them earlier. No time passes during the call.'
];
