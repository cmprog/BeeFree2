import { AttributeSet, LevelAttributeSet } from "./attributes.js";
import { Bee } from "./bee.js";
import { logDebug, logError } from "./logging.js";
import { PlayerLevel } from "./player-level.js";
import { DEFAULT_BEE_ATTRIBUTES, DEFAULT_LEVEL_ATTRIBUTES, DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS } from "./settings.js";
import { SingleBulletShooting } from "./shooting.js";
import { StatisticsSet, TimeTrialStatistics } from "./statistics.js";
import { today } from "./util.js";

const SAVE_KEY = "save";
const SAVE_KEY_BACKUP = "save_bk";

export class Player {
    constructor() {
        
        this.name = 'Amelia';
        this.createdOn = new Date();
        this.lastPlayedOn = new Date();
        this.lastSavedOn = undefined;

        /**
         * The amount of available honeycomb which can be spent.
         */
        this.availableHoneycomb = 0;

        /**
         * The current set of attributes for the bee for the current prestige.
         * @type {AttributeSet}
         */
        this.beeAttributes = DEFAULT_BEE_ATTRIBUTES.copy();

        /**
         * Keeps track of the highest value ever achived for a given attribute
         * across all prestiges.
         * @type {AttributeSet}
         */
        this.highestBeeAttributes = this.beeAttributes.copy();

        /**
         * This is a special set of attributes which contain multipliers which are
         * in affect during a special sammy powerup.
         * @type {AttributeSet}
         */
        this.sammyAttributeMultipliers = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.copy();

        /**
         * Keeps track of the highest value ever achived for the sammy attributes.
         * @type {AttributeSet}
         */
        this.highestSammyAttributeMultipliers = this.sammyAttributeMultipliers.copy();
        
        /**
         * The current set of level attributes for the bee for the current prestige.
         */
        this.levelAttributes = DEFAULT_LEVEL_ATTRIBUTES.copy();

        /**
         * Keeps track of the highest value ever achived for a given level attribute
         * across all prestiges.
         * @type {LevelAttributeSet}
         */
        this.highestLevelAttributes = this.levelAttributes.copy();

        /**
         * The number of times the player has prestiged.
         * @type {number}
         */
        this.prestigeCount = 0;

        /**
         * The timestamp of the last time the player prestiged.
         * @type {Date}
         */
        this.lastPrestigedOn = undefined;

        /** 
         * The total honeycomb multipler which comes from performing a prestige.
         * @type {number}
         */
        this.prestigeHoneycombMultiplier = 1;

        /**
         * @type {Map<number, PlayerLevel>}
         */
        this.levels = new Map();
        this.achivements = {};
        this.shopPurchases = { };

        this.overallStatistics = new StatisticsSet();
        this.prestigeStatistics = new StatisticsSet();

        this.dailyTimeTrialStatistics = new TimeTrialStatistics();
        this.overallTimeTrailStatistics = new TimeTrialStatistics();

        this.markLevelAvailable(0);
    }

    /**
     * @param {number} amount 
     */
    onHoneycombCollected(amount) {
        this.availableHoneycomb += amount;
        this.overallStatistics.totalHoneycombCollected += amount;
        this.prestigeStatistics.totalHoneycombCollected += amount;
    }

    onBirdKilled(){
        this.overallStatistics.killCount += 1;
        this.prestigeStatistics.killCount += 1;
    }

    /**
     * @param {number} amount 
     */
    onDamageTaken(amount) {
        this.overallStatistics.damageTaken += amount;
        this.prestigeStatistics.damageTaken += amount;
    }

    onBeeDeath() {
        this.overallStatistics.deathCount += 1;
        this.prestigeStatistics.deathCount += 1;
    }

    /**
     * @param {number} damageDealt 
     */
    onHit(damageDealt) {
        this.overallStatistics.hitCount += 1;
        this.prestigeStatistics.hitCount += 1;

        this.overallStatistics.damageDealt += damageDealt;
        this.prestigeStatistics.damageDealt += damageDealt;
    }

