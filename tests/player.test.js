import { resetLocalStorage } from './setup.js';

import { beforeEach, describe, test } from 'node:test';
import assert from 'node:assert/strict';

import { Player, currentPlayer, initPlayer } from '../src/player.js';
import { SHOP_ITEMS } from '../src/shop-items.js';
import { HATS, HatTier } from '../src/hats.js';
import { DEFAULT_BEE_ATTRIBUTES } from '../src/settings.js';

beforeEach(() => resetLocalStorage());

/**
 * Buys the next level of a shop item, giving the player enough honeycomb first.
 * @param {Player} player
 * @param {string} key
 */
function buy(player, key) {
    const item = SHOP_ITEMS[key];
    const price = item.computePrice(item.getPurchasedLevel(player, key));
    player.availableHoneycomb += price;
    player.purchaseShopItem(key, item, price);
}

/**
 * Saves the player and loads the save into a brand new player, like reopening the game.
 * @param {Player} player
 * @returns {Player}
 */
function reload(player) {
    player.save();
    const loaded = new Player();
    loaded.load();
    return loaded;
}

test('initPlayer loads the saved game into currentPlayer', () => {
    localStorage.setItem('save', JSON.stringify({ name: 'Saved', availableHoneycomb: 42 }));

    initPlayer();

    assert.equal(currentPlayer.name, 'Saved');
    assert.equal(currentPlayer.availableHoneycomb, 42);
});

describe('a new player', () => {

    test('starts with the default attributes and nothing bought', () => {
        const player = new Player();
        assert.equal(player.beeAttributes.speed, DEFAULT_BEE_ATTRIBUTES.speed);
        assert.equal(player.availableHoneycomb, 0);
        assert.deepEqual(player.shopPurchases, {});
        assert.equal(player.equippedHat, null);
    });

    test('can play the first level', () => {
        assert.equal(new Player().getLevel(0).isUnlocked, true);
    });
});

describe('shop purchases', () => {

    test('spend honeycomb, raise the level, and apply the upgrade', () => {
        const player = new Player();
        const item = SHOP_ITEMS.BEE_SPEED;
        player.availableHoneycomb = 1000;

        player.purchaseShopItem('BEE_SPEED', item, item.computePrice(0));

        assert.equal(player.availableHoneycomb, 1000 - item.computePrice(0));
        assert.equal(player.shopPurchases.BEE_SPEED, 1);
        assert.equal(player.beeAttributes.speed, item.computeValue(1));
        assert.equal(player.prestigeStatistics.shopUpgradesPurchased, 1);
        assert.equal(player.overallStatistics.shopUpgradesPurchased, 1);
    });

    test('rebuilding attributes gives the same result every time', () => {
        const player = new Player();
        buy(player, 'BEE_SPEED');
        buy(player, 'BULLET_DAMAGE');
        const before = JSON.stringify(player.beeAttributes.toSaveObj());

        player.rebuildAttributes();
        player.rebuildAttributes();

        assert.equal(JSON.stringify(player.beeAttributes.toSaveObj()), before);
    });
});

describe('prestige', () => {

    test('resets normal purchases but keeps the highest attributes ever reached', () => {
        const player = new Player();
        buy(player, 'BEE_SPEED');
        const boostedSpeed = player.beeAttributes.speed;

        player.prestige();

        assert.deepEqual(player.shopPurchases, {});
        assert.equal(player.beeAttributes.speed, DEFAULT_BEE_ATTRIBUTES.speed);
        assert.equal(player.highestBeeAttributes.speed, boostedSpeed);
        assert.equal(player.prestigeCount, 1);
    });

    test('keeps forever purchases, hats, and achievements', () => {
        const player = new Player();
        const foreverKey = Object.keys(SHOP_ITEMS).find(key => SHOP_ITEMS[key].isForever);
        buy(player, foreverKey);
        player.availableHoneycomb = HatTier.FABULOUS.price;
        player.purchaseHat('crown');
        player.achievements[3] = true;

        player.prestige();

        assert.equal(player.foreverShopPurchases[foreverKey], 1);
        assert.ok(player.ownsHat('crown'));
        assert.equal(player.equippedHat, 'crown');
        assert.equal(player.hasAchievement(3), true);
    });

    test('raises the honeycomb multiplier based on honeycomb collected this prestige', () => {
        const player = new Player();
        player.onHoneycombCollected(1000);
        const expectedGain = player.calculatePotentialPrestigeEarnings();
        assert.ok(expectedGain > 0);

        player.prestige();

        assert.equal(player.prestigeHoneycombMultiplier, 1 + expectedGain);
        assert.equal(player.availableHoneycomb, 0);
        assert.equal(player.prestigeStatistics.totalHoneycombCollected, 0);
        assert.equal(player.overallStatistics.totalHoneycombCollected, 1000);
    });

    test('locks every level except the first', () => {
        const player = new Player();
        player.markLevelAvailable(1);
        player.markLevelAvailable(2);

        player.prestige();

        assert.equal(player.getLevel(0).isUnlocked, true);
        assert.equal(player.getLevel(1).isUnlocked, false);
        assert.equal(player.getLevel(2).isUnlocked, false);
    });
});

