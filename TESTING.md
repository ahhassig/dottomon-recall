# Version 0.4 verification

`npm test`: **48 passing tests**, zero failures.

Coverage includes every valid placement (72 assignments), every authored identity/location pairing (14), intact date pairing, hidden map occupancy, the recount and 7→8 objective, both Dottoling locations, stale courier search invalidation, city/Palace gating, Safe probability boundary, Risky guarantee, stress/smoking, sixth-critical Secret boundaries, all four endings and their precedence, hint costs/targets, Return Home, timeouts, replay, v0.3 archive migration, all four achievements, confirmed progress reset, and corrupt/blocked storage.

The UI integration test drives the real event handler and templates through all 72 assignments and all endings using a minimal DOM stand-in. It does not test browser layout. 300 adversarial runs also check state invariants and termination.

## Reproducible balance probes

`node tests/playtest.mjs` uses 1,000 seeded runs per policy, without hints. It searches unvisited nodes in a random order using only player-visible search state, never hidden assignments. These are engine simulations, not human playtests or estimates of actual player behavior.

| Capture policy | Good | Secret | Bad 1 | Bad 2 | Mean time left in Good runs |
| --- | --- | --- | --- | --- | --- |
| Always Safe | 729 | 64 | 0 | 207 | 4:17 |
| One failed Safe, then Risky | 927 | 60 | 0 | 13 | 4:14 |
| Always Risky | 0 | 1,000 | 0 | 0 | — |

Perfect Safe captures on a known direct route with fountain Dottoling finish at 14:00. The revised Secret is intentionally reachable with six Risky captures, while five cigarettes plus a final Safe capture can still yield Good. The 20-minute timer is unchanged. Human feedback is still needed on whether searching is enjoyable and how often Secret feels accidental.

## Browser QA

Verified on the public GitHub Pages build on September 28, 2026, using normal UI controls and unmodified random outcomes:

- Good: all 8 recovered, 03:10 remaining, 4 cigarettes, 1 hint. Checked all three ending chapters and report.
- Secret: 7/8 recovered, 04:15 remaining, exactly 5 cigarettes after the sixth Risky capture. Checked the eight-assistant rescue tableau at 320px and final report.
- Bad 1: Return Home confirmation at 20:00 and 0/7, then all chapters/report.
- Bad 2: action-clock timeout in the Palace at 00:00, 4/8 recovered, all four uncaptured Palace assistants present. Full Recall unlocked when this fourth ending was discovered.
- Both date venues, automatic partner recovery, alternate promenade chemist, courier Dottoling, recount, 7-to-8 counter, Palace gate/scatter, Safe successes/failures, Risky capture, and smoking costs were exercised live.
- All three hint callers returned placement-appropriate clues. Good ending persisted after Play Again and page reload; replay started at 20:00. Locked archive cards remained hidden. Escape dismissed a dialog correctly.
- `tests/responsive.html` exercised 320px and 390px phone layouts, plus 768px and 1280px ending layouts. Measured document width equaled scroll width in title, map, result, recount, encounter, and ending checks. The 320px map's buttons were at least 44px in both dimensions. Achievement dialogs scroll within the viewport.
- Visual QA caught an inherited prop size that made Dottoling's cat ears too small. The costume overlay now fills the creature and clears the generic prop transform/shadow; the stylesheet URL is refreshed for existing players.

Both fountain outcomes, achievement thresholds, reset confirmation/clearing, and unavailable storage are covered by automated tests. Browser runs above happened to place Dottoling at the courier station; they do not claim a live fountain-failure test. Cloud Browser does not permit localhost/file previews here, so deployed-site layout checks followed the automated regression gate.

Reduced-motion CSS disables animations/transitions; distress scenes have no motion. Chromium phone-width checks are not a physical iPhone/Safari test.
