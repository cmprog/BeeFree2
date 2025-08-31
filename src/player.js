import { Bee } from "./bee.js";
import { logDebug, logError } from "./logging.js";
import { PlayerLevel } from "./player-level.js";
import { DEFAULT_ATTRIBUTE_VALUES } from "./settings.js";
import { SingleBulletShooting } from "./shooting.js";

const SAVE_KEY = "save";
const SAVE_KEY_BACKUP = "save_bk";


class Player {
    constructor() {
        
        this.name = 'Amelia';
        this.createdOn = new Date();
        this.lastPlayedOn = new Date();
        this.lastSavedOn = undefined;

        // Attributes
        this.beeSpeed = DEFAULT_ATTRIBUTE_VALUES.BEE_SPEED;
        this.beeMaxHealth = DEFAULT_ATTRIBUTE_VALUES.BEE_MAX_HEALTH;
        this.beeHealthRegen = DEFAULT_ATTRIBUTE_VALUES.BEE_HEALTH_REGEN;
        this.beeFireRate = DEFAULT_ATTRIBUTE_VALUES.BEE_FIRE_RATE;
        this.beeDamage = DEFAULT_ATTRIBUTE_VALUES.BEE_DAMAGE;
        this.beeShotCount = DEFAULT_ATTRIBUTE_VALUES.BEE_SHOT_COUNT;
        this.beeHoneycombAttration = DEFAULT_ATTRIBUTE_VALUES.BEE_HONEYCOMB_ATTRACTION;
        this.beeHoneycombAttrationDistance = DEFAULT_ATTRIBUTE_VALUES.BEE_HONEYCOMB_ATTRACTION_DISTANCE;
        this.beeBulletSpeed = DEFAULT_ATTRIBUTE_VALUES.BEE_BULLET_SPEED;
        this.beeCritChance = DEFAULT_ATTRIBUTE_VALUES.BEE_CRIT_CHANCE;
        this.beeCritMultiplier = DEFAULT_ATTRIBUTE_VALUES.BEE_CRIT_MULTIPLER;
        this.sammyChance = DEFAULT_ATTRIBUTE_VALUES.SAMMY_CHANCE;

        /**
         * The number of times the player has prestiged.
         * @type {number}
         */
        this.prestigeCount = 0;

        /** 
         * The total honeycomb multipler which comes from performing a prestige.
         * @type {number}
         */
        this.prestigeHoneycombMultiplier = 1;

        /**
         * The date of the longest time trial ever completed.
         * @type {Date}
         */
        this.longestGlobalTimeTrialDate = undefined;

        /**
         * The duration (in seconds) of the longest time trial ever completed.
         * @type {number}
         */
        this.longestGlobalTimeTrialDuration = undefined;

        /**
         * The date of the current time trial. This is needed so we know if the current time trial duration is old.
         * @type {Date}
         */
        this.longestCurrentTimeTrialDate = undefined

        /**
         * The duration (in seconds) of the longest time trial for the current date.
         * @type {number}
         */
        this.longestCurrentTimeTrialDuration = undefined

        this.levels = {};
        this.achivements = {};

        // Statistics
        this.availableHoneycomb = 0;
        this.totalHoneycombCollected = 0;
        this.killCount = 0;
        this.deathCount = 0;
        this.shotCount = 0;
        this.bulletCount = 0;
        this.luckyOwlSpawnCount = 0;
        this.luckyOwlCollectCount = 0;
        this.distanceTraveled = 0;

        this.prestigeKillCount = 0;
        this.prestigeDeathCount = 0;        
        this.prestigeShotCount = 0;
        this.prestigeBulletCount = 0;
        this.prestigeLuckeyOwlSpawnCount = 0;
        this.prestigeLuckeyOwlCollectCount = 0;
        this.prestigeDistanceTraveled = 0;

        this.shopPurchases = { };

        this.markLevelAvailable(0);
    }

    collectHoneycomb(amount) {
        this.availableHoneycomb += amount;
        this.totalHoneycombCollected += amount;
    }

    spendHoneycomb(amount) {
        this.availableHoneycomb -= amount;
    }

    /**
     * Gets the player level for the given level id. If the level doesn't exist then it is created.
     * @param {number} levelId 
     * @returns {PlayerLevel}
     */
    getLevel(levelId) {
        if (!(levelId in this.levels)) {
            this.levels[levelId] = new PlayerLevel();
        }

        return this.levels[levelId];
    }

    onLevelStarted(levelId) {
        this.levelsStartCount += 1;
        this.getLevel(levelId).onLevelStarted();
        this.save();
    }


    /**
     * Signals that a level was completed - updates stats.
     * @param {number} levelId 
     * @param {boolean} failed 
     * @param {boolean} noDamage 
     * @param {boolean} noSurvivors 
     */
    onLevelCompleted(levelId, failed, flawless, perfect) {


        if (failed) {

            this.levelsFailureCount += 1;

        } else {          
            
            this.levelsCompletedCount += 1;
            
            if (flawless) {
                this.flawlessLevelsCompleted += 1;
            }

            if (perfect) {
                this.perfectLevelsCompleted += 1;
            }
        }

        const level = this.getLevel(levelId);
        level.onLevelCompleted(failed, flawless, perfect);
        this.save();
    }