    onShotFired(bulletCount) {
        this.overallStatistics.shotCount += 1;
        this.prestigeStatistics.shotCount += 1;

        this.overallStatistics.bulletCount += bulletCount;
        this.prestigeStatistics.bulletCount += bulletCount;
    }

    onSammySpawned() {
        this.overallStatistics.sammySpawnCount += 1;
        this.prestigeStatistics.sammySpawnCount += 1;
    }

    onSammyCollected() {
        this.overallStatistics.sammyCollectionCount += 1;
        this.prestigeStatistics.sammyCollectionCount += 1;
    }

    /**
     * @param {number} distance 
     */
    onDistanceTraveled(distance) {
        this.overallStatistics.distanceTraveled += distance;
        this.prestigeStatistics.distanceTraveled += distance;
    }

    onShopUpgradePurchased() {
        this.overallStatistics.shopUpgradesPurchased += 1;
        this.prestigeStatistics.shopUpgradesPurchased += 1;
    }

    onCriticalHit() {
        this.overallStatistics.criticalHitCount += 1;
        this.prestigeStatistics.criticalHitCount += 1;
    }

    onTimeTrialStarted() {
        this.overallStatistics.timeTrialLevelsStarted += 1;
        this.prestigeStatistics.timeTrialLevelsStarted += 1;

        this.tryResetDailyTimeTrialStatistics(today());

        this.dailyTimeTrialStatistics.startCount += 1;
        this.overallTimeTrailStatistics.startCount += 1;        
    }

    /**
     * @param {number} duration 
     */
    onTimeTrialCompleted(duration) {
        
        const todayDate = today();
        this.tryResetDailyTimeTrialStatistics(todayDate);
        
        this.dailyTimeTrialStatistics.tryUpdate(todayDate, duration);
        this.overallTimeTrailStatistics.tryUpdate(todayDate, duration);
    }

