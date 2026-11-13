import './setup.js';

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { BEE_BUZZ_FRAME_COUNT, BEE_FRAME_SIZE, BeeAnimation } from '../src/entities/bee-art.js';
import { Bee } from '../src/entities/bee.js';
import { AttributeSet } from '../src/player/attributes.js';

test('the bee keeps its 2 x 2 hitbox, and its art covers at least that', () => {
    const bee = new Bee(new AttributeSet());

    assert.equal(bee.size.x, 2);
    assert.equal(bee.size.y, 2);
    assert.ok(BEE_FRAME_SIZE.x >= bee.size.x && BEE_FRAME_SIZE.y >= bee.size.y);
});

test('the wings buzz through every frame several times a second', () => {
    const animation = new BeeAnimation(0);
    const frames = new Set();
    for (let time = 0; time < 1; time += 1 / 120) {
        frames.add(animation.getFrame(time).flapFrame);
    }
    assert.equal(frames.size, BEE_BUZZ_FRAME_COUNT);
});
