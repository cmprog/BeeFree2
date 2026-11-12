# Roadmap

What's next for BeeFree. Finished work is recorded in [changelog/](changelog/), not here.

- **Planned:** decided, will do.
- **Ideas:** not committed, not necessarily thought through. Fine to delete. Move an item to
  Planned once it's fleshed out and decided.
- **Known issues:** bugs, or things that might be bugs, that need investigating.
- **Code cleanup:** technical debt with no player-facing change.

## Planned

- **Sound effects.** `src/core/sounds.js` has a start on this (`initSounds()`), but it isn't called or
  imported yet, and `gameInit` turns sound off (`soundEnable = false`).
- **Tune hat placement.** Every hat still uses the default position. Use Settings > Debug >
  Hat Tuning on localhost, then paste the copied file over `src/hats/adjustments.js`.
- **Playtest hat prices.** The tiers are 250 / 1,000 / 3,000 honeycomb (`HAT_PRICE_*` in
  `src/settings.js`).
- **Watch a Sammy party.** Check that about 10% of birds and half of the Sammys spawned during a party
  wear hats (`SAMMY_PARTY_*_HAT_CHANCE` in `src/settings.js`). Only checked in code so far.

## Ideas

- Birds that fly right (Thing 3 and 4) still face left. Mirroring them would also need the hat
  placement mirrored.
- More per-type bird features beyond color: brows, crests, size.
- Reflection chance attribute.
- Double shot chance attribute. The statistics screen already lists a "double shot chance", so
  this may be partly built.
- Passive honeycomb earnings: buy a beehive and collect from it every day. Could add options for
  the duration and amount.
- Challenge mode prestige?
- Extra life shop purchase?
- Shielding attribute:
    - Maximum damage reduction: the shield acts as damage reduction.
    - Maximum shield amount: the shield only has so much life before it stops working.

## Known issues

- Levels 7, 8, and 9 might have hidden birds.
- Enough stingers make them fire in a vertical line instead of an arc.

## Code cleanup

Nothing right now.
