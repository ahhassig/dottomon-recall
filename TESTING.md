# Version 0.3 verification

`npm test`: **42 passing tests**, zero failures.

The suite preserves the v0.2 ending, timer, stress, permanent-capture, hint, decoy, and Palace progression checks. It adds exact 50% boundaries; automatic date-partner recovery with no second random call or stress; date timeout/unlock boundaries; hint summaries; validated archive persistence; replay versus gallery reset; corrupt/blocked storage handling; and UI event/template routes through every ending. It also runs 200 seeded adversarial mission simulations.

| Deterministic route | Result | Time remaining | Cigarettes |
| --- | --- | --- | --- |
| Six successful Safe captures plus voluntary partner; no detours | Good | 14:15 | 0 |
| Four Risky, two successful Safe, voluntary partner | Good | 10:15 | 4 |
| All Risky; last capture triggers existing Secret rule | Secret | 9:15 | 5 |

## Browser QA

The UI integration test uses a minimal DOM stand-in; it does not assert actual browser layout. Cloud Browser blocks localhost/file previews in this environment, so desktop/mobile rendering checks use the deployed GitHub Pages site after the regression gate.

Browser checks completed: desktop title and complete Secret route; date recovery (2/7, one cigarette, 18:00); Palace unlock/scatter/map; ending report; archive reveal, replay and reload persistence; Escape dismissal. Narrow city-map and archive checks at 320px, encounter/results at 390px, and map width at 768px had no horizontal overflow. No game-origin console errors were observed (browser-extension metadata errors are unrelated).

Accessibility follow-up: ending announcements now report final totals, and replay clears the previous announcement; covered in the UI regression test.

Automated UI/engine tests cover all four ending routes, capture rules, progression, hint use, timer/stress rules, report templates, archive persistence/reset, and replay. Browser layout checks are recorded separately above.

Reduced-motion CSS disables animations and transitions globally. Idle animations are finite and ending distress has no movement. A Chromium phone-width check is not a physical iPhone/Safari test.
