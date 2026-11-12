# BeeFree

A browser shoot-'em-up with incremental/idle progression (shop upgrades, prestige, achievements),
built on the [LittleJS](https://github.com/KilledByAPixel/LittleJS) engine. Originally written in 2013,
revamped because the author's daughter plays it. Deployed to GitHub Pages from the `main` branch.

## Running

- No build step and no package manager. Plain ES modules served statically.
- `run_local.bat` starts `python -m http.server 8080` and opens `http://localhost:8080`.
- Running on `localhost` enables dev-only behavior: the on-screen log panel, the LittleJS watermark,
  and the Debug section of the Settings menu (unlock all levels, hat tuning, bird preview, turn bee damage off, grant honeycomb). See
  `GAME_SETTINGS.IS_LOCAL_DEV_ENVIRONMENT` in `src/settings.js`.
- The on-screen log panel exists to see output on devices without dev tools (it was built to debug
  iOS/mobile Safari touch issues). Keep it working. `initLogging()` (called first thing in `game.js`)
  mirrors all console output into it. Messages logged before that are held and shown afterwards.
- **Importing a module only declares things.** A module's top level may declare:
  - classes and functions;
  - fixed data built only from its own file and `settings.js`: numbers, frozen enums, the
    default attribute sets, `SHOP_ITEMS`, `HATS`.
- Everything else is created by an `init*()` function: runtime state (`currentPlayer`, `MENUS`), anything
  that uses the engine, the page or `localStorage` (achievements, sounds, dev hat tuning, logging),
  and game content built from other modules' classes (`BIRD_TEMPLATES`, `FORMATIONS`, `LEVELS`,
  `spriteAtlas`). Such globals are `export let`, set by their init function.
- `game.js` calls every init function in one ordered, commented list: a few before the engine
  starts, and the rest in `gameInit()` once images are loaded. Add new ones there, in dependency
  order.
- `tests/module-loading.test.js` enforces this. It fails if importing a module uses `localStorage`,
  registers medals or creates engine objects.

## Checks and tests

- `check.bat` (or `node tools/check.mjs` on any OS) runs the type check, then the unit tests.
  `node tools/check.mjs tests` or `node tools/check.mjs types` runs only one of them. It needs Node.js 22+,
  and internet the first time, to download the pinned TypeScript through `npx`. There's no `package.json`;
  keep it that way.
- The GitHub workflow (`.github/workflows/check.yml`) runs the same `node tools/check.mjs` on every push and
  pull request. It's report only and doesn't block GitHub Pages deploys.
- Type check: `jsconfig.json` enables `checkJs`, so VS Code also type-checks the JS using the JSDoc.
  Errors inside `dist/littlejs.js` are the engine's own JSDoc problems and are filtered out. Keep `src/`
  at zero errors.
- Unit tests use Node's built-in test runner (`node:test`, `node:assert/strict`) and live in
  `tests/*.test.js`. Every test file must start with `import './setup.js';`. The setup file fakes
  `document`, `localStorage` and audio, and loads LittleJS so its globals exist. Use `resetLocalStorage()` from `setup.js` to clear saves between tests.
  Each test file runs in its own process.
- `tests/module-loading.test.js` loads every `src/` module on its own in a fresh process. If it fails,
  an import cycle is making a class load before the class it extends. Break the cycle (for example
  with a small module that has no imports, like `menus/registry.js`) rather than relying on load order.
- Tests cover game logic, not visuals: shop math, attribute derivation, saves, prestige, hats,
  statistics, spawning. Drawing, menus and game feel are still verified by playing in the browser.
- **Agents:** when you change or add game logic, add or update tests for it, using the same
  mechanisms as a human developer (`node:test`, `tests/setup.js`). Run `node tools/check.mjs` and
  make sure it passes before committing. For a bug fix, prefer a test that fails without the fix.
  Visual or UI changes still need a check in the browser.

## Architecture

- `dist/` holds vendored, unmodified LittleJS builds (currently 1.29.1), from the `littlejsengine`
  npm package's `dist/` folder:
  - `littlejs.js` is the debug build. It's used on localhost, by the type check, and by the tests.
  - `littlejs.min.js` is the minified release build, served to players.
  The inline loader at the bottom of `index.html` picks the build, then loads `src/game.js` once the
  engine is ready. The engine is a classic script, so its APIs (`vec2`, `EngineObject`, `Timer`,
  `drawTile`, `time`, ...) are **globals**, not imports. Don't edit these files. To upgrade:
  - Replace both files.
  - Check the live site with the release build as well; it strips debug-only code.
  - Run `check.bat`. The type check flags renamed or removed APIs.
  - Diff the signatures of the functions the game calls. New parameters added in the middle aren't
    caught by the type check.
  - Play through, including on a phone.
  - The package's `littlejs.d.ts` declares an importable module, not globals, so it isn't used here.
