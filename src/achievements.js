import { currentPlayer } from './player.js'

class Achievement extends Medal {
    constructor(id, name, description, icon, src, data) {
        super(id, name, description, icon, src)

        // The player save is the only record of whether an achievement is unlocked, so it always
        // matches the current player, even after the save is reset. Medal's constructor just set a
        // plain unlocked = false; this replaces it. Writes are ignored: use unlock().
        Object.defineProperty(this, 'unlocked', {
            get: () => Boolean(currentPlayer?.hasAchievement(this.id)),
            set: () => { },
        });

        this.getCurrentValue = data.getCurrentValue;
        this.targetValue = data.targetValue;
        this.rewardedHoneycomb = data.rewardedHoneycomb;

        this.checkUnlock = data.checkUnlock || (() => (this.getCurrentValue() >= this.targetValue));
    }

    /**
     * The percentage progress of this achievement.
     * @returns A percent progress represented as a number between 0.0 and 1.0.
     */
    getProgress() {
        return clamp(this.getCurrentValue() / this.targetValue, 0, 1);
    }

    tryUnlock() {
        if (this.unlocked) return;
        if (this.checkUnlock()) {
            this.unlock();
        }
    }

    /**
     * Achievements are saved with the player data, not in the engine's medal save. Returning false
     * tells LittleJS that something else holds this medal, so medalsInit() never loads or
     * overwrites its unlocked state.
     * @returns {boolean}
     */
    isLocal() {
        return false;
    }

    /**
     * @returns {Promise<boolean>} Whether the achievement is unlocked, matching Medal.unlock().
     */
    unlock() {
        // default logic saves each medal in its own local storage, we want to
        // save it with the player data, so we overwrite the whole method

        if (medalsPreventUnlock || this.unlocked) return Promise.resolve(this.unlocked);

        currentPlayer.achievements[this.id] = true;

        if (this.rewardedHoneycomb) {
            currentPlayer.onHoneycombCollected(this.rewardedHoneycomb);
        }

        currentPlayer.save();

        medalsDisplayQueue.push(this);
        return Promise.resolve(true);
    }
}

/**
 * The achievements, in display order. Created by initAchievements().
 * @type {Achievement[]}
 */
let ACHIEVEMENTS = [];

/**
 * @returns {Achievement[]}
 */
