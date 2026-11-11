/**
 * The game's sound effects, created by initSounds(). Sound isn't wired into the game yet; see
 * "Sound effects" in docs/roadmap.md.
 * @type {{ shoot: Sound }}
 */
export let SOUNDS;

/**
 * Creates the sound effects. Call once at startup.
 */
export function initSounds() {
    SOUNDS = {
        shoot: new Sound([1, 0]),
    };
}
