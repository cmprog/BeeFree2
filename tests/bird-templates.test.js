import './setup.js';

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { BIRD_TEMPLATES, initBirdTemplates } from '../src/birds/templates.js';
import { BirdTemplate } from '../src/birds/bird.js';

initBirdTemplates();

const templates = Object.entries(BIRD_TEMPLATES);

test('every bird template is a named BirdTemplate', () => {
    assert.ok(templates.length > 0);
    for (const [key, template] of templates) {
        assert.ok(template instanceof BirdTemplate, key);
        assert.ok(template.name, `${key} has a name`);
    }
});

test('every bird template has a time trial phase', () => {
    // The time trial picks birds by phase, so every template needs one.
    for (const [key, template] of templates) {
        assert.equal(typeof template.timeTrialPhase, 'number', key);
    }
});

test('every bird template can create its movement and shooting behaviors', () => {
    for (const [key, template] of templates) {
        assert.doesNotThrow(() => template.createMovementBehavior(template.attributes), `${key} movement`);
        assert.doesNotThrow(() => template.createShootingBehavior(template.attributes), `${key} shooting`);
    }
});
