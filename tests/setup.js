// Prepares a fake browser environment for the game code. Import this first in every test file:
//
//     import './setup.js';
//
// Each test file runs in its own Node process, so state like currentPlayer and localStorage
// starts fresh for every file.

import { fakeStorage, realConsole } from './support/browser-env.js';

// The game's logger replaces the console methods when it loads. Load it now, then restore the
// real console so console.log works in tests.
import '../src/logging.js';

Object.assign(console, realConsole);

/** Empties the fake localStorage, removing any save. */
export function resetLocalStorage() {
    fakeStorage.clear();
}
