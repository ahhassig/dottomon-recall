# Prototype 0.1 verification

## Completed

`node --test tests/*.test.js`: **26 tests passed**, zero failures.

Coverage includes complete safe and risky routes; both Secret Ending triggers; fifth-break and final-capture interactions; timer precedence; all four timeout cast sizes; one-time contextual hints; repeat/invalid-action guards; empty-location costs; Palace identity locks; permanent captures; early return; reset; and 200 randomized mission simulations with invariant checks after each action.

JavaScript syntax checks pass for the application, engine, and narrative files.

## Still required before declaring Prototype 1 finished

- Create the remote GitHub repository and enable Pages.
- Verify the deployed module and asset paths from the public URL.
- Run a complete browser playthrough with the visible controls.
- Inspect title, maps, encounters, dialogs, and endings at phone and desktop widths.
- Check for clipping, readable labels, keyboard focus, and touch-sized controls.
- Confirm every visible button, including both Return Home confirmation choices.

These browser checks have not been claimed as complete. The available preview browser blocks the local HTTP host and local-file navigation. Public deployment is pending GitHub browser sign-in; the connected GitHub tool can edit repository files but cannot create repositories or configure Pages.

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
