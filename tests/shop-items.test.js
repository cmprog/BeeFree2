import './setup.js';

import { test } from 'node:test';
import assert from 'node:assert/strict';

import { Player } from '../src/player.js';
import { SHOP_ITEMS } from '../src/shop-items.js';

const ITEMS = Object.entries(SHOP_ITEMS);

test('every shop item is fully configured', () => {
    for (const [key, item] of ITEMS) {
        assert.ok(item.title, `${key} has a title`);
        assert.equal(typeof item.apply, 'function', `${key} has an apply callback`);
        assert.equal(typeof item.formatDisplayValue, 'function', `${key} can format its value`);
    }
});

test('prices never go down as the level goes up', () => {
    for (const [key, item] of ITEMS) {
        for (let level = 0; level < 20; level++) {
            assert.ok(item.computePrice(level + 1) >= item.computePrice(level),
                `${key}: price at level ${level + 1} is lower than at level ${level}`);
        }
    }
});

test('the first purchase costs the base cost', () => {
    for (const [key, item] of ITEMS) {
        assert.equal(item.computePrice(0), Math.trunc(item.costBase), key);
    }
});

test('value grows linearly from the base value', () => {
    const item = SHOP_ITEMS.BEE_SPEED;
    assert.equal(item.computeValue(0), item.valueBase);
    assert.equal(item.computeValue(3), item.valueBase + (3 * item.valueGrowthMultiplier));
});

test('every item can be applied at a range of levels without throwing', () => {
    const player = new Player();
    for (const [key, item] of ITEMS) {
        for (const level of [0, 1, 5, 25]) {
            assert.doesNotThrow(() => item.apply(player, item.computeValue(level)), `${key} at level ${level}`);
            assert.doesNotThrow(() => item.formatDisplayValue(item.computeValue(level)), `${key} display at level ${level}`);
        }
    }
});

test('forever items use the forever purchase set', () => {
    const player = new Player();
    for (const [key, item] of ITEMS) {
        const expected = item.isForever ? player.foreverShopPurchases : player.shopPurchases;
        assert.equal(item.getShopPurchaseSet(player), expected, key);
    }
});

test('Sammy speed upgrades make Sammy flap faster', () => {
    // Regression: this upgrade used to slow Sammy down.
    const item = SHOP_ITEMS.SAMMY_SPEED;
    const player = new Player();

    item.apply(player, item.computeValue(0));
    const baseSpeed = player.levelAttributes.sammySpeed;

    item.apply(player, item.computeValue(3));
    assert.ok(player.levelAttributes.sammySpeed < baseSpeed,
        'sammySpeed is the time per flap, so a faster Sammy has a smaller value');
});
