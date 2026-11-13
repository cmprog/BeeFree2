import './setup.js';

import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
    BIRD_FLAP_FRAME_COUNT, BIRD_FLAPS_FRAMES_PER_SECOND, BirdAnimation, BirdStyle, wingLiftForFrame,
} from '../src/birds/art.js';
import { shade } from '../src/core/art.js';
import { BIRD_TEMPLATES, initBirdTemplates } from '../src/birds/templates.js';

initBirdTemplates();

const COLOR_PARTS = ['body', 'head', 'belly', 'wing', 'tail', 'beak', 'legs', 'eyelid'];

test('a style only needs a body color; the rest are shades of it', () => {
    const style = new BirdStyle({ body: RED });

    assert.equal(style.head.toString(), RED.toString());
    assert.equal(style.wing.toString(), shade(RED, -0.25).toString());
    assert.equal(style.tail.toString(), style.wing.toString());
    assert.equal(style.belly.toString(), shade(RED, 0.45).toString());
    assert.equal(style.eyelid.toString(), shade(RED, -0.15).toString());
});

test('colors given to a style are kept', () => {
    const style = new BirdStyle({ body: RED, head: BLUE, tail: GREEN });

    assert.equal(style.head.toString(), BLUE.toString());
    assert.equal(style.tail.toString(), GREEN.toString());
    assert.equal(style.eyelid.toString(), shade(BLUE, -0.15).toString(), 'the eyelid follows the head');
});

test('styles with the same colors share a key, and different colors don\'t', () => {
    assert.equal(new BirdStyle({ body: RED }).key(), new BirdStyle({ body: RED }).key());
    assert.notEqual(new BirdStyle({ body: RED }).key(), new BirdStyle({ body: RED, tail: BLUE }).key());
});

test('the flap starts with the wings up and reaches fully down halfway through', () => {
    assert.equal(wingLiftForFrame(0), 1);
    assert.ok(Math.abs(wingLiftForFrame(BIRD_FLAP_FRAME_COUNT / 2) + 1) < 1e-9);
    for (let frame = 0; frame < BIRD_FLAP_FRAME_COUNT; frame++) {
        // A lift of 0 would draw the wing as a flat line.
        assert.ok(Math.abs(wingLiftForFrame(frame)) > 0.2, `frame ${frame}`);
    }
});

test('a bird flaps through every frame and blinks briefly', () => {
    const animation = new BirdAnimation(0);
    const frames = new Set();
    let closedTime = 0;
    const step = 1 / 60;
    for (let time = 0; time < 30; time += step) {
        const { flapFrame, eyesClosed } = animation.getFrame(time);
        frames.add(flapFrame);
        if (eyesClosed) closedTime += step;
    }

    assert.equal(frames.size, BIRD_FLAP_FRAME_COUNT);
    // 30 seconds with a blink every 2 to 6 seconds, each lasting a fraction of a second.
    assert.ok(closedTime > 0, 'blinked at least once');
    assert.ok(closedTime < 30 * 0.15, 'eyes are open most of the time');
    assert.ok(BIRD_FLAPS_FRAMES_PER_SECOND > 0);
});

test('every bird type has a complete style', () => {
    for (const [key, template] of Object.entries(BIRD_TEMPLATES)) {
        assert.ok(template.style instanceof BirdStyle, key);
        for (const part of COLOR_PARTS) {
            assert.ok(template.style[part] instanceof Color, `${key} ${part}`);
        }
    }
});

test('Thing 1 to 4 can be told apart', () => {
    const keys = ['thing1', 'thing2', 'thing3', 'thing4'].map(key => BIRD_TEMPLATES[key].style.key());
    assert.equal(new Set(keys).size, 4);
});
