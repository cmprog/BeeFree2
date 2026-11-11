// Every module in src/ must load on its own, whatever is imported first. This catches import
// cycles where a class extends another class from a module that hasn't finished loading yet,
// which only shows up as a crash for some load orders.
//
// Importing a module must also only declare things (classes, functions, fixed data). It must not
// use localStorage, register medals, or create engine objects; that work belongs in an init*()
// function called from game.js.
//
// Each module is loaded in a fresh Node process with only the basic browser fakes, without
// tests/setup.js.

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import fs from 'node:fs';
import { promisify } from 'node:util';

const run = promisify(execFile);

// The entry point starts the engine, which needs a real browser.
const SKIP = new Set(['game.js']);

const srcDir = new URL('../src/', import.meta.url);
const envUrl = new URL('./support/browser-env.js', import.meta.url).href;

const modules = fs.readdirSync(srcDir).filter(name => name.endsWith('.js') && !SKIP.has(name));

/**
 * Imports one module in a fresh process, then checks what importing it did.
 * @param {string} moduleUrl
 */
function checkScript(moduleUrl) {
    return `
        const env = await import(${JSON.stringify(envUrl)});
        const storageUseBefore = env.storageUse.count;
        await import(${JSON.stringify(moduleUrl)});
        const problems = [];
        if (env.storageUse.count !== storageUseBefore) problems.push('used localStorage');
        if (Object.keys(medals).length) problems.push('registered medals');
        if (engineObjects.length) problems.push('created engine objects');
        if (problems.length) throw new Error('importing it ' + problems.join(', '));`;
}

test('every module loads on its own and only declares things', async () => {

    const failures = [];

    await Promise.all(modules.map(async name => {
        try {
            await run(process.execPath, ['--input-type=module', '--eval', checkScript(new URL(name, srcDir).href)]);
        } catch (error) {
            const message = (error.stderr || error.message).split('\n').find(line => /^\w*Error:/.test(line.trim())) ?? error.message;
            failures.push(`${name}: ${message.trim()}`);
        }
    }));

    assert.equal(failures.length, 0, `These modules fail to load on their own, or do more than declare things:\n${failures.sort().join('\n')}`);
});
