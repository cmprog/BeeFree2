// Fakes the parts of the browser the game touches when its modules load, then loads the
// vendored LittleJS engine so its globals (vec2, EngineObject, Timer, ...) exist, just like
// the <script> tag in index.html. Imported by setup.js; don't import it directly from tests.
//
// This file must not import any game code: ES module imports run before the importing file's
// own code, so the fakes below have to be in place before anything from src/ is loaded.

import fs from 'node:fs';
import vm from 'node:vm';

/** In-memory localStorage. Tests can clear it with resetLocalStorage() from setup.js. */
export const fakeStorage = new Map();

globalThis.localStorage = {
    getItem: key => fakeStorage.has(key) ? fakeStorage.get(key) : null,
    setItem: (key, value) => { fakeStorage.set(key, String(value)); },
    removeItem: key => { fakeStorage.delete(key); },
    clear: () => fakeStorage.clear(),
};

/** A stand-in for any HTML element: accepts the calls the game makes and does nothing. */
function fakeElement() {
    return {
        classList: { add() {}, remove() {}, toggle() {}, contains: () => false },
        style: {},
        dataset: {},
        children: [],
        appendChild: child => child,
        removeChild: child => child,
        addEventListener() {},
        querySelector: () => fakeElement(),
        querySelectorAll: () => [],
        scrollTo() {},
        scrollHeight: 0,
    };
}

// Not 'localhost', so the game runs with production settings (no dev tools or dev hat tuning).
globalThis.document = {
    location: { href: 'http://tests.invalid/', hostname: 'tests.invalid' },
    body: fakeElement(),
    querySelector: () => fakeElement(),
    querySelectorAll: () => [],
    createElement: () => fakeElement(),
};

globalThis.window = globalThis;

// LittleJS creates its audio context when it loads.
globalThis.AudioContext = class {
    constructor() { this.destination = {}; }
    createGain() { return { connect() {}, gain: {} }; }
};

// The game's logger copies console.debug/info when it loads and replaces the console
// methods. Silence debug/info output (saves, spawns, ...) so test results stay readable.
// setup.js restores the real console afterwards so console.log works in tests.
export const realConsole = { ...console };
console.debug = () => {};
console.info = () => {};
console.log = () => {};

// Run LittleJS as a classic script so its top-level declarations become globals.
const engineUrl = new URL('../../dist/littlejs.js', import.meta.url);
vm.runInThisContext(fs.readFileSync(engineUrl, 'utf8'), { filename: engineUrl.pathname });
