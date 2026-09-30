# Version 0.51 verification

`npm test`: **60 passing tests**, zero failures.

Coverage includes every valid placement (72 assignments), every authored identity/location pairing (14), intact date pairing, hidden map occupancy, the recount and 7→8 objective, both Dottoling locations, stale courier search invalidation, city/Palace gating, Safe probability boundary, Risky guarantee, stress/smoking, sixth-critical Secret boundaries, all four endings and their precedence, hint costs/targets, Return Home, timeouts, replay, v0.3 archive migration, all four achievements, confirmed progress reset, and corrupt/blocked storage.

The UI integration test drives the real event handler and templates through all 72 assignments and all endings using a minimal DOM stand-in. It does not test browser layout. 300 adversarial runs also check state invariants and termination.

## v0.51 verification

The feature branch passes 60 tests. Six new tests cover bounded opening navigation, all 15 nonempty Palace-only breach subsets, specialist/lab adjacency and no-entry behavior, reachable flavor variations, public naming and achievement preservation, and private ending chapters. The real UI handler test also exercises Back/Next round trips, result rereading, free lab observation, and free reactions across all 72 assignments. The achievement boundary test now checks 04:59 versus 05:00. Existing saved reports contain identity IDs and numbers, so the hint caller rename does not invalidate collections.

All 3,000 seeded policy runs match the previous release exactly. The five-minute achievement threshold is the only balance change. Browser layout and live-interaction verification follow the regression gate on GitHub Pages because this environment blocks localhost previews.

## Reproducible balance probes

`node tests/playtest.mjs` uses 1,000 seeded runs per policy, without hints. It searches unvisited nodes in a random order using only player-visible search state, never hidden assignments. These are engine simulations, not human playtests or estimates of actual player behavior.

| Capture policy | Good | Secret | Bad 1 | Bad 2 | Mean time left in Good runs |
| --- | --- | --- | --- | --- | --- |
| Always Safe | 729 | 64 | 0 | 207 | 4:17 |
| One failed Safe, then Risky | 927 | 60 | 0 | 13 | 4:14 |
| Always Risky | 0 | 1,000 | 0 | 0 | — |

Perfect Safe captures on a known direct route with fountain Dottoling finish at 14:00. The revised Secret is intentionally reachable with six Risky captures, while five cigarettes plus a final Safe capture can still yield Good. The 20-minute timer is unchanged. Human feedback is still needed on whether searching is enjoyable and how often Secret feels accidental.

## v0.5 regression additions

Six new tests cover every replay variant without RNG draws or state mutation, pressure-note precedence, saved report reload/copy/reset, malformed report rejection and old discovery migration, early Return Home scene reconstruction, and session-only reports when storage is blocked. The existing UI route test now reads the Good archive through all 72 assignments, reads all four ending types after reload, verifies free clue review leaves the run unchanged, and tests Skip Opening at 20:00. `engine.js` changes only import cache versions; mission transitions are unchanged.

The three policy probes above were rerun on v0.5 and produced identical outcomes, action counts and remaining times to v0.4. No balance adjustment was made.

## v0.5 live browser verification

Verified the deployed v0.5 build on September 29, 2026, after PR #6 merged and Pages workflow #9 completed successfully. All 54 tests were rerun and passed.

- Completed a normal, unmodified-randomness run: Good Ending, 8/8 recovered, 00:20 remaining, 5 cigarettes, 2 hints. Read all three chapters and the report.
- Exercised Safe failure/success, shortened retry prose, stress-sensitive writing, Risky capture, automatic date partner recovery, smoking, promenade chemist, courier Dottoling, recount, Palace scatter, and Palace searches.
- Called Marina and Albedo, then reviewed Marina's earlier clue. Its original text and speaker returned; the clock remained 19:20 before and after review.
- Read all three saved Good Ending scenes, navigated backward, and checked the exact saved report and new coda. Undiscovered endings stayed locked. Reload preserved the entry. Skip Opening started at 20:00 and 0/7. Escape closed the reader.
- At 320px and 390px, checked title, map, encounters, call dialog, ending, and archive. Document/reader scroll widths equaled their client widths. The narrow reader scrolls vertically within its viewport. Maps also fit at 768px and 1280px; measured map buttons were at least 44px in both dimensions.
- Inspected original city scenery and Dottoling's visible costume/ears. The main public title also loads at desktop width with the v0.5 label. Captured logs contained browser-extension metadata errors, not game-origin errors.

All four saved readers, legacy discovery migration, blocked storage, and confirmed progress reset remain covered by automated tests. This live pass did not rediscover every ending or emulate physical Safari. The prior complete v0.4 live ending checks are retained below.

## v0.4 live browser baseline

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