    markLevelAvailable(levelId) {
        const level = this.getLevel(levelId);
        level.markAvailable();
    }

    /**
     * Checks if the player has unlocked the given achivement.
     * @param {number} id The id of the achivement.
     * @returns Boolean whether or not the player has the given achivement.
     */
    hasAchivement(id) {
        return (id in this.achivements) && this.achivements[id];
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
            beeHoneycombAttrationDistance: this.beeHoneycombAttrationDistance,
            beeBulletSpeed: this.beeBulletSpeed,
            beeCritChance: this.beeCritChance,
            beeCritMultiplier: this.beeCritMultiplier,
            sammyChance: this.sammyChance,

            // Will populate afterwards
            levels: {},            

            achivements: this.achivements,            
            shopPurchases: this.shopPurchases,

            availableHoneycomb: this.availableHoneycomb,
            totalHoneycombCollected: this.totalHoneycombCollected,
            killCount: this.killCount,
            deathCount: this.deathCount,
            levelsAttempted: this.levelsStartCount,
            levelsCompleted: this.levelsCompletedCount,
            levelsFailed: this.levelsFailureCount,
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

        this.beeSpeed = saveObj.beeSpeed || DEFAULT_ATTRIBUTE_VALUES.BEE_SPEED;
        this.beeMaxHealth = saveObj.beeMaxHealth || DEFAULT_ATTRIBUTE_VALUES.BEE_MAX_HEALTH;
        this.beeHealthRegen = saveObj.beeHealthRegen || DEFAULT_ATTRIBUTE_VALUES.BEE_HEALTH_REGEN;
        this.beeFireRate = saveObj.beeFireRate || DEFAULT_ATTRIBUTE_VALUES.BEE_FIRE_RATE;
        this.beeDamage = saveObj.beeDamage || DEFAULT_ATTRIBUTE_VALUES.BEE_DAMAGE;
        this.beeShotCount = saveObj.beeShotCount || DEFAULT_ATTRIBUTE_VALUES.BEE_SHOT_COUNT;
        this.beeHoneycombAttration = saveObj.beeHoneycombAttration || DEFAULT_ATTRIBUTE_VALUES.BEE_HONEYCOMB_ATTRACTION;
        this.beeHoneycombAttrationDistance = saveObj.beeHoneycombAttrationDistance || DEFAULT_ATTRIBUTE_VALUES.BEE_HONEYCOMB_ATTRACTION_DISTANCE;
        this.beeBulletSpeed = saveObj.beeBulletSpeed || DEFAULT_ATTRIBUTE_VALUES.BEE_BULLET_SPEED;
        this.beeCritChance = saveObj.beeCritChance || DEFAULT_ATTRIBUTE_VALUES.BEE_CRIT_CHANCE;
        this.beeCritMultiplier = saveObj.beeCritMultiplier || DEFAULT_ATTRIBUTE_VALUES.BEE_CRIT_MULTIPLER;
        this.sammyChance = saveObj.sammyChance || DEFAULT_ATTRIBUTE_VALUES.SAMMY_CHANCE;

        // Clear the current levels as a new obj
        this.levels = {};
        for (const key of Object.keys(saveObj.levels)) {
            const levelObj = saveObj.levels[key];
            
            const playerLevel = new PlayerLevel(levelObj.id);
            playerLevel.loadSaveObj(levelObj);
            
            this.levels[key] = playerLevel;            
        }

        this.shopPurchases = { };
        if (saveObj.shopPurchases) {            
            for (const key of Object.keys(saveObj.shopPurchases)) {
                this.shopPurchases[key] = saveObj.shopPurchases[key];
            }
        }

        this.achivements = { };
        if (saveObj.achivements) {            
            for (const key of Object.keys(saveObj.achivements)) {
                this.achivements[key] = saveObj.achivements[key];
            }
        }

        this.availableHoneycomb = saveObj.availableHoneycomb;
        this.totalHoneycombCollected = saveObj.totalHoneycombCollected;
        this.killCount = saveObj.killCount;
        this.deathCount = saveObj.deathCount;
        this.levelsStartCount = saveObj.levelsAttempted;
        this.levelsCompletedCount = saveObj.levelsCompleted;
        this.levelsFailureCount = saveObj.levelsFailed;
        this.perfectLevelsCompleted = saveObj.perfectLevelsCompleted;
        this.flawlessLevelsCompleted = saveObj.flawlessLevelsCompleted;
        this.luckyOwlsSpawned = saveObj.luckyOwlsSpawned;

        medalsForEach(m => m.reload());

        logDebug(`Player data loaded successfully!`);
    }

    reset() {
        currentPlayer = new Player();
        currentPlayer.save();        
        medalsForEach(m => m.reload());
    }
}

export let currentPlayer = new Player();
currentPlayer.load();