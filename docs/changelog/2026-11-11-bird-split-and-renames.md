# Bird split and renames (2026-11-11)

## Summary

A cleanup batch after the hats release: the bird types moved into their own file, and misspelled
names were fixed everywhere, including in the save format.

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
- New tests cover the bird templates and the version 3 field names.

## Decisions

- Old saves were deliberately not converted to the new names (the author's call).

## Follow-ups

None.
