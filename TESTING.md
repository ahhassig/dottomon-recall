# Version 0.2 verification

`node --test tests/*.test.js`: **30 passing tests**, zero failures.

Coverage includes every ending, both Secret triggers, 33% boundaries, both pastry approaches, risky capture from 0% and 50% stress, the five-cigarette limit, exact timing, both new decoys, permanent recovery, Palace identity locks, all Bad 2 cast sizes, one-time hints, early return, complete resets, three-scene ending data, five distinct speaker emblems, and 200 randomized mission simulations.

Deterministic reference runs:

| Route | Result | Time remaining | Cigarettes |
| --- | --- | --- | --- |
| Seven successful Safe captures; no detours | Good | 14:15 | 0 |
| Four Risky captures, three successful Safe captures | Good | 10:15 | 4 |
| All Risky; sixth capture triggers overload | Secret | 10:00 | 5 |

## Browser verification

Version 0.1 was checked through a complete phone-width Good Ending playthrough, all decoys, all hints, automatic smoking, Return Home confirmation, Bad Ending 1, and replay. Desktop and phone screens were inspected, with no game runtime errors.

For v0.2, check the new version label, 20:00 clock, both added nodes, pastry failure/risky results, all five speaker icons, three-scene ending navigation, summary, and reset on the deployed URL. `tests/responsive.html` provides narrow embedded viewports without changing the game rules. Engine tests cover controlled random outcomes; the public game has no cheats or deterministic random overrides.

A desktop Chromium phone-width check is not a physical iPhone/Safari test.
