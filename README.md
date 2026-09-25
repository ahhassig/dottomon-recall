# DOTTOMON RECALL

Seven missing. Thirty minutes. One migraine.

**[Play DOTTOMON RECALL](https://ahhassig.github.io/dottomon-recall/)** — public, no account required.

A complete, dependency-free static narrative game for Lex’s Marina AU. Play as Feofan and recover seven escaped Dottomons in Snezhnograd and Zapolyarny Palace before they interrupt Zandik’s work. Designed for touch, phones, tablets, and desktop browsers.

## Run locally

Serve the project directory with any static HTTP server, for example:

```sh
python3 -m http.server 4173
```

Open `http://localhost:4173`. No build, install, backend, account, or API key is needed. ES modules require HTTP hosting rather than opening `index.html` as a local file.

## Publish on GitHub Pages

1. Put these files at the root of a public GitHub repository.
2. Open **Settings → Pages**.
3. Choose **Deploy from a branch**, branch **main**, folder **/(root)**, and save.
4. Wait for the Pages deployment to finish. GitHub supplies the public play URL.

The `.nojekyll` file keeps publication static. Every asset and module URL is relative, so the game works inside a repository subdirectory. There are no external fonts, remote images, third-party scripts, analytics, or runtime dependencies.

## Project structure

| File | Responsibility |
| --- | --- |
| `index.html` | Accessible application shell and metadata |
| `style.css` | Responsive northern-fantasy interface and provisional CSS silhouettes |
| `game.js` | Screens, maps, touch controls, dialogs, and rendering |
| `engine.js` | Pure game-state transitions, action costs, stress, and ending precedence |
| `data/locations.js` | Fixed locations, occupant identities, and timing constants |
| `data/dialogue.js` | Opening, encounters, capture flavor, and contextual hints |
| `data/endings.js` | All four endings, including the conditional laboratory cast |
| `assets/` | Reserved folders for later backgrounds, portraits, Dottomons, UI, and audio |
| `tests/engine.test.js` | Deterministic routes, boundary cases, and randomized state invariants |

## Test

With Node.js 18 or later:

```sh
node --test tests/*.test.js
```

`npm test` is equivalent; `npm install` is unnecessary. Tests use Node’s built-in runner and assertions. The game itself has no Node requirement.

## Prototype 0.1 rules

- Thirty action-based minutes. No real-time countdown, autosave, or background state updates.
- City travel: 30s, except the Promenade at 45s. Palace entry: 60s. Palace rooms: 30s.
- Empty-location searches add 30s. Returning to the hub map is free.
- Safe captures succeed 50% of the time. Success costs 15s. Failure costs 30s and adds 50% stress.
- Risky captures always succeed, cost 15s, and add 50% stress.
- The two pastry captures each succeed safely for 15s, with no stress or random roll.
- Each 100% stress event completes an automatic 60s smoking break, increments cigarettes, and resets stress to 0%.
- Each of the three hint-givers can be called once per run for 20s. Opening or reading a dialog is free.
- Found assistants permanently return to the penthouse. The Palace requires all three specific city assistants.
- All routes go through a hub. Returning to the map after an encounter is an explicit, free action. Revisited empty rooms still cost travel and a search; revisited secured rooms cost only travel and never release or recapture an assistant.
- Every action resolves atomically. At a time boundary, an action’s capture or Palace arrival is resolved before the ending check. Time clamps to zero.
- Returning home asks for confirmation and ends an incomplete run with Bad Ending 1, including from inside the Palace.
- Restart constructs a fresh state: no prior hints, counters, attempts, discoveries, or ending flags remain.

### Ending logic — spoilers

1. **Secret: Mutiny Cancelled.** The fifth completed smoking break arms the route. The next stress-producing event, or the seventh capture while armed, triggers the ending. There is never a sixth completed cigarette. A final capture that itself causes the fifth break also triggers the secret. The report preserves how many the player had recovered; all twenty are home after the escapees return voluntarily.
2. **Good: All Accounted For.** All seven recovered and no secret trigger.
3. **Bad 1: You Had One Job.** Confirmed early return home, or timeout before entering the Palace.
4. **Bad 2: They Found Him.** Timeout after Palace entry with assistants still missing. Only the uncaptured Palace assistants enter the laboratory.

After each meaningful action, precedence is **Secret → Good → timeout → continue**. A seventh capture on the final time boundary therefore succeeds; it is not replaced by a timeout ending. A fifth smoking break that expires the clock without either secret trigger still resolves to the appropriate timeout ending.

## Content and presentation

The game preserves the Dottomons as intelligent continuity patterns of cooperative Segments. They communicate through sounds, gestures, and behavior, never spoken human dialogue. Feofan’s anxiety and Zandik’s migraine are treated sincerely. The secret ending changes tone when Feofan becomes distressed.

All current visuals are lightweight original interface work and provisional shapes. There is no generated-art workload, borrowed Genshin UI, audio autoplay, inventory, movement minigame, or procedural generation.

This is an unofficial fan project set in Lex’s Marina AU, inspired by the world of Genshin Impact. It is not affiliated with or endorsed by the original game’s creators. Only game-specific writing and assets belong in this repository; private source lore documents are not part of the public site.
