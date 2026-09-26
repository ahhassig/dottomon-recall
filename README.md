# DOTTOMON RECALL · v0.3

Seven missing. Twenty minutes. One migraine.

**[Play DOTTOMON RECALL](https://ahhassig.github.io/dottomon-recall/)** — public, no account required.

A lightweight static narrative game for Lex’s Marina AU. Play as Feofan and recover seven escaped Dottomons before they interrupt Zandik’s work. HTML, CSS, and vanilla JavaScript; no build, backend, dependencies, accounts, tracking, or external art.

## Version 0.3

- Safe Capture now succeeds at **50%**. Failure still costs 30s and adds 50% stress; Risky still guarantees capture and immediately invokes the existing critical-stress rules.
- The first pastry date uses normal capture rules. Its partner follows automatically: no second roll or stress, with a 15s recovery cost. The pair costs 30s on Safe success or 90s on an ordinary Risky capture, including its smoking break.
- Original inline vector environments, subtle fugitive props, clearer dialogue cards, frosted UI, and distinct ending tableaux. No image requests, official game assets, fonts, or external services are required. CSS backgrounds remain usable without the decorative SVG layer.
- Location-specific failure/risky feedback, smoking-break variants, return flavor, and a tender voluntary date-partner scene.
- The existing three-scene endings have stronger visual and written payoffs; summaries now include hints used and the ending obtained.
- **Ending Archive** on the title and report screens. Discovered endings persist through replay and browser reload via localStorage. Resetting the archive requires confirmation and never changes the current run. Blocked storage falls back to session-only progress with a clear notice.
- Short, finite assistant animations and transition feedback; reduced-motion preferences disable motion. No animated distress in the Secret Ending.
- Twenty action-based minutes, seven fixed fugitives, existing maps and one-use hints remain unchanged. Reading, menus, and returning to the map stay free.

## Structure

| File | Purpose |
| --- | --- |
| `index.html`, `style.css` | Accessible responsive shell and original fantasy interface |
| `game.js` | Maps, encounters, dialogs, ending scenes, and touch controls |
| `engine.js` | Pure state transitions, time, stress, captures, and ending priority |
| `data/locations.js` | Fixed locations and balance constants |
| `data/dialogue.js` | Opening, encounters, failures, and contextual hints |
| `data/endings.js` | Ending scenes and conditional laboratory cast |
| `data/characters.js` | Lightweight original speaker emblems |
| `data/visuals.js`, `data/flavor.js` | Original vector scenery, fugitive cues, and capture narration |
| `progress.js` | Validated, resilient browser Ending Archive storage |
| `assets/ui/` | Site emblem; future assets can be added under `assets/` |
| `tests/*.test.js` | Engine routes, boundaries, randomized state checks, archive storage, and UI event/template integration |
| `tests/responsive.html` | Developer-only embedded viewport for layout checks |

## Run and test

Serve the folder with `python3 -m http.server 4173`, then open `http://localhost:4173`. ES modules require HTTP hosting. The game itself needs no Node.js installation.

Run `node --test tests/*.test.js` with Node.js 18+ (or `npm test`). No package installation is needed.

GitHub Pages deploys `main` from the repository root. All module/asset URLs are relative; release query strings keep browser caches from mixing interface versions.

## Remaining rules

City travel is 30s, with 45s routes to the Promenade and Courier Station. Palace entry costs 60s; interior room movement costs 30s. Empty searches add 30s. Returning to the map is free. Revisits still cost travel/search time; captured assistants never escape again.

The Palace unlocks only after all three specific city assistants are recovered. The lobby scatter leads to six searchable rooms: four occupied and two empty. Maps conceal unexplored occupancy. Visited empty nodes become CLEARED and fully resolved occupied nodes become SECURED.

Marina, Albedo, and Durin each supply one contextual hint per run for 20s. Used contacts show NO NEW IDEAS. Return Home requires confirmation and ends an incomplete search with Bad Ending 1. Play Again clears every mission field and the ending-scene position, while preserving the Ending Archive. Browser storage uses `dottomon-recall.endings.v1`; no personal data or run history is stored.

## Endings — spoilers

Five completed smoking breaks arm the Secret Ending. The next stress-producing event, or the seventh capture while armed, triggers it. A final capture that itself causes break five also triggers Secret. There is never a sixth completed cigarette. All seven escapees voluntarily stay home afterward; the report preserves the player's actual recovery count.

Seven recoveries without a Secret trigger yield Good. Timeout before Palace entry yields Bad 1; timeout after entry yields Bad 2, featuring only the remaining uncaptured Palace assistants. A confirmed early return yields Bad 1 even inside the Palace.

Each action resolves atomically, including capture, arrival, and any automatic break. Ending precedence is **Secret → Good → timeout → continue**. Time clamps to zero. A last capture on the time boundary therefore wins over timeout. Merely arming Secret at timeout does not trigger it.

Dottomons are intelligent continuity patterns of Zandik’s former cooperative Segments, not pets. They communicate through sounds and behavior. Migraine and anxiety are treated sincerely. This unofficial fan game is not affiliated with the original game's creators. Private source lore documents are not included in this repository.

## Deliberately deferred

v0.4: curated randomized placements, placement-aware hints, the surprise Dottoling, four achievements, and the revised sixth-critical-episode Secret rule. v0.5: alternate writing, the full environment/ending illustration pass, optional audio, and final replay/balance polish. The v0.3 Secret trigger is intentionally unchanged.
