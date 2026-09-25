# Prototype 0.1 verification

## Completed

`node --test tests/*.test.js`: **26 tests passed**, zero failures.

Coverage includes complete safe and risky routes; both Secret Ending triggers; fifth-break and final-capture interactions; timer precedence; all four timeout cast sizes; one-time contextual hints; repeat/invalid-action guards; empty-location costs; Palace identity locks; permanent captures; early return; reset; and 200 randomized mission simulations with invariant checks after each action.

JavaScript syntax checks pass for the application, engine, and narrative files.

## Live browser verification

Published with GitHub Pages from `main` at https://ahhassig.github.io/dottomon-recall/.

Completed a full live playthrough through both city decoys, both pastry captures, all three one-time calls, Palace unlock, the lobby scatter, every Palace room, two automatic smoking breaks, and the Good Ending. The final report correctly showed **18:00, 7/7, 2 cigarettes** after visiting every decoy and using all three hints.

Also verified the instructions, free hub notes, both Return Home confirmation choices, Bad Ending 1, and replay. Reading and opening menus left mission time unchanged. Location markers changed to CLEARED or SECURED as appropriate, and captured assistants stayed home.

Inspected the desktop title/map and phone title, maps, encounter, and dialog layouts using `tests/responsive.html`. The preview page is a development aid, separate from the game. Checks use desktop Chromium with a narrow embedded viewport; a physical iPhone/Safari check remains useful for platform-specific behavior.

Both Secret Ending triggers, Bad Ending 2 with every possible remaining cast, and time-boundary precedence are verified deterministically by the engine suite. Secret-route randomness is not overridden in the shipped interface.

## Browser playtest routes

1. Begin; advance all three opening screens. Confirm 30:00 remains unchanged.
2. Read How to Play, open the Plaza note, and cancel Return Home. Confirm no time charge.
3. Visit both city decoys. Confirm CLEARED status and correct travel/search charges.
4. Visit the Pastry Shop; recover each date separately. Confirm 1/7 then 2/7, with 0 stress.
5. Call each person once; confirm the 20s charge and NO NEW IDEAS state.
6. Recover the alchemical-shop assistant; confirm the Palace unlock banner.
7. Enter the Palace; view the three-way scatter, the five room nodes, and the clear Lobby note.
8. Recover the four Palace assistants with guaranteed captures; confirm the automatic smoking reports and Good Ending.
9. Replay, confirm every flag and count resets, then confirm Return Home to reach Bad Ending 1.
10. Exhaust time through revisits inside the Palace to verify Bad Ending 2 through the interface. Its cast must match only the remaining assistants.

Secret-route randomness is covered deterministically by the pure-state tests. No testing controls, seeded randomness, or debug cheats are included in the shipped player interface.
