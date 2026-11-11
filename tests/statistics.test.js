import { resetLocalStorage } from './setup.js';

import { afterEach, beforeEach, describe, mock, test } from 'node:test';
import assert from 'node:assert/strict';

import { Player } from '../src/player.js';
import { PlayerLevel } from '../src/player-level.js';

beforeEach(() => resetLocalStorage());

describe('player statistics', () => {

    test('every update goes to both the overall and the current prestige statistics', () => {
        const player = new Player();

        player.onBirdKilled();
        player.onHit(3);
        player.onShotFired(2);
        player.onHoneycombCollected(10);

        for (const statistics of [player.overallStatistics, player.prestigeStatistics]) {
            assert.equal(statistics.killCount, 1);
            assert.equal(statistics.hitCount, 1);
            assert.equal(statistics.damageDealt, 3);
            assert.equal(statistics.shotCount, 1);
            assert.equal(statistics.bulletCount, 2);
            assert.equal(statistics.totalHoneycombCollected, 10);
        }
    });

    test('statistics survive a save and load', () => {
        const player = new Player();
        player.onBeeDeath();
        player.onDistanceTraveled(12.5);
        player.save();

        const loaded = new Player();
        loaded.load();

        assert.equal(loaded.overallStatistics.deathCount, 1);
        assert.equal(loaded.prestigeStatistics.distanceTraveled, 12.5);
    });
});

describe('level statistics', () => {

    test('a completed level counts toward both statistics sets', () => {
        const level = new PlayerLevel(0);
        level.markAvailable();

        level.onLevelStarted();
        level.onLevelCompleted(false, true, true);

        for (const statistics of [level.overallStatistics, level.prestigeStatistics]) {
            assert.equal(statistics.startCount, 1);
            assert.equal(statistics.completedCount, 1);
            assert.equal(statistics.noDamageCount, 1);
            assert.equal(statistics.noSurvivorsCount, 1);
            assert.equal(statistics.perfectCount, 1);
        }
    });

    test('a failed level counts as a failure, not a completion', () => {
        const level = new PlayerLevel(0);
        level.markAvailable();

        level.onLevelCompleted(true, true, true);

        assert.equal(level.overallStatistics.failureCount, 1);
        assert.equal(level.overallStatistics.completedCount, 0);
        assert.equal(level.overallStatistics.perfectCount, 0);
    });

    test('prestige clears the prestige statistics and keeps the overall ones', () => {
        const level = new PlayerLevel(0);
        level.markAvailable();
        level.onLevelStarted();

        level.onPrestige();

        assert.equal(level.prestigeStatistics.startCount, 0);
        assert.equal(level.overallStatistics.startCount, 1);
        assert.equal(level.isUnlocked, false);
    });

    test('player totals add up across levels', () => {
        const player = new Player();
        player.onLevelStarted(0);
        player.markLevelAvailable(1);
        player.onLevelStarted(1);
        player.onLevelStarted(1);

        assert.equal(player.sumLevelStats(level => level.overallStatistics.startCount), 3);
    });
});

describe('time trial records', () => {

    // Freeze the clock so "today" is under the test's control.
    const day1 = new Date(2026, 0, 10, 15, 0, 0);
    const day2 = new Date(2026, 0, 11, 9, 0, 0);

    beforeEach(() => mock.timers.enable({ apis: ['Date'], now: day1 }));
    afterEach(() => mock.timers.reset());

    test('the first run of the day is always a daily record', () => {
        const player = new Player();
        assert.equal(player.isDailyTimeTrialRecord(5), true);
        assert.equal(player.isOverallTimeTrialRecord(5), true);
    });

    test('only a longer run beats the record', () => {
        const player = new Player();
        player.onTimeTrialCompleted(30);

        assert.equal(player.isDailyTimeTrialRecord(20), false);
        assert.equal(player.isDailyTimeTrialRecord(31), true);
        assert.equal(player.isOverallTimeTrialRecord(20), false);
    });

    test('the daily record resets the next day, but the overall record doesn\'t', () => {
        const player = new Player();
        player.onTimeTrialCompleted(30);

        mock.timers.setTime(day2.getTime());

        assert.equal(player.isDailyTimeTrialRecord(10), true);
        assert.equal(player.isOverallTimeTrialRecord(10), false);

        player.onTimeTrialCompleted(10);
        assert.equal(player.dailyTimeTrialStatistics.longestDuration, 10);
        assert.equal(player.overallTimeTrialStatistics.longestDuration, 30);
    });
});
