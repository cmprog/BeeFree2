import './setup.js';

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { BirdTemplate } from '../src/birds/bird.js';
import { FormationCreationOptions, FormationDefinition } from '../src/levels/spawning.js';
import { LevelDefinition } from '../src/levels/level-definition.js';

const fred = new BirdTemplate('Fred', '');
const bill = new BirdTemplate('Bill', '');
const thing = new BirdTemplate('Thing', '');

/** A small formation with two kinds of bird. */
function mixedFormation() {
    return new FormationDefinition('Mixed')
        .withSpawn(fred, 0, vec2(20, 2))
        .withSpawn(thing, 1, vec2(20, 0))
        .withSpawn(fred, 1, vec2(20, -2));
}

test('without options a formation spawns exactly what it defines', () => {
    const spawns = mixedFormation().createSpawns();
    assert.deepEqual(spawns.map(s => s.template.name), ['Fred', 'Thing', 'Fred']);
    assert.deepEqual(spawns.map(s => s.time), [0, 1, 2]);
});

test('a template mapping replaces only birds of that template', () => {
    // Regression: the mapping used to replace every bird in the formation.
    const spawns = mixedFormation().createSpawns(new FormationCreationOptions()
        .withTemplateMapping(fred, bill));

    assert.deepEqual(spawns.map(s => s.template.name), ['Bill', 'Thing', 'Bill']);
});

test('several template mappings can be used together', () => {
    const spawns = mixedFormation().createSpawns(new FormationCreationOptions()
        .withTemplateMapping(fred, bill)
        .withTemplateMapping(thing, fred));

    assert.deepEqual(spawns.map(s => s.template.name), ['Bill', 'Fred', 'Bill']);
});

test('a replacement swaps the bird at one position', () => {
    const spawns = mixedFormation().createSpawns(new FormationCreationOptions()
        .withReplacement(2, bill));

    assert.deepEqual(spawns.map(s => s.template.name), ['Fred', 'Thing', 'Bill']);
});

test('positions are scaled and then offset, and timing is scaled', () => {
    const spawns = mixedFormation().createSpawns(new FormationCreationOptions()
        .withPositionScaling(vec2(1, 2))
        .withPositionOffset(vec2(5, 1))
        .withTimeScaling(0.5));

    assert.deepEqual(spawns.map(s => [s.pos.x, s.pos.y]), [[25, 5], [25, 1], [25, -3]]);
    assert.deepEqual(spawns.map(s => s.time), [0, 0.5, 1]);
});

test('a level built from formations keeps the spawn timing in order', () => {
    const level = new LevelDefinition(0, 'Test')
        .withDelay(2)
        .withFormation(mixedFormation())
        .withDelay(5);

    assert.deepEqual(level.spawns.map(s => s.time), [2, 3, 4]);
    assert.equal(level.totalDuration, 9);
});