function createAchievements() {
    return [

        // ****************************************************
        // Level Start
        // ****************************************************
        new Achievement(0, 'First Level', 'Started your first level.', undefined, undefined, {        
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 1,
            rewardedHoneycomb: 1,
        }),
        new Achievement(1, 'Fifth Level', 'Started 5 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 5,
            rewardedHoneycomb: 1,
        }),
        new Achievement(2, 'Tenth Level', 'Started 10 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 10,
            rewardedHoneycomb: 5,
        }),
        new Achievement(3, 'Twenty-fifth Level', 'Started 25 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 25,
            rewardedHoneycomb: 10,
        }),
        new Achievement(4, 'Fiftieth Level', 'Started 50 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 50,
            rewardedHoneycomb: 20,
        }),
        new Achievement(5, 'Hundredth Level', 'Started 100 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 100,
            rewardedHoneycomb: 25,
        }),
        new Achievement(6, 'Two-hundredth Level', 'Started 200 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 200,
            rewardedHoneycomb: 50,
        }),
        new Achievement(7, 'Five-hundredth Level', 'Started 500 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 500,
            rewardedHoneycomb: 100,
        }),
        new Achievement(8, 'Thousandth Level', 'Started 1,000 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.startCount),
            targetValue: 1000,
            rewardedHoneycomb: 200,
        }),
    
        // ****************************************************
        // Level Completion
        // ****************************************************
        new Achievement(9, 'First Level Complete', 'Completed your first level.', undefined, undefined, {        
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 1,
            rewardedHoneycomb: 1,
        }),
        new Achievement(10, 'Fifth Level Complete', 'Completed 5 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 5,
            rewardedHoneycomb: 1,
        }),
        new Achievement(11, 'Tenth Level Complete', 'Completed 10 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 10,
            rewardedHoneycomb: 5,
        }),
        new Achievement(12, 'Twenty-fifth Level Complete', 'Completed 25 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 25,
            rewardedHoneycomb: 10,
        }),
        new Achievement(13, 'Fiftieth Level Complete', 'Completed 50 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 50,
            rewardedHoneycomb: 20,
        }),
        new Achievement(14, 'Hundredth Level Complete', 'Completed 100 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 100,
            rewardedHoneycomb: 25,
        }),
        new Achievement(15, 'Two-hundredth Level Complete', 'Completed 200 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 200,
            rewardedHoneycomb: 50,
        }),
        new Achievement(16, 'Five-hundredth Level Complete', 'Completed 500 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 500,
            rewardedHoneycomb: 100,
        }),
        new Achievement(17, 'Thousandth Level Complete', 'Completed 1,000 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.completedCount),
            targetValue: 1000,
            rewardedHoneycomb: 200,
        }),
    
        // ****************************************************
        // Level Failure
        // ****************************************************
        new Achievement(18, 'First Level Failed', 'Failed your first level.', undefined, undefined, {        
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.failureCount),
            targetValue: 1,
            rewardedHoneycomb: 1,
        }),
        new Achievement(19, 'Fifth Level Failed', 'Failed 5 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.failureCount),
            targetValue: 5,
            rewardedHoneycomb: 1,
        }),
        new Achievement(20, 'Tenth Level Failed', 'Failed 10 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.failureCount),
            targetValue: 10,
            rewardedHoneycomb: 5,
        }),
        new Achievement(21, 'Twenty-fifth Level Failed', 'Failed 25 total levels.', undefined, undefined, {
            getCurrentValue: () => currentPlayer.sumLevelStats(x => x.overallStatistics.failureCount),
            targetValue: 25,
            rewardedHoneycomb: 10,
        }),
    
        // ****************************************************
        // Honeycomb Collection
        // ****************************************************
        new Achievement(22, 'Honeycomb is good', 'Collect your first honeycomb', undefined, undefined, {        
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 1,
            rewardedHoneycomb: 1,
        }),
        new Achievement(23, 'More honeycomb', 'Collect 10 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 10,
            rewardedHoneycomb: 2,
        }),
        new Achievement(24, 'Even more honeycomb', 'Collect 50 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 50,
            rewardedHoneycomb: 5,
        }),
        new Achievement(25, 'Why is it so sticky?', 'Collect 100 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 100,
            rewardedHoneycomb: 10,
        }),
        new Achievement(26, 'I want more!', 'Collect 200 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 200,
            rewardedHoneycomb: 20,
        }),
        new Achievement(27, 'Even more!', 'Collect 500 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 500,
            rewardedHoneycomb: 30,
        }),
        new Achievement(28, 'I\'m not sharing...', 'Collect 1,000 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 1000,
            rewardedHoneycomb: 40,
        }),
        new Achievement(29, 'Do bees have pockets?', 'Collect 2,000 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 2000,
            rewardedHoneycomb: 60,
        }),
        new Achievement(30, 'Fat stacks', 'Collect 5,000 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 5000,
            rewardedHoneycomb: 100,
        }),
        new Achievement(31, 'Investment fund', 'Collect 10,000 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 10000,
            rewardedHoneycomb: 300,
        }),
        new Achievement(32, 'Honey, honey, honey', 'Collect 50,000 honeycomb', undefined, undefined, {
            getCurrentValue: () => currentPlayer.overallStatistics.totalHoneycombCollected,
            targetValue: 50000,
            rewardedHoneycomb: 1000,
        }),
    ];
}

/**
 * Creates the achievements and registers them with the engine's medal system, which also shows
 * the pop-up when one unlocks. Call once at startup, after initPlayer(): each achievement reads
 * its unlocked state from the current player.
 */
export function initAchievements() {
    setMedalDisplaySize(vec2(300, 60));
    ACHIEVEMENTS = createAchievements();
    medalsInit('achievements');
}

/**
 * Calls the callback for every achievement, in order.
 * @param {(achievement: Achievement) => void} callback
 */
export function forEachAchievement(callback) {
    ACHIEVEMENTS.forEach(callback);
}

export function tryUnlockAllAchievements() {
    forEachAchievement(achievement => achievement.tryUnlock());
}