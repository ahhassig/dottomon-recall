# DOTTOMON RECALL · v0.4

Seven missing. Twenty minutes. One migraine.

**[Play DOTTOMON RECALL](https://ahhassig.github.io/dottomon-recall/)** — public, no account required.

A small static narrative game for Lex’s Marina AU. Feofan must recover Zandik’s escaped assistants while keeping his afternoon quiet. HTML, CSS, and vanilla JavaScript; no framework, build, backend, tracking, or required external service. All graphics are original code-native artwork, including the soft blue tufts and Dottoling’s cat costume. No official image assets are bundled.

## Version 0.4

- Each fugitive has two authored destinations. Runs sample one of 72 valid assignments; the date pair remain together and occupied rooms never conflict. Unexplored nodes reveal no occupancy.
- After the three original city fugitives are recovered, Marina’s free recount call reveals the unexpected Dottoling. The objective grows from seven to eight. Search the fountain or courier forecourt before entering the Palace. Both locations receive a fresh search state, including a previously cleared courier station.
- All 14 identity/location pairings have encounter, Safe success, Safe failure, Risky success, and return prose. Empty and secured visits have appropriate text.
- Hints follow actual placements, remaining identities, sightings and already supplied leads. Each person still gives one hint per run for 20s. Marina’s mandatory recount does not use a hint.
- Safe succeeds at 50%; failure costs 30s and adds 50% stress. Risky guarantees capture and immediately fills stress. Capture costs 15s. The second date guest follows automatically for another 15s, with no roll or stress.
- The first five critical-stress episodes each cost 60s, complete one cigarette, and reset stress. **The sixth critical episode triggers Secret before another cigarette is completed.** Five cigarettes, a half-full stress bar, or a final Safe capture alone do not trigger Secret.
- Four persistent achievements: Full Recall (four endings), Cold Plunge (failed fountain Safe capture), Ahead of Schedule (all eight with at least 10:00), No Outside Help (all eight without hints).
- v0.3 Ending Archive discoveries are preserved. Replay resets the run, including placements, but keeps both collections. Reset Progress clears endings and achievements only after confirmation. Unavailable storage falls back to page-session progress.
- The timer remains **20:00**, action-based. Maps, four three-scene endings, touch controls and reduced-motion support remain in place.

## Curated destinations — spoilers

| Fugitive | First destination | Second destination |
| --- | --- | --- |
| Date pair | Pastry Shop | Covered Market tea stall |
| Chemist | Alchemical Supply | Snowy Promenade |
| Archivist | Archives | Equipment Depot |
| Coordinator | Operations Wing | Guardroom |
| Runner | Service Corridors | Guardroom |
| Specialist | Reagent Storage | Equipment Depot |
| Dottoling | Plaza Fountain | Courier forecourt |

Coordinator/Runner cannot both take the Guardroom; Archivist/Specialist cannot both take the Depot. Sampling uses the complete valid assignment list, so no reroll loop can fail. Assignments stay fixed throughout a run.

## Structure

| File | Purpose |
| --- | --- |
| `engine.js` | Pure mission transitions; time, capture, stress, recount and ending precedence |
| `game.js`, `style.css`, `index.html` | Responsive UI, modals, reports, original CSS creatures |
| `data/locations.js` | Map geography and unchanged timing constants |
| `data/placements.js` | Curated pools, valid assignments and mission-count helpers |
| `data/encounters.js` | Identity/location variants, empty rooms, recount dialogue |
| `data/hints.js` | Actual-placement clues and lead selection |
| `data/dialogue.js`, `data/flavor.js`, `data/endings.js` | Existing opening, original encounters, capture flavor and endings |
| `data/visuals.js`, `data/characters.js` | Original inline scenery and speaker emblems |
| `progress.js` | Validated Ending Archive and achievement persistence |
| `tests/` | Engine, persistence and UI regression tests; browser viewport harness |
| `tests/playtest.mjs` | Reproducible randomized engine playthroughs |

## Run, test and publish

Serve the root with `python3 -m http.server 4173`. ES modules require HTTP. The game itself needs no Node.js installation.

With Node.js 18+, run `npm test` and `node tests/playtest.mjs`; no dependency installation is required. See `TESTING.md` for scope and measured results.

GitHub Pages serves `main` from the repository root with `.nojekyll`. Relative URLs support the repository subpath. Release query strings refresh browser caches.

## Rules and ending precedence

City travel: 30s, or 45s to the Promenade/Courier. Palace entry: 60s. Interior movement: 30s. Empty searches: +30s. The fountain is at the city hub (0s travel); a fruitless fountain search still costs 30s. Reading, map returns and recount dialogue are free. Recovered assistants never escape again.

Actions resolve atomically: **sixth critical episode → all eight recovered → timeout → continue**. Time clamps to zero. Timeout before Palace entry yields Bad 1; after entry it yields Bad 2 and only uncaptured Palace identities reach the laboratory. Return Home always requires confirmation and ends an unfinished run with Bad 1. Secret rescue brings everyone home voluntarily; the report preserves actual recoveries made during gameplay.

The browser stores only ending and achievement IDs under `dottomon-recall.endings.v1` and `dottomon-recall.achievements.v1`. No personal data, run history or login is collected.

Dottomons are intelligent preserved continuity structures, not pets. They communicate through sounds and behavior. Anxiety and migraine are treated sincerely. This unofficial fan game is not affiliated with the original game's creators.

## Next version

v0.5 is reserved for additional alternate writing, larger environment/ending illustrations, replay polish and optional audio. Any balance adjustments should follow real player feedback; the v0.4 timer has not been shortened.
