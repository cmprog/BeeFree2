import { logDebug, logError } from "./logging.js";

const SAVE_KEY = "save";
const SAVE_KEY_BACKUP = "save_bk";

class PlayerLevel {
    constructor(id) {
        
        this.id = id;
        this.isUnlocked = false;
        this.playCount = 0;
        this.completedCount = 0;
        this.flawlessCount = 0;
        this.perfectCount = 0;
        this.failureCount = 0;
    }

    onLevelStarted() {

        if (!this.isUnlocked) {
            logError(`Level started but not unlocked.`);
        }

        this.playCount += 1;
    }

    onLevelCompleted(failed, flawless, perfect) {

        if (!this.isUnlocked) {
            logError(`Level completed but not unlocked.`);
        }

        if (failed) {
            this.failureCount += 1;

        } else {

            this.completedCount += 1;
            if (flawless) {
                this.flawlessCount += 1;
            }

            if (perfect) {
                this.perfectCount += 1;
            }
        }
        
    }

    markAvailable() {
        this.isUnlocked = true;
    }

    toSaveObj() {
        return {            
            id: this.id,
            isUnlocked: this.isUnlocked,
            playCount: this.playCount,
            completedCount: this.completedCount,
            flawlessCount: this.flawlessCount,
            perfectCount: this.perfectCount,
            failureCount: this.failureCount,
        }
    }

    loadSaveObj(saveObj) {
        
        if (saveObj.id != this.id) {
            logError(`Unexpected level id. Expected ${this.id} but got ${saveObj.id}.`);            
        }
        
        this.isUnlocked = saveObj.isUnlocked;
        this.playCount = saveObj.playCount;
        this.completedCount = saveObj.completedCount;
        this.flawlessCount = saveObj.flawlessCount;
        this.perfectCount = saveObj.perfectCount;
        this.failureCount = saveObj.failureCount;
    }
}

class Player {
    constructor() {
        
        this.name = 'Amelia';
        this.createdOn = new Date();
        this.lastPlayedOn = new Date();
        this.lastSavedOn = undefined;

        // Attributes
        this.beeSpeed = 0;
        this.beeMaxHealth = 0;
        this.beeHealthRegen = 0;
        this.beeFireRate = 0;
        this.beeDamage = 0;
        this.beeShotCount = 0;
        this.beeHoneycombAttration = 0;
        this.beeBulletSpeed = 0;

        this.levels = {};

        // Statistics
        this.availableHoneycomb = 0;
        this.totalHoneycombCollected = 0;
        this.killCount = 0;
        this.deathCount = 0;
        this.levelsStarted = 0;
        this.levelsCompleted = 0;
        this.levelsFailed = 0;
        this.perfectLevelsCompleted = 0;
        this.flawlessLevelsCompleted = 0;
        this.luckyOwlsSpawned = 0;

        this.markLevelAvailable(0);
    }

    getLevel(levelId) {
        if (!(levelId in this.levels)) {
            this.levels[levelId] = new PlayerLevel();
        }

        return this.levels[levelId];
    }

    onLevelStarted(levelId) {
        this.levelsStarted += 1;
        this.getLevel(levelId).onLevelStarted();
        this.save();
    }

    onLevelCompleted(levelId, failed, flawless, perfect) {

        const level = this.getLevel(levelId);

        if (failed) {

            this.levelsFailed += 1;

        } else {          
            
            this.levelsCompleted += 1;
            
            if (flawless) {
                this.flawlessLevelsCompleted += 1;
            }

            if (perfect) {
                this.perfectLevelsCompleted += 1;
            }
        }

        level.onLevelCompleted(failed, flawless, perfect);
        this.save();
    }

    markLevelAvailable(levelId) {
        const level = this.getLevel(levelId);
        level.markAvailable();
    }

    save() {

        logDebug(`Saving player data...`);

        // Backup the current save in case something happens
        localStorage.setItem(SAVE_KEY_BACKUP, localStorage.getItem(SAVE_KEY));

        const timestamp = new Date();

        const saveObj = {
            
            name: this.name,
            createdOn: this.createdOn,
            lastPlayedOn: this.lastPlayedOn,
            lastSavedOn: timestamp,

            beeSpeed: this.beeSpeed,
            beeMaxHealth: this.beeMaxHealth,
            beeHealthRegen: this.beeHealthRegen,
            beeFireRate: this.beeFireRate,
            beeDamage: this.beeDamage,
            beeShotCount: this.beeShotCount,
            beeHoneycombAttration: this.beeHoneycombAttration,
            beeBulletSpeed: this.beeBulletSpeed,

            // Will populate afterwards
            levels: {},

            availableHoneycomb: this.availableHoneycomb,
            totalHoneycombCollected: this.totalHoneycombCollected,
            killCount: this.killCount,
            deathCount: this.deathCount,
            levelsAttempted: this.levelsStarted,
            levelsCompleted: this.levelsCompleted,
            levelsFailed: this.levelsFailed,
            perfectLevelsCompleted: this.perfectLevelsCompleted,
            flawlessLevelsCompleted: this.flawlessLevelsCompleted,
            luckyOwlsSpawned: this.luckyOwlsSpawned,
        };

        for (const key of Object.keys(this.levels)) {
            saveObj.levels[key] = this.levels[key].toSaveObj();
        }

        localStorage.setItem(SAVE_KEY, JSON.stringify(saveObj));

        this.lastSavedOn = timestamp;

        logDebug(`Player data saved successfully!`);
    }

    load() {
        logDebug(`Loading player data...`);

        const saveObj = JSON.parse(localStorage.getItem(SAVE_KEY));
        if (!saveObj) {
            logDebug(`Save data not found.`);
            return;
        }
            
        this.name = saveObj.name;
        this.createdOn = saveObj.createdOn;
        this.lastPlayedOn = saveObj.lastPlayedOn;
        this.lastSavedOn = saveObj.lastSavedOn;

        this.beeSpeed = saveObj.beeSpeed;
        this.beeMaxHealth = saveObj.beeMaxHealth;
        this.beeHealthRegen = saveObj.beeHealthRegen;
        this.beeFireRate = saveObj.beeFireRate;
        this.beeDamage = saveObj.beeDamage;
        this.beeShotCount = saveObj.beeShotCount;
        this.beeHoneycombAttration = saveObj.beeHoneycombAttration;
        this.beeBulletSpeed = saveObj.beeBulletSpeed;

        // Clear the current levels as a new obj
        this.levels = {};
        for (const key of Object.keys(saveObj.levels)) {
            const levelObj = saveObj.levels[key];
            
            const playerLevel = new PlayerLevel(levelObj.id);
            playerLevel.loadSaveObj(levelObj);
            
            this.levels[key] = playerLevel;            
        }

        this.availableHoneycomb = saveObj.availableHoneycomb;
        this.totalHoneycombCollected = saveObj.totalHoneycombCollected;
        this.killCount = saveObj.killCount;
        this.deathCount = saveObj.deathCount;
        this.levelsStarted = saveObj.levelsAttempted;
        this.levelsCompleted = saveObj.levelsCompleted;
        this.levelsFailed = saveObj.levelsFailed;
        this.perfectLevelsCompleted = saveObj.perfectLevelsCompleted;
        this.flawlessLevelsCompleted = saveObj.flawlessLevelsCompleted;
        this.luckyOwlsSpawned = saveObj.luckyOwlsSpawned;

        logDebug(`Player data loaded successfully!`);
    }

    reset() {
        currentPlayer = new Player();
        currentPlayer.save();
    }
}

export let currentPlayer = new Player();
currentPlayer.load();