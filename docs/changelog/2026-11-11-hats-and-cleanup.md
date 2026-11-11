# Hats and cleanup (2026-11-11)

## Summary

The bee can now wear hats, bought in a new Wardrobe. Several upgrades and bonuses that never
actually worked now do. Under the hood, the code got type checking, unit tests, and a cleanup that
lets every module load without a browser.

## What changed for players

- **Hats.** A new Wardrobe screen has 44 hats in three price tiers, bought with honeycomb. Only one
  is worn at a time, and they're kept through prestige.
- **Party hats.** During a Sammy party, some birds and Sammys show up wearing random hats.
- **Health bars** move up so they don't cover a worn hat.
- **Level-end bonuses** (no damage, no survivors, perfect) now pay out honeycomb.
- **Upgrades that now work:**
  - Sammy upgrades now affect gameplay.
  - Sammy Speed now makes Sammy faster instead of slower.
  - Exploding birds now work.
- **Critical hits:** a bug made every shot deal 1.1× damage. Now only real critical hits do.
- **Level summary** says "Level Failed" when the bee dies, instead of always "Level Completed".

## Under the hood

- Player attributes are rebuilt from shop purchases instead of being saved. Saves are now version 2,
  and older saves still load.
- `checkJs` type checking is on, with zero errors in `src/`.
- Unit tests use Node's built-in test runner. `check.bat` (or `node tools/check.mjs`) runs the type check
  and the tests, and a GitHub workflow runs the same script on every push.
- `levels.js` is split into the level runtime, `level-definition.js`, `formations.js` and
  `level-list.js`.
- Modules no longer touch the page or load the save when they're imported. That work now happens
  in `initLogging()` and `initPlayer()`, and `MENUS` moved to `menu-registry.js` to break an import cycle.
- Dev tools: a Hat Tuning view and a Bee Damage toggle, under Settings > Debug on localhost.
- Upgraded LittleJS from 1.12.13 to 1.29.1:
  - `wave` → `oscillate`
  - `drawTextOverlay` → `drawText`
  - `showWatermark` → `setDebugWatermark`
  - textures are passed as `textureInfos[i]`
  - achievements opt out of the engine's own medal save
  - the touch gamepad uses its new default size
  - players now get the minified release build (159 KB compressed); localhost keeps the debug build
- Added `CLAUDE.md` with repo instructions for agents.

## Decisions

- Breaking save compatibility was allowed for this round, but in the end it wasn't needed.
- The Time Trial diminishing-returns penalty is intended.
- Hats are forever purchases.
- Tests run on Node with no `package.json`. The GitHub check is report-only and doesn't block deploys.
- The on-screen log panel stays, because it's needed to debug on phones (iOS/mobile Safari).
- `touchGamepadSize` is now in screen pixels, so the old override of 200 was dropped. The engine
  default of 100 is about the old on-screen size.

## Follow-ups

Hat placement tuning, price playtesting, and the party hat chances are in [roadmap.md](../roadmap.md).
Touch controls on a real phone still need checking after the LittleJS upgrade.