describe('saving and loading', () => {

    test('a save loads back to the same player', () => {
        const player = new Player();
        player.availableHoneycomb = 5000;
        buy(player, 'BEE_SPEED');
        buy(player, 'BEE_SPEED');
        player.purchaseHat('beanie');
        player.markLevelAvailable(4);
        player.onBirdKilled();

        const loaded = reload(player);

        assert.equal(loaded.availableHoneycomb, player.availableHoneycomb);
        assert.equal(loaded.shopPurchases.BEE_SPEED, 2);
        assert.equal(loaded.beeAttributes.speed, player.beeAttributes.speed);
        assert.ok(loaded.ownsHat('beanie'));
        assert.equal(loaded.equippedHat, 'beanie');
        assert.equal(loaded.getLevel(4).isUnlocked, true);
        assert.equal(loaded.overallStatistics.killCount, 1);
    });

    test('attributes come from purchases, not from attribute values stored in old saves', () => {
        // Version 1 saves stored the attribute sets themselves. They must be ignored.
        localStorage.setItem('save', JSON.stringify({
            availableHoneycomb: 100,
            beeAttributes: { speed: 999 },
            birdsExplodeOnKill: true,
            shopPurchases: { BEE_SPEED: 2 },
            levels: { 0: { id: 0, isUnlocked: true } },
        }));

        const player = new Player();
        player.load();

        assert.equal(player.beeAttributes.speed, SHOP_ITEMS.BEE_SPEED.computeValue(2));
        assert.equal(player.birdsExplodeOnKill, false);
        assert.equal(player.availableHoneycomb, 100);
    });

    test('a save with most fields missing still loads', () => {
        localStorage.setItem('save', JSON.stringify({ name: 'Old Save' }));

        const player = new Player();
        player.load();

        assert.equal(player.name, 'Old Save');
        assert.equal(player.prestigeHoneycombMultiplier, 1);
        assert.equal(player.getLevel(0).isUnlocked, true);
        assert.equal(player.beeAttributes.speed, DEFAULT_BEE_ATTRIBUTES.speed);
    });

    test('hats that no longer exist are dropped from the save', () => {
        localStorage.setItem('save', JSON.stringify({
            ownedHats: ['crown', 'retiredHat'],
            equippedHat: 'retiredHat',
        }));

        const player = new Player();
        player.load();

        assert.deepEqual([...player.ownedHats], ['crown']);
        assert.equal(player.equippedHat, null);
    });

    test('saves use the version 3 field names', () => {
        const player = new Player();
        player.achievements[1] = true;
        player.onStandardLevelCompleted(0, false, true, false);
        player.save();

        const saved = JSON.parse(localStorage.getItem('save'));
        assert.equal(saved.saveVersion, 3);
        assert.deepEqual(saved.achievements, { 1: true });
        assert.ok('overallTimeTrialStatistics' in saved);
        assert.equal(saved.levels[0].overallStatistics.noDamageCount, 1);
        assert.ok('EXPLODING_BIRDS' in SHOP_ITEMS);
    });

    test('the previous save is kept as a backup', () => {
        const player = new Player();
        player.availableHoneycomb = 1;
        player.save();
        player.availableHoneycomb = 2;
        player.save();

        assert.equal(JSON.parse(localStorage.getItem('save_bk')).availableHoneycomb, 1);
        assert.equal(JSON.parse(localStorage.getItem('save')).availableHoneycomb, 2);
    });
});

describe('hats', () => {

    test('buying a hat spends its tier price and puts it on', () => {
        const hat = HATS.find(h => h.tier === HatTier.FANCY);
        const player = new Player();
        player.availableHoneycomb = hat.tier.price + 5;

        assert.equal(player.purchaseHat(hat.id), true);

        assert.equal(player.availableHoneycomb, 5);
        assert.ok(player.ownsHat(hat.id));
        assert.equal(player.equippedHat, hat.id);
    });

    test('a hat can\'t be bought without enough honeycomb, or twice', () => {
        const player = new Player();
        player.availableHoneycomb = HatTier.BASIC.price - 1;
        assert.equal(player.purchaseHat('beanie'), false);
        assert.equal(player.ownsHat('beanie'), false);

        player.availableHoneycomb = HatTier.BASIC.price * 2;
        assert.equal(player.purchaseHat('beanie'), true);
        assert.equal(player.purchaseHat('beanie'), false);
        assert.equal(player.availableHoneycomb, HatTier.BASIC.price);
    });

    test('only owned hats can be worn, and the hat can be taken off', () => {
        const player = new Player();
        player.equipHat('crown');
        assert.equal(player.equippedHat, null);

        player.availableHoneycomb = HatTier.BASIC.price;
        player.purchaseHat('beanie');
        player.equipHat(null);
        assert.equal(player.equippedHat, null);

        player.equipHat('beanie');
        assert.equal(player.equippedHat, 'beanie');
    });
});
