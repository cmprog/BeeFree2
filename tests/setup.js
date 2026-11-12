// Prepares a fake browser environment for the game code. Import this first in every test file:
//
//     import './setup.js';
//
// Each test file runs in its own Node process, so module state and localStorage start fresh for
// every file. currentPlayer isn't created until initPlayer() is called; most tests create their
// own `new Player()` instead.

import { fakeStorage, realConsole } from './support/browser-env.js';

// Load the game's logger while the console is silenced (see browser-env.js), then restore the
// real console so console.log works in tests.
import '../src/core/logging.js';

Object.assign(console, realConsole);

/** Empties the fake localStorage, removing any save. */
export function resetLocalStorage() {
    fakeStorage.clear();
}
