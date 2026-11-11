// Prepares a fake browser environment for the game code. Import this first in every test file:
//
//     import './setup.js';
//
// Each test file runs in its own Node process, so state like currentPlayer and localStorage
// starts fresh for every file.

import { fakeStorage, realConsole } from './support/browser-env.js';

// Load modules in the same order game.js does. Several menus extend Menu while menu.js imports
// the menus, so loading some other module first can evaluate a menu before Menu exists.
import '../src/sprites.js';
import '../src/menus.js';

Object.assign(console, realConsole);

/** Empties the fake localStorage, removing any save. */
export function resetLocalStorage() {
    fakeStorage.clear();
}
