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

Use `tests/responsive.html` for 320px, 390px, 768px and desktop widths. Release checks: title/tuft, both maps, recount transition, both Dottoling cues, updated counters, encounter/results, three-scene ending and report, achievements/archive, keyboard dialog dismissal and replay/reload persistence. Cloud Browser does not permit localhost/file previews here, so deployed-site layout checks follow the automated regression gate.

Reduced-motion CSS disables animations/transitions; distress scenes have no motion. Chromium phone-width checks are not a physical iPhone/Safari test.