- `src/` is organized by feature. Paths below are relative to `src/`:
  - `game.js`: the entry point (`engineInit`, image list, init order). `index.html` loads it, so it
    stays at the top.
  - `settings.js`: balance constants, default attribute sets, dev flags.
  - `core/`: shared helpers with no game rules: `util.js`, `html.js`, `logging.js`, `sprites.js`
    (the sprite atlas), `sounds.js`, `layers.js`.
  - `player/`: the save and progression: `player.js`, `player-level.js`, `statistics.js`,
    `attributes.js`, `achievements.js`, `shop-items.js`.
  - `birds/`: `bird.js` (`Bird` and the `BirdTemplate` builder), `templates.js` (every bird type),
    `movement.js` and `shooting.js` (behaviors, also used by the bee), `art.js` (bird art drawn in
    code; see below).
  - `levels/`: the level runtime, level list, formations and spawning (see below).
  - `hats/`: `hats.js`, `adjustments.js` (generated placement tuning), `attachment.js`.
  - `entities/`: everything else on the canvas: `bee.js`, `sammy.js`, `bullet.js`, `honeycomb.js`,
    `cloud.js`, and `hud.js` (`ProgressBar`, `Score`, `LevelScoreTracker`, `EntityType`).
  - `menus/`: one file per menu, plus `menu.js` (base class), `menus.js` (`initMenus`),
    `registry.js` (`MENUS`) and `button.js`. `menus/dev/` holds localhost-only tools.
  Put a new file in the folder of the feature it belongs to. Don't add `index.js` files that re-export
  a folder: they make import cycles easy to create. Import the exact file instead.
- Levels:
  - `levels/level-list.js` holds `LEVELS`, the scripted levels, written with the fluent `LevelDefinition`
    builder (`levels/level-definition.js`) and the reusable formations in `levels/formations.js`. Spawn plumbing
    (`FormationDefinition`, `FormationCreationOptions`, spawn regions) is in `levels/spawning.js`.
  - `levels/levels.js` is the level runtime: `Level`, `StandardLevel` (scripted), `TimeTrialLevel`
    (endless, seeded by the date), and `currentLevel`. An exported `let` can only be reassigned by
    its own module, so anything that sets `currentLevel` (`startStandardLevel`, `startTimeTrial`)
    must live in `levels/levels.js`.
  - Don't move classes that other modules extend (such as `Level`) into a file that's part of an
    import cycle with their subclasses. ES modules evaluate cycles in load order, so a subclass can
    end up evaluated before its base class exists.
- Menus are HTML/CSS overlays (`index.html` markup, `src/menus/*.js` behavior, `styles/menus-*.css`).
  Each menu extends `Menu` in `menus/menu.js` and is created in `menus/menus.js` (`MenuSet`, `initMenus`).
  To open another menu, import `MENUS` from `menus/registry.js`, never from `menus/menus.js`: importing
  `menus/menus.js` from a menu creates an import cycle that can load a menu before `Menu` exists.
- The shop is data-driven. `player/shop-items.js` defines `SHOP_ITEMS`: each `ShopItemDescriptor` has
  cost/value growth params and an `apply(player, value)` callback. `menus/shop.js` is only the UI.
  `isForever` items (cosmetics) survive prestige. `SHOP_ITEMS` keys are persisted in saves, so don't
  rename them. `player/shop-items.js` must not import `player/player.js`, because that would create an import cycle.
- **Player attributes are derived, not stored.** `Player.rebuildAttributes()` resets the bee, Sammy and
  level attribute sets to the defaults in `settings.js`, then applies every shop item at its purchased
  level. Only the purchase levels (and the "highest ever" tracking) are saved. Call `rebuildAttributes()`
  after anything that changes purchases. Never set attributes directly from shop code.
