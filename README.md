# BeeFree

<div align="center">

## [Play Game](https://cmprog.github.io/BeeFree2/)

</div>

Just a little game I made forever ago. I'm revamping it because my daughter enjoys playing it.

### Development

- `run_local.bat` serves the game at http://localhost:8080 (needs Python).
- `check.bat` runs the type check and the unit tests (needs [Node.js](https://nodejs.org) 22+).

### Planned Changes

- Remove unused gamepd buttons
- ~~Prestige mechanics~~
- ~~Sammy powerups~~
- ~~Reduced honeycomb collection on death~~
- Reflection chance attribute
- ~~Bonus honeycomb on success criteria~~
- Double shot chance attrbute
- ~~Cosmetic purchaces - do not reset on pretige~~ (hats, in the Wardrobe)
- Passkve honeycomb earnings. Buy a bee hive and collect from it every day. Adds potential options for duration and amount. 
- challenge mode prestige?
- Extra life shop purchase?
- Shielding attribute
    - Maximum damage reduction - Shield acts as damage reduction
    - Maximum shield amount - Shield has only so much life before it no longer works.
- ~~Distance calculation is not working.~~
- Levels 7, 8, and 9 might have hidden birds
- ~~Touching Sammy adds to max health making current health percentage drop~~
- Enough stingers cause the stingers to go in a vertical line instead of an arc
- ~~Sammy time possibly slowing stingers?~~
- Sound effects. `src/sounds.js` has a start on this but isn't imported yet, and `gameInit` turns sound off (`soundEnable = false`).

### Code Cleanup

- Upgrade LittleJS (`dist/littlejs.js`, currently 1.12.13). Replace the file, then fix anything `check.bat` or a play-through turns up.
- Split `src/birds.js`: move the bird templates (`BIRD_TEMPLATES`) into their own file, the way `level-list.js` holds the levels.
- `BIRD_TEMPLATES`, `FORMATIONS`, `LEVELS` and `spriteAtlas` are only filled in by `init*()` calls at startup. Now that LittleJS loads before any module, some could probably become plain constants built when their module loads (check whether they need loaded images first).
- Misspelled names stored in saves (`noDamangeCount`, `overallTimeTrailStatistics`, the `SOMETHING` shop key, `achivement`). These can be renamed by converting old saves on load, using `saveVersion`. Purely cosmetic, so it's low priority.
- Achievements are saved on the player, but the LittleJS `Medal` objects they're built on are global. Leave this until something needs it.

