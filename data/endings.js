export const ENDINGS = {
  good:{label:'GOOD ENDING',title:'All accounted for',mark:'VII',color:'good',tagline:['Twenty assistants.','Twenty present.','There is absolutely nothing else Zandik needs to know.'],lines:()=>[
    'The last Dottomon reaches the penthouse before Zandik finishes his work. Twenty small black bodies settle into an arrangement so orderly that it immediately looks rehearsed.',
    'Marina takes the last pastry box from the table. Albedo turns a suspicious diagram face down. Durin sits beside the door with a small, satisfied smile.',
    ['Feofan','“An entirely uneventful afternoon.”'],
    ['Marina','“Oh, incredibly.”'],
    'When Zandik comes home, his migraine is easing. He sets his things down quietly and looks over the room. No one rushes him. No one offers a catalyst. All twenty assistants are present.',
    ['Zandik','“You’re all being unusually agreeable.”'],
    'A restrained chorus of trills answers him. One Dottomon puts a possessive arm around a second Dottomon’s pastry box.',
    'Feofan takes his husband’s coat, checks that the curtains are where he likes them, and kisses his temple.',
    ['Feofan','“We aim to please.”'],
    'Zandik gives him a long, mildly suspicious look. Then he sits down beside him. Whatever the room is declining to discuss, it has left him an uninterrupted project, a quiet home, and twenty assistants who are exactly where they should be.'
  ]},
  secret:{label:'SECRET ENDING',title:'Mutiny cancelled',mark:'XX',color:'secret',tagline:['They wanted to help Zandik.','They loved Feofan more.'],lines:()=>[
    'Feofan reaches for his lighter. His fingers won’t hold it steadily enough. He tries again, but his hands are shaking too badly, and his breathing has become fast and shallow. He cannot seem to get enough air.',
    'The little sounds around him stop.',
    'He tries to steady himself. His knees give way. Then he loses consciousness.',
    'There is no argument now. No evasive chirp, no hidden reagent, no better plan for Zandik’s work. The seven escapees abandon the search for their own objectives at once.',
    'All seven work together. Between one moment and the next, the enormous man in the dark coat is being brought safely home by seven intensely determined black puffballs. None of them leaves him.',
    'At the penthouse, Marina opens the door. Her expression changes immediately. Albedo is already clearing space; Durin stays close as they take over Feofan’s care. The original thirteen remain contained. The seven fugitives settle beside him voluntarily.',
    'Twenty assistants. No one tries the door.',
    'Later, when Zandik returns with his migraine improved, Feofan is awake and resting. Zandik crosses the room, sits beside him, and takes his unsteady hand. He checks him carefully before saying anything about the search.',
    ['Feofan','“They’re all here.”'],
    ['Zandik','“I can see that. Stay with me a moment.”'],
    'Feofan tries to explain. Zandik draws him closer instead, one hand resting at the back of his neck. Marina sits within reach; Albedo keeps the room quiet. Durin settles a blanket over Feofan’s legs.',
    ['Zandik','“You don’t need to finish anything else today.”'],
    'A Dottomon rests a tiny arm against Feofan’s sleeve. The others press close. The rebellion is over. There is someone they love who needs them to stay.'
  ]},
  home:{label:'BAD ENDING',title:'You had one job',mark:'I',color:'home',tagline:['Zandik is feeling better.','Unfortunately, so is his ability to judge you.'],lines:s=>[
    'Feofan returns to the penthouse before the search is complete. Marina looks from his face to the door behind him. No additional puffball follows.',
    ['Marina','“That’s everyone you found?”'],
    ['Feofan',`“${s.recovered} of the seven.”`],
    'Albedo checks the count. Durin makes room for Feofan to sit. The assistants already at home remain safely there; the unfinished part of the problem is still elsewhere.',
    'When Zandik eventually returns, his migraine has improved. He listens to the account, then glances across the room and counts for himself.',
    ['Zandik','“I asked you to keep twenty assistants at home.”'],
    ['Feofan','“Yes. In retrospect, an ambitious assignment.”'],
    'Zandik’s expression suggests that he does not consider this a persuasive defense.',
    ['Zandik','“Stay here. I’ll collect the rest.”'],
    'Now that he feels better, he retrieves the remaining fugitives himself and takes them back to his laboratory. His instructions to them are concise. His look at Feofan on the way out is considerably more eloquent.',
    'Marina waits until the door closes before silently offering Feofan the remaining pastry.'
  ]},
  breach:{label:'BAD ENDING',title:'They found him',mark:'II',color:'breach',tagline:['The assistants have arrived.','Zandik did not request assistance.'],lines:s=>{
    const items={archivist:'The archivist brings the relevant reports, carefully stacked.',coordinator:'The coordinator arrives with a revised requisition schedule.',runner:'The corridor runner slips through with the confident air of someone who has improved the route.',specialist:'The specialist carries a tray of selected materials.'};
    const remaining=s.endingSummary.uncapturedPalace;
    const many=remaining.length>1;
    return [
      'The last of the allotted time runs out inside Zapolyarny Palace.',
      `The ${remaining.length===1?'one remaining assistant':`${remaining.length} remaining assistants`} ${many?'converge':'makes its way'} on the laboratory. Everyone Feofan already captured stays safely at the penthouse. Only the uncaught ${many?'fugitives are':'fugitive is'} here.`,
      'Inside, Zandik has kept the lamps low. His migraine has not improved. One hand rests against his brow while he studies the work he has been trying to finish.',
      'The door opens.',
      ...remaining.map(id=>items[id]),
      `${many?'They stop':'It stops'} beside the worktable. A small, eager trill breaks the carefully maintained quiet.`,
      'Zandik slowly looks up.',
      'For a moment, no one moves. His gaze goes from the open door to the offering in front of him.',
      ['Zandik','“I asked for no assistants.”'],
      `The ${many?'Dottomons look':'Dottomon looks'} at the work, then back at him. The help has arrived with absolute confidence. It is precisely the interruption he asked Feofan to prevent.`
    ];
  }}
};
