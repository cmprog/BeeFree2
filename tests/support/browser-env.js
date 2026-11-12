// Fakes the few browser features needed to load the game's modules (localStorage, plus what
// LittleJS uses when it loads), then loads the vendored LittleJS engine so its globals (vec2, EngineObject, Timer, ...) exist, just like
// the <script> tag in index.html. Imported by setup.js; don't import it directly from tests.
//
// This file must not import any game code: ES module imports run before the importing file's
// own code, so the fakes below have to be in place before anything from src/ is loaded.

import fs from 'node:fs';
import vm from 'node:vm';

/** In-memory localStorage. Tests can clear it with resetLocalStorage() from setup.js. */
export const fakeStorage = new Map();

/** How many times localStorage has been used, so tests can check that importing doesn't use it. */
export const storageUse = { count: 0 };

globalThis.localStorage = {
    getItem: key => { storageUse.count++; return fakeStorage.has(key) ? fakeStorage.get(key) : null; },
    setItem: (key, value) => { storageUse.count++; fakeStorage.set(key, String(value)); },
    removeItem: key => { storageUse.count++; fakeStorage.delete(key); },
    clear: () => { storageUse.count++; fakeStorage.clear(); },
};

// LittleJS checks window.ontouchstart and creates its audio context when it loads.
globalThis.window = globalThis;

// Sounds made when a module loads (core/sounds.js) render their samples into a buffer.
globalThis.AudioContext = class {
    constructor() {
        this.destination = {};
        this.sampleRate = 44100;
        this.currentTime = 0;
        this.state = 'suspended';
    }
    addEventListener() {}
    createGain() { return { connect() {}, gain: { value: 1 } }; }
    createBuffer(channels, length) {
        const data = Array.from({ length: channels }, () => new Float32Array(length));
        return { getChannelData: channel => data[channel], copyToChannel() {} };
    }
};

// The game's logger keeps a copy of console.debug/info/log from when it loads and writes
// debug output (saves, spawns, ...) through them. Silence them while it loads so test results
// stay readable; setup.js restores the real console afterwards so console.log works in tests.
export const realConsole = { ...console };
console.debug = () => {};
console.info = () => {};
console.log = () => {};

// Run LittleJS as a classic script so its top-level declarations become globals.
const engineUrl = new URL('../../dist/littlejs.js', import.meta.url);
vm.runInThisContext(fs.readFileSync(engineUrl, 'utf8'), { filename: engineUrl.pathname });