    /**
     * If the daily time trial stats are not for 'today' then it resets them.
     * @param {Date} todayDate
     */
    tryResetDailyTimeTrialStatistics(todayDate) {

        // Nothing to do if the daily stats are not defined
        if (!this.dailyTimeTrialStatistics.longestDate) {
            return false;
        }

        if (this.dailyTimeTrialStatistics.longestDate.valueOf() != todayDate.valueOf()) {
            this.dailyTimeTrialStatistics.reset();
            return true;
        }

        return false;
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
        if (!this.levels.has(levelId)) {
            this.levels.set(levelId, new PlayerLevel(levelId));
        }

        return this.levels.get(levelId);
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
    onStandardLevelCompleted(levelId, failed, noDamage, perfect) {
        const level = this.getLevel(levelId);
        level.onLevelCompleted(failed, noDamage, perfect);
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

    /**
     * @callback LevelSelectorCallback
     * @param {PlayerLevel}
     * @returns {number}
     */

    /**
     * Sums the level statistics using a selection function for the specific statistic value.
     * @param {LevelSelectorCallback} levelSelector 
     * @returns {number}
     */
    sumLevelStats(levelSelector) {
        let total = 0;
        this.levels.forEach(value => {
            total += levelSelector(value);
        });
        return total;
    }

    /**
     * Creates a bare DTO save object containing the player data.
     */
    toSaveObj() {

        const saveObj = {
            
            name: this.name,
            createdOn: this.createdOn.valueOf(),
            lastPlayedOn: this.lastPlayedOn.valueOf(),
            lastSavedOn: Date.now(),

            availableHoneycomb: this.availableHoneycomb,

            beeAttributes: this.beeAttributes.toSaveObj(),
            highestBeeAttributes: this.highestBeeAttributes.toSaveObj(),
            
            sammyAttributeMultipliers: this.sammyAttributeMultipliers.toSaveObj(),
            sammyAttributeMultipliers: this.sammyAttributeMultipliers.toSaveObj(),
            
            levelAttributes: this.levelAttributes.toSaveObj(),
            highestLevelAttributes: this.highestLevelAttributes.toSaveObj(),

            prestigeCount: this.prestigeCount,
            lastPrestigedOn: this.lastPrestigedOn,
            prestigeHoneycombMultiplier: this.prestigeHoneycombMultiplier,        

            achivements: this.achivements,            
            shopPurchases: this.shopPurchases,

            overallStatistics: this.overallStatistics.toSaveObj(),
            prestigeStatistics: this.prestigeStatistics.toSaveObj(),

            dailyTimeTrialStatistics: this.dailyTimeTrialStatistics.toSaveObj(),
            overallTimeTrailStatistics: this.overallTimeTrailStatistics.toSaveObj(),
        };

        saveObj.levels = {};
        for (const [key, value] of this.levels) {
            saveObj.levels[key] = value.toSaveObj();
        }

        return saveObj;
    }

    save() {

        logDebug(`Saving player data...`);

        // Backup the current save in case something happens
        localStorage.setItem(SAVE_KEY_BACKUP, localStorage.getItem(SAVE_KEY));

        const saveObj = this.toSaveObj();
        localStorage.setItem(SAVE_KEY, JSON.stringify(saveObj));

        this.lastSavedOn = new Date(saveObj.lastSavedOn);

        logDebug(`Player data saved successfully!`);
    }

    /**
     * Loads the player state from the given save object.
     * @param {Object} saveObj 
     */
    loadSaveObj(saveObj) {

        // ********************************************************
        // CARE SHOULD BE HAD TO ENSURE WE CAN LOAD OLD SAVES
        // ********************************************************
            
        this.name = saveObj.name || 'Amelia';
        this.createdOn = new Date(saveObj.createdOn || Date.now());
        this.lastPlayedOn = new Date(saveObj.lastPlayedOn || Date.now());
        this.lastSavedOn = new Date(saveObj.lastSavedOn || Date.now());

        this.availableHoneycomb = saveObj.availableHoneycomb || 0;
        
        this.beeAttributes.loadSaveObj(saveObj.beeAttributes, DEFAULT_BEE_ATTRIBUTES);
        this.highestBeeAttributes.loadSaveObj(saveObj.highestBeeAttributes, this.beeAttributes);
        
        this.sammyAttributeMultipliers.loadSaveObj(saveObj.sammyAttributeMultipliers, DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS);
        this.highestSammyAttributeMultipliers.loadSaveObj(saveObj.highestSammyAttributeMultipliers, this.sammyAttributeMultipliers);
        
        this.levelAttributes.loadSaveObj(saveObj.levelAttributes, DEFAULT_LEVEL_ATTRIBUTES);
        this.highestLevelAttributes.loadSaveObj(saveObj.highestLevelAttributes, this.levelAttributes);

        this.prestigeCount = saveObj.prestigeCount || 0;
        this.lastPrestigedOn = saveObj.lastPrestigedOn ? new Date(saveObj.lastPrestigedOn) : undefined;
        this.prestigeHoneycombMultiplier = saveObj.prestigeHoneycombMultiplier;
                
        this.levels.clear();
        for (const levelIdText of Object.keys(saveObj.levels)) {
            const levelObj = saveObj.levels[levelIdText];
            
            const playerLevel = new PlayerLevel(levelObj.id);
            playerLevel.loadSaveObj(levelObj);
            
            this.levels.set(levelObj.id, playerLevel);         
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

        this.overallStatistics.loadSaveObj(saveObj.overallStatistics);
        this.prestigeStatistics.loadSaveObj(saveObj.prestigeStatistics);

        this.dailyTimeTrialStatistics.loadSaveObj(saveObj.dailyTimeTrialStatistics);
        this.overallTimeTrailStatistics.loadSaveObj(saveObj.overallTimeTrailStatistics);
    }

    load() {
        logDebug(`Loading player data...`);

        const saveObjText = localStorage.getItem(SAVE_KEY);
        if (!saveObjText) {
            logDebug(`Save data not found.`);
            return;
        }

        const saveObj = JSON.parse(saveObjText);
        if (!saveObj) {
            logDebug(`Save data not found.`);
            return;
        }

        this.loadSaveObj(saveObj);

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