import { resetLocalStorage } from './setup.js';

import { beforeEach, test } from 'node:test';
import assert from 'node:assert/strict';

import { forEachAchievement, initAchievements } from '../src/player/achievements.js';
import { currentPlayer, initPlayer } from '../src/player/player.js';

resetLocalStorage();
initPlayer();
initAchievements();

/** @returns {any[]} */
function allAchievements() {
    const list = [];
    forEachAchievement(achievement => list.push(achievement));
    return list;
}

beforeEach(() => {
    resetLocalStorage();
    currentPlayer.reset();
});

test('unlocking an achievement records it in the player save and pays its honeycomb', async () => {
    const achievement = allAchievements()[0];
    const before = currentPlayer.overallStatistics.totalHoneycombCollected;

    assert.equal(await achievement.unlock(), true);

    assert.equal(achievement.unlocked, true);
    assert.equal(currentPlayer.hasAchievement(achievement.id), true);
    assert.equal(currentPlayer.overallStatistics.totalHoneycombCollected, before + achievement.rewardedHoneycomb);
    assert.deepEqual(JSON.parse(localStorage.getItem('save')).achievements, { [achievement.id]: true });
});

test('an achievement follows the current player, with nothing to reload', async () => {
    const achievement = allAchievements()[0];
    await achievement.unlock();

    currentPlayer.reset(); // replaces currentPlayer with a new, empty player

    assert.equal(achievement.unlocked, false);
});

test('an achievement already unlocked in the save isn\'t unlocked or paid again', async () => {
    const achievement = allAchievements()[0];
    currentPlayer.achievements[achievement.id] = true;
    const before = currentPlayer.overallStatistics.totalHoneycombCollected;

    await achievement.unlock();

    assert.equal(currentPlayer.overallStatistics.totalHoneycombCollected, before);
});

test('achievement ids are unique, and titles are unique', () => {
    const achievements = allAchievements();
    assert.equal(new Set(achievements.map(a => a.id)).size, achievements.length);
    assert.equal(new Set(achievements.map(a => a.name)).size, achievements.length);
});
