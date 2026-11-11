// Runs every automated check: the type check, then the unit tests.
// Used by check.bat, by agents, and by the GitHub workflow, so everyone runs the same thing.
//
//     node tools/check.mjs          type check + tests
//     node tools/check.mjs tests    tests only (no internet needed)
//     node tools/check.mjs types    type check only
//
// Exits with code 1 if anything fails.

import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

// Pinned so results don't change when a new TypeScript is released. npx downloads it on first
// use and caches it afterwards.
const TYPESCRIPT_VERSION = '5.6.3';

const repoRoot = fileURLToPath(new URL('..', import.meta.url));
const only = process.argv[2];

function heading(text) {
    console.log(`\n=== ${text} ===\n`);
}

/**
 * Type checks src/ with the TypeScript compiler, using jsconfig.json.
 * Errors inside dist/littlejs.js are the engine's own JSDoc problems and are ignored.
 * @returns {boolean} Whether the check passed.
 */
function typeCheck() {

    heading('Type check');

    const result = spawnSync(
        'npx', ['--yes', '--package', `typescript@${TYPESCRIPT_VERSION}`, 'tsc', '-p', 'jsconfig.json', '--pretty', 'false'],
        { cwd: repoRoot, encoding: 'utf8', shell: true });

    if (result.error || result.status === null) {
        console.log('Could not run the TypeScript compiler through npx. Is Node.js installed and is there an internet connection?');
        console.log(result.error?.message ?? result.stderr);
        return false;
    }

    // tsc prints one line per error, with any extra detail on indented lines after it.
    const errors = [];
    for (const line of result.stdout.split(/\r?\n/)) {
        if (!line.trim()) continue;
        if (/^\s/.test(line)) {
            if (errors.length) errors[errors.length - 1].push(line);
        } else {
            errors.push([line]);
        }
    }

    const sourceErrors = errors.filter(([first]) => !first.startsWith('dist/'));
    if (sourceErrors.length) {
        console.log(sourceErrors.map(lines => lines.join('\n')).join('\n'));
        console.log(`\n${sourceErrors.length} type error(s).`);
        return false;
    }

    if (result.status !== 0 && errors.length === 0) {
        // tsc failed without reporting errors, for example a broken jsconfig.json.
        console.log(result.stdout, result.stderr);
        return false;
    }

    console.log('No type errors.');
    return true;
}

/**
 * Runs the unit tests in tests/ with Node's built-in test runner.
 * @returns {boolean} Whether all tests passed.
 */
function unitTests() {

    heading('Unit tests');

    const result = spawnSync(
        process.execPath, ['--test', '--test-reporter=spec', 'tests/**/*.test.js'],
        { cwd: repoRoot, stdio: 'inherit' });

    return result.status === 0;
}

const results = [];
if (only !== 'tests') results.push(['Type check', typeCheck()]);
if (only !== 'types') results.push(['Unit tests', unitTests()]);

heading('Summary');
for (const [name, passed] of results) {
    console.log(`${passed ? 'PASS' : 'FAIL'}  ${name}`);
}

process.exit(results.every(([, passed]) => passed) ? 0 : 1);
