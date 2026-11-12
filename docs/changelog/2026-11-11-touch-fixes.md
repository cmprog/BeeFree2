# Touch fixes (2026-11-11)

## Summary

Fixes found while playtesting on a phone.

## What changed for players

- On phones, the bee no longer drifts when the movement stick is released, or at the start of a
  level before it's touched.

## Under the hood

- The tap that starts a level could leave the engine's mouse button stuck down. The level starts on
  the button's `touchend`, which turns the touch gamepad on before the engine sees that `touchend`.
  The engine then ignores it, so the "mouse" never lifts. Whenever the stick was idle, the bee switched
  to mouse control and flew to where the tap had been. On a touch device with the touch gamepad on,
  the bee now always uses the gamepad (`entities/bee.js`).

## Decisions

- On a touch device, mouse control is off during levels. That includes touchscreen laptops, where
  the touch gamepad was already forced on.

## Follow-ups

Confirm on a real phone.
