# DOTTOMON RECALL · v0.2

Seven missing. Twenty minutes. One migraine.

**[Play DOTTOMON RECALL](https://ahhassig.github.io/dottomon-recall/)** — public, no account required.

A lightweight static narrative game for Lex’s Marina AU. Play as Feofan and recover seven escaped Dottomons before they interrupt Zandik’s work. HTML, CSS, and vanilla JavaScript; no build, backend, dependencies, accounts, tracking, or external art.

## Version 0.2

- Twenty action-based minutes; reading and menus are always free.
- Safe Capture succeeds exactly 33% of the time at every occupied location, including both pastry dates. Success costs 15s; failure costs 30s and adds 50% stress.
- Risky Capture guarantees recovery and immediately fills the stress bar, triggering one automatic smoking break: 15s capture + 60s break = 75s. This produces one cigarette even when starting at 50% stress.
- The date pair remain two separate recoveries, each with Safe and Risky choices.
- New empty locations: Courier Station in Snezhnograd and Palace Guardroom. Seven fugitives remain in their original fixed locations.
- Five original character emblems accompany Feofan, Marina, Albedo, Durin, and Zandik’s dialogue and calls.
- Every ending unfolds across three scenes, then shows its distinct ending card and run summary. All reading remains untimed.

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
| `assets/ui/` | Site emblem; future assets can be added under `assets/` |
| `tests/engine.test.js` | Deterministic routes, boundaries, and randomized state checks |
| `tests/responsive.html` | Developer-only embedded viewport for layout checks |

## Run and test

Serve the folder with `python3 -m http.server 4173`, then open `http://localhost:4173`. ES modules require HTTP hosting. The game itself needs no Node.js installation.

Run `node --test tests/*.test.js` with Node.js 18+ (or `npm test`). No package installation is needed.

GitHub Pages deploys `main` from the repository root. All module/asset URLs are relative; release query strings keep browser caches from mixing interface versions.

## Remaining rules

City travel is 30s, with 45s routes to the Promenade and Courier Station. Palace entry costs 60s; interior room movement costs 30s. Empty searches add 30s. Returning to the map is free. Revisits still cost travel/search time; captured assistants never escape again.

The Palace unlocks only after all three specific city assistants are recovered. The lobby scatter leads to six searchable rooms: four occupied and two empty. Maps conceal unexplored occupancy. Visited empty nodes become CLEARED and fully resolved occupied nodes become SECURED.

Marina, Albedo, and Durin each supply one contextual hint per run for 20s. Used contacts show NO NEW IDEAS. Return Home requires confirmation and ends an incomplete search with Bad Ending 1. Play Again clears every field and the ending-scene position.

## Endings — spoilers

Five completed smoking breaks arm the Secret Ending. The next stress-producing event, or the seventh capture while armed, triggers it. A final capture that itself causes break five also triggers Secret. There is never a sixth completed cigarette. All seven escapees voluntarily stay home afterward; the report preserves the player's actual recovery count.

Seven recoveries without a Secret trigger yield Good. Timeout before Palace entry yields Bad 1; timeout after entry yields Bad 2, featuring only the remaining uncaptured Palace assistants. A confirmed early return yields Bad 1 even inside the Palace.

Each action resolves atomically, including capture, arrival, and any automatic break. Ending precedence is **Secret → Good → timeout → continue**. Time clamps to zero. A last capture on the time boundary therefore wins over timeout. Merely arming Secret at timeout does not trigger it.

Dottomons are intelligent continuity patterns of Zandik’s former cooperative Segments, not pets. They communicate through sounds and behavior. Migraine and anxiety are treated sincerely. This unofficial fan game is not affiliated with the original game's creators. Private source lore documents are not included in this repository.