- **Hats** (cosmetic) are defined in `hats/hats.js` (`HATS`, ordered to match `img/hats.png`, which is laid
  out alphabetically by the file names in `img/hats/`). Hat ids are persisted in saves, so never rename
  them. Placement tuning lives in `hats/adjustments.js`. That file is generated by the dev-only Hat
  Tuning view (Settings > Debug on localhost), so don't hand-edit it. Hats are drawn by
  `HatAttachment` (`hats/attachment.js`), a child object of the wearer (the bee, birds or Sammy).
  The wardrobe preview (`menus/wardrobe.js`) uses the same `computeHatPlacement` as the game.
  The player saves owned hats in `ownedHats` and the worn hat in `equippedHat`. Prestige doesn't
  reset them.
- **Bird art is drawn in code** (`birds/art.js`), not loaded from an image. Each bird type sets its
  colors with `withStyle({ body, head, belly, wing, tail, beak, legs, eyelid })`. Only `body` is
  required; the rest default to shades of it. `initBirdArt()` draws each distinct style once at
  startup into a sprite sheet (a canvas made into an engine texture): one row of flap frames with eyes
  open, one with eyes closed. `BirdAnimation` picks the frame for each bird. Settings > Debug >
  Bird Preview (localhost) shows every type animated, large and at game size. The head is kept
  where the old art had it so the BIRD hat anchor still fits.
- Achievements extend the LittleJS `Medal` class (for the unlock pop-up) but are persisted in the
  player save, which is the only record: `Achievement.unlocked` is a getter that reads
  `currentPlayer.achievements`, so nothing needs reloading when the player is replaced.
  `Achievement.isLocal()` returns false so the engine's `medalsInit` never loads or saves their
  state. Use `forEachAchievement` from `player/achievements.js`, not `medalsForEach`.
- `src/player/player.js` holds `currentPlayer` and all persistent state, saved as JSON in `localStorage`
  (`save` key, previous save copied to `save_bk`). `currentPlayer` is created and loaded by
  `initPlayer()` at the top of `game.js`, so it's `undefined` while modules are still loading.
- Balance constants and default attribute sets live in `src/settings.js`.
  `docs/shop-balancing.xlsx` is the balancing spreadsheet.

## Conventions

- Standard JavaScript conventions: camelCase locals/params/members, PascalCase classes,
  UPPER_SNAKE_CASE constants and frozen enum-like objects. The author's global C# naming rules
  (`l`/`m` prefixes, `this.` qualification) do **not** apply to this repo.
- Use JSDoc for types (`@type`, `@param`, `@returns`). The codebase relies on it for editor IntelliSense.
- In menus, look up elements with `queryElement` / `queryAllElements` from `core/html.js` rather than
  `querySelector`, so the result is typed as an HTML element (pass e.g. `HTMLInputElement` as the
  third argument when you need `.value`). Plain objects can't use objects as keys; use a `Map`.
- Keep the existing style: 4-space indentation, semicolons, single quotes or double quotes as in
  the surrounding file, ES module imports with explicit `.js` extensions.

## Task tracking

- `docs/roadmap.md` lists what's next, in four sections:
  - **Planned:** decided.
  - **Ideas:** not committed; often unfinished thoughts.
  - **Known issues.**
  - **Code cleanup.**
- Add new ideas you notice to Ideas. Never move anything from Ideas to Planned yourself; that's the
  author's decision.
- When you finish an item, remove it from the roadmap and record it in the current
  `docs/changelog/` entry.
- `docs/changelog/` has one file per batch of work, named `YYYY-MM-DD-short-title.md`, with these sections:
  - Summary
  - What changed for players
  - Under the hood
  - Decisions
  - Follow-ups
  Keep entries high level; git has the details. Start a new entry when a batch is pushed or the work
  changes direction.
- A decision that becomes a lasting rule also goes in "Decisions and game-design intent" below.

## Decisions and game-design intent

- **Save compatibility:** Normally saves must keep loading (`loadSaveObj` should tolerate old/missing
  fields). Breaking a save is acceptable only when the author explicitly OKs it for a given change.
  Save format version 3 (`SAVE_VERSION` in `player/player.js`) renamed misspelled fields without converting
  older saves, with the author's OK. Don't add conversion code for versions before 3.
- Level-end bonuses (no damage, no survivors, perfect) are meant to pay out honeycomb.
- Shop upgrades of every category, including Sammy upgrades, are meant to affect gameplay.
- The Time Trial diminishing-returns penalty, based on Time Trials started during the current
  prestige and never resetting daily, is **intended**.
- Cosmetics, including hats, are "forever" shop purchases that persist through prestige.
- Prestige resets level unlocks and normal shop purchases. It keeps overall statistics,
  achievements, and forever purchases.
