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

Release checklist: v0.3 label and 50% instructions; automatic date follow; 320px/390px/768px layouts; both node maps; capture feedback; modal fit and focus; three-scene ending navigation; report; archive discovery and replay/reload persistence; no horizontal overflow or game console errors.

Reduced-motion CSS disables animations and transitions globally. Idle animations are finite and ending distress has no movement. A Chromium phone-width check is not a physical iPhone/Safari test.
