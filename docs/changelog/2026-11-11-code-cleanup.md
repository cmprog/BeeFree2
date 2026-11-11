# Code cleanup (2026-11-11)

## Summary

A cleanup batch after the hats release:
- the bird types moved into their own file;
- misspelled names were fixed everywhere, including in the save format;
- every module now only declares things on import, with startup done through explicit init functions.

## What changed for players

- "Achivements" is now spelled "Achievements", and other visible spelling fixes ("damange", "achived").
- **Saves from before this change reset these values:**
  - achievements (they unlock again, and pay out their honeycomb again)
  - level "no damage" badges
  - Time Trial records
  - the Exploding Birds purchase

## Under the hood

- The bird types (`BIRD_TEMPLATES`) moved from `birds.js` into `bird-templates.js`.
- Renamed throughout code, files, HTML and CSS:
  - `achivement` → `achievement`
  - `noDamangeCount` → `noDamageCount`
  - `overallTimeTrailStatistics` → `overallTimeTrialStatistics`
  - the `SOMETHING` shop key → `EXPLODING_BIRDS`
- The save format is now version 3.
- Importing a module now only declares things. The last modules that did work on import now have
  init functions, called from `game.js`'s ordered startup list:
  - achievements (`initAchievements`)
  - dev hat tuning (`initHatTuning`)
  - sounds (`initSounds`)
  The module-loading test fails if importing a module uses `localStorage`, registers medals or
  creates engine objects.
- New tests cover the bird templates and the version 3 field names.

## Decisions

- Old saves were deliberately not converted to the new names (the author's call).
- Declaration is kept separate from initialization: fixed data can be built on import, while
  everything else goes through `init*()`. See `CLAUDE.md`.

## Follow-ups

None.
