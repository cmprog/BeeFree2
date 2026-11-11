import './setup.js';

import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

import {
    HATS, HatTier, HatWearer, HAT_ATLAS_COLUMNS, HAT_ATLAS_TILE_SIZE, computeHatPlacement, getHat,
    getHatAtlasCell, getHatWearerAnchor, serializeHatAdjustmentsFile,
} from '../src/hats.js';
import { HAT_ADJUSTMENTS } from '../src/hat-adjustments.js';
import { computeHealthBarOffset } from '../src/hat-attachment.js';

const repoFile = (path) => new URL(`../${path}`, import.meta.url);

test('hat ids are unique and every hat can be looked up', () => {
    const ids = HATS.map(hat => hat.id);
    assert.equal(new Set(ids).size, ids.length);
    for (const hat of HATS) {
        assert.equal(getHat(hat.id), hat);
    }
    assert.equal(getHat('noSuchHat'), undefined);
});

test('every hat has a tier with a price', () => {
    const tiers = Object.values(HatTier);
    for (const hat of HATS) {
        assert.ok(tiers.includes(hat.tier), hat.id);
        assert.ok(hat.tier.price > 0, hat.id);
    }
});

test('there is one hat for each image in img/hats', () => {
    const images = fs.readdirSync(repoFile('img/hats')).filter(name => name.endsWith('.png'));
    assert.equal(HATS.length, images.length);
});

test('every hat fits inside the img/hats.png atlas', () => {
    // A PNG's width and height are stored at bytes 16-23 of the file.
    const png = fs.readFileSync(repoFile('img/hats.png'));
    const width = png.readUInt32BE(16);
    const height = png.readUInt32BE(20);
    assert.equal(width, HAT_ATLAS_COLUMNS * HAT_ATLAS_TILE_SIZE);

    for (const hat of HATS) {
        const { row } = getHatAtlasCell(hat);
        assert.ok((row + 1) * HAT_ATLAS_TILE_SIZE <= height, `${hat.id} is below the bottom of the atlas`);
    }
});

test('every hat has an entry in hat-adjustments.js', () => {
    for (const hat of HATS) {
        assert.ok(hat.id in HAT_ADJUSTMENTS, `${hat.id} is missing; regenerate the file from the hat tuning view`);
    }
});

test('hat-adjustments.js matches what the tuning view generates', () => {
    // If this fails, the file was edited by hand or the generator changed. Regenerate the file
    // with "Copy adjustments file" in the hat tuning view.
    const onDisk = fs.readFileSync(repoFile('src/hat-adjustments.js'), 'utf8').replace(/\r\n/g, '\n');
    assert.equal(serializeHatAdjustmentsFile().replace(/\r\n/g, '\n'), onDisk);
});

test('an unadjusted hat sits exactly on the wearer\'s anchor', () => {
    const hat = HATS[0];
    const adjustment = HAT_ADJUSTMENTS[hat.id];
    const saved = { ...adjustment };
    Object.assign(adjustment, { x: 0, y: 0, scale: 1, angle: 0 });

    try {
        for (const wearer of Object.values(HatWearer)) {
            const anchor = getHatWearerAnchor(wearer);
            const placement = computeHatPlacement(hat.id, wearer);
            assert.equal(placement.x, anchor.x);
            assert.equal(placement.y, anchor.y);
            assert.equal(placement.size, anchor.size);
            // === rather than assert.equal: mirrored wearers give -0, which assert.equal treats as different from 0.
            assert.ok(placement.angle === 0);
        }
    } finally {
        Object.assign(adjustment, saved);
    }
});

test('birds face the other way, so their hats are mirrored', () => {
    const hat = HATS[0];
    const adjustment = HAT_ADJUSTMENTS[hat.id];
    const saved = { ...adjustment };
    Object.assign(adjustment, { x: 0.2, y: 0.1, scale: 1.5, angle: 10 });

    try {
        const bee = computeHatPlacement(hat.id, HatWearer.BEE);
        const bird = computeHatPlacement(hat.id, HatWearer.BIRD);
        const beeAnchor = getHatWearerAnchor(HatWearer.BEE);
        const birdAnchor = getHatWearerAnchor(HatWearer.BIRD);

        assert.equal(bee.mirror, false);
        assert.equal(bird.mirror, true);
        // Forward is +x for the bee and -x for the bird.
        assert.ok(Math.abs((bee.x - beeAnchor.x) - (0.2 * beeAnchor.size)) < 1e-9);
        assert.ok(Math.abs((bird.x - birdAnchor.x) + (0.2 * birdAnchor.size)) < 1e-9);
        assert.ok(Math.abs(bird.angle + bee.angle) < 1e-9);
    } finally {
        Object.assign(adjustment, saved);
    }
});

test('the health bar stays put without a hat and moves above a tall hat', () => {
    assert.equal(computeHealthBarOffset(undefined, 1).y, 1);

    const shortHat = /** @type {any} */ ({ getLocalTop: () => 0.5 });
    assert.equal(computeHealthBarOffset(shortHat, 1).y, 1);

    const tallHat = /** @type {any} */ ({ getLocalTop: () => 1.5 });
    assert.ok(computeHealthBarOffset(tallHat, 1).y > 1.5);
});
