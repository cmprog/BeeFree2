// Every module in src/ must load on its own, whatever is imported first. This catches import
// cycles where a class extends another class from a module that hasn't finished loading yet,
// which only shows up as a crash for some load orders.
//
// Each module is loaded in a fresh Node process with only the basic browser fakes, without
// tests/setup.js (which loads modules in a fixed order).

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

test('every module loads on its own', async () => {

    const failures = [];

    await Promise.all(modules.map(async name => {
        const moduleUrl = new URL(name, srcDir).href;
        const script = `await import(${JSON.stringify(envUrl)}); await import(${JSON.stringify(moduleUrl)});`;
        try {
            await run(process.execPath, ['--input-type=module', '--eval', script]);
        } catch (error) {
            const message = (error.stderr || error.message).split('\n').find(line => /Error/.test(line)) ?? error.message;
            failures.push(`${name}: ${message.trim()}`);
        }
    }));

    assert.equal(failures.length, 0, `These modules fail to load when imported first:\n${failures.sort().join('\n')}`);
});
