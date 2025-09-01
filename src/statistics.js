export class StatisticsSet {
    constructor() {
        
        this.totalHoneycombCollected = 0;
        this.killCount = 0;
        this.deathCount = 0;
        this.shotCount = 0;
        this.bulletCount = 0;
        this.sammySpawnCount = 0;
        this.sammyCollectionCount = 0;
        this.distanceTraveled = 0;
        this.shopUpgradesPurchased = 0;      
        this.criticalHitCount = 0;

        /**
         * The total number of times a time trial level was stated.
         * @type {number}
         */
        this.timeTrialLevelsStarted = 0;

        /**
         * The total amount of damange taken.
         */
        this.damageTaken = 0;

        /**
         * The total amount of damage dealt.
         * @type {number}
         */
        this.damageDealt = 0;

        /**
         * The amount of bullets which have hit a target.
         * @type {number}
         */
        this.hitCount = 0;
    }

    /**
     * Creates a bare DTO save object representing this set of stats.
     * @returns {object}
     */
    toSaveObj() {

        return {
            totalHoneycombCollected: this.totalHoneycombCollected,
            killCount: this.killCount,
            deathCount: this.deathCount,
            shotCount: this.shotCount,
            bulletCount: this.bulletCount,
            sammySpawnCount: this.sammySpawnCount,
            sammyCollectionCount: this.sammyCollectionCount,
            distanceTraveled: this.distanceTraveled,
            shopUpgradesPurchased: this.shopUpgradesPurchased,
            criticalHitCount: this.criticalHitCount,
            timeTrialLevelsStarted: this.timeTrialLevelsStarted,
            damageDealt: this.damageDealt,
            hitCount: this.hitCount,
            damageTaken: this.damageTaken,
        };
    }

    /**
     * Populates this set of stats using the given save obj.
     * @param {Object} saveObj
     */
    loadSaveObj(saveObj) {

        saveObj = saveObj || {};

        this.totalHoneycombCollected = saveObj.totalHoneycombCollected || 0;
        this.killCount = saveObj.killCount || 0;
        this.deathCount = saveObj.deathCount || 0;
        this.shotCount = saveObj.shotCount || 0;
        this.bulletCount = saveObj.bulletCount || 0;
        this.sammySpawnCount = saveObj.sammySpawnCount || 0;
        this.sammyCollectionCount = saveObj.sammyCollectionCount || 0;
        this.distanceTraveled = saveObj.distanceTraveled || 0;
        this.shopUpgradesPurchased = saveObj.shopUpgradesPurchased || 0;
        this.criticalHitCount = saveObj.criticalHitCount || 0;
        this.timeTrialLevelsStarted = saveObj.timeTrialLevelsStarted || 0;
        this.longestGlobalTimeTrialDate = saveObj.longestGlobalTimeTrialDate || 0;
        this.longestGlobalTimeTrialDuration = saveObj.longestGlobalTimeTrialDuration || 0;  
        this.damageDealt = saveObj.damageDealt || 0;
        this.hitCount = saveObj.hitCount || 0;   
        this.damageTaken = saveObj.damageTaken || 0;   
    }
}

export class StandardLevelStatistics {
    constructor() {
        
        /**
         * The number of times the level was started.
         * @type {number}
         */
        this.startCount = 0;
        /**
         * The number of times the level was completed.
         * @type {number}
         */
        this.completedCount = 0;
        /**
         * The number of times the level was failed.
         * @type {number}
         */
        this.failureCount = 0;
        /**
         * The number of times the level was completed without taking damage.
         * @type {number}
         */
        this.noDamangeCount = 0;
        /**
         * The number of times the level was completed without any survivors.
         * @type {number}
         */
        this.noSurvivorsCount = 0;    
        /**
         * The number of times the level was completed perfected (no damage or survirors).
         * @type {number}
         */
        this.perfectCount = 0;        
    }

    /**
     * Creates a bare DTO save object representing this set of stats.
     * @returns {object}
     */
    toSaveObj() {

        return {
            startCount: this.startCount,
            completedCount: this.completedCount,
            failureCount: this.failureCount,
            noDamangeCount: this.noDamangeCount,
            noSurvivorsCount: this.noSurvivorsCount,
            perfectCount: this.perfectCount,
        };
    }

    /**
     * Populates this set of stats using the given save obj.
     * @param {Object} saveObj
     */
    loadSaveObj(saveObj) {

        saveObj = saveObj || {};

        this.startCount = saveObj.startCount || 0;
        this.completedCount = saveObj.completedCount || 0;
        this.failureCount = saveObj.failureCount || 0;
        this.noDamangeCount = saveObj.noDamangeCount || 0;
        this.noSurvivorsCount = saveObj.noSurvivorsCount || 0;
        this.perfectCount = saveObj.perfectCount || 0;
    }
}

export class TimeTrialStatistics {

    constructor() {       
        /**
         * The total number of times a time trial level was stated.
         * @type {number}
         */
        this.startCount = 0;

        /**
         * The date of the longest longest duration time trial.
         * @type {Date}
         */
        this.longestDate = undefined;

        /**
         * The duration (in seconds) of the longest time trial.
         * @type {number}
         */
        this.longestDuration = undefined;
    }

    /**
     * Resets the statistics back to their default values.
     */
    reset() {
        this.startCount = 0;
        this.longestDate = undefined;
        this.longestDuration = undefined;
    }

    /**
     * Tries to update the statistics based on the given stats.
     * @param {Date} todayDate 
     * @param {number} duration 
     * @returns {boolean}
     */
    tryUpdate(todayDate, duration) {

        if (!this.longestDuration || (duration > this.longestDuration)) {
            this.longestDate = todayDate;
            this.longestDuration = duration;
            return true;
        }

        return false;
    }

    /**
     * Creates a bare DTO save object representing this set of stats.
     * @returns {object}
     */
    toSaveObj() {

        return {
            startCount: this.startCount,
            longestDate: this.longestDate && this.longestDate.valueOf(),
            longestDuration: this.longestDuration,
        };
    }

    /**
     * Populates this set of stats using the given save obj.
     * @param {Object} saveObj
     */
    loadSaveObj(saveObj) {
        
        saveObj = saveObj || {};

        this.startCount = saveObj.startCount || 0;        
        this.longestDate = saveObj.longestDate? new Date(saveObj.longestDate) : undefined;
        this.longestDuration = saveObj.longestDuration || 0;
    }
}