// A visual floor plan, not a travel-cost graph. Every room remains directly selectable.
export const PALACE_POSITIONS={
 laboratory:[50,12,50,12],depot:[22,32,25,31],reagents:[78,32,75,31],
 archives:[22,61,25,59],operations:[78,61,75,59],service:[22,85,25,84],guardroom:[78,85,75,84],lobby:[50,49,50,47]
};
export const PALACE_LINKS=[['laboratory','depot'],['laboratory','reagents'],['depot','archives'],['reagents','operations'],['archives','service'],['operations','guardroom'],['archives','lobby'],['operations','lobby']];
export const LAB_OBSERVATION=[
 'Through the narrow window, Zandik is visible beneath a shaded lamp. He makes a careful note, checks the reaction vessel, and rests his fingers against his brow. The work still needs his attention.',
 'Feofan stays on this side of the door. The equipment depot and reagent store each open onto a short passage beside the laboratory. He checks both approaches without disturbing the man inside.',
 ['Feofan','“A little longer. I’m handling it.”'],
 'He says it too softly to carry through the glass. There is no reason to make Zandik look up. Only the four Palace fugitives are seeking entry here; every assistant already recovered stays safely at home.'
];
