import { AttributeSet, LevelAttributeSet } from "./attributes.js";
import { logDebug, logError } from "./logging.js";
import { PlayerLevel } from "./player-level.js";
import { SHOP_ITEMS } from "./shop-items.js";
import { getHat } from "./hats.js";
import { DEFAULT_BEE_ATTRIBUTES, DEFAULT_LEVEL_ATTRIBUTES, DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS, GAME_SETTINGS, PRESTIGE_BONUS_RATE } from "./settings.js";
import { StatisticsSet, TimeTrialStatistics } from "./statistics.js";
import { today } from "./util.js";

const SAVE_KEY = "save";
const SAVE_KEY_BACKUP = "save_bk";

/**
 * The version of the save format written by {@link Player#toSaveObj}.
 * Version 2 stopped persisting the derived attribute sets; they are rebuilt
 * from the shop purchases on load.
 */
const SAVE_VERSION = 2;

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
         * Derived from the shop purchases, see {@link Player#rebuildAttributes}.
         * @type {AttributeSet}
         */
        this.beeAttributes = DEFAULT_BEE_ATTRIBUTES.copy();

        /**
         * Keeps track of the highest value ever achived for a given attribute
         * across all prestiges.
         * @type {AttributeSet}
         */
        this.highestBeeAttributes = DEFAULT_BEE_ATTRIBUTES.copy();

        /**
         * This is a special set of attributes which contain multipliers which are
         * in affect during a special sammy powerup.
         * Derived from the shop purchases, see {@link Player#rebuildAttributes}.
         * @type {AttributeSet}
         */
        this.sammyAttributeMultipliers = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.copy();

        /**
         * Keeps track of the highest value ever achived for the sammy attributes.
         * @type {AttributeSet}
         */
        this.highestSammyAttributeMultipliers = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.copy();

        /**
         * The current set of level attributes for the bee for the current prestige.
         * Derived from the shop purchases, see {@link Player#rebuildAttributes}.
         * @type {LevelAttributeSet}
         */
        this.levelAttributes = DEFAULT_LEVEL_ATTRIBUTES.copy();

        /**
         * Keeps track of the highest value ever achived for a given level attribute
         * across all prestiges.
         * @type {LevelAttributeSet}
         */
        this.highestLevelAttributes = DEFAULT_LEVEL_ATTRIBUTES.copy();

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
        
        /**
         * The standard shop purchases which have been purchased by the player.
         * The value represents the current level of the purchase.
         * @type {Object.<string, number>}
         */
        this.shopPurchases = { };

        /**
         * The shop purchases which have been purchased which are
         * forever purcahses - these don't reset on prestige.
         * @type {Object.<string, number>}
         */
        this.foreverShopPurchases = {};

        this.overallStatistics = new StatisticsSet();
        this.prestigeStatistics = new StatisticsSet();

        this.dailyTimeTrialStatistics = new TimeTrialStatistics();
        this.overallTimeTrailStatistics = new TimeTrialStatistics();

        /**
         * Whether or not birds explode on kill.
         * Derived from the shop purchases, see {@link Player#rebuildAttributes}.
         * @type {boolean}
         */
        this.birdsExplodeOnKill = false;

        /**
         * The ids of the hats the player has bought in the wardrobe. Hats are cosmetic
         * and are kept through prestige.
         * @type {Set<string>}
         */
        this.ownedHats = new Set();

        /**
         * The id of the hat the bee is wearing, or null for no hat. This is a player
         * choice, not derived from purchases, so it is saved directly.
         * @type {string | null}
         */
        this.equippedHat = null;

        this.markLevelAvailable(0);
        this.rebuildAttributes();
    }

    /**
     * @param {string} hatId
     * @returns {boolean}
     */
    ownsHat(hatId) {
        return this.ownedHats.has(hatId);
    }

    /**
     * Buys a hat and puts it on.
     * @param {string} hatId
     * @returns {boolean} Whether the purchase happened.
     */
    purchaseHat(hatId) {

        const hat = getHat(hatId);
        if (!hat || this.ownsHat(hatId) || (this.availableHoneycomb < hat.tier.price)) {
            return false;
        }

        this.spendHoneycomb(hat.tier.price);
        this.ownedHats.add(hatId);
        this.equippedHat = hatId;
        this.save();
        return true;
    }

    /**
     * Puts on an owned hat, or takes the hat off when given null.
     * @param {string | null} hatId
     */
    equipHat(hatId) {
        if (hatId && !this.ownsHat(hatId)) return;
        this.equippedHat = hatId;
        this.save();
    }

    /**
     * Rebuilds all attributes which are derived from shop purchases, starting from
     * the defaults and applying every shop item at its purchased level. This is the
     * single source of truth for those attributes; they are not persisted directly.
     * Also updates the 'highest' attribute tracking.
     */
    rebuildAttributes() {

        this.beeAttributes = DEFAULT_BEE_ATTRIBUTES.copy();
        this.sammyAttributeMultipliers = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.copy();
        this.levelAttributes = DEFAULT_LEVEL_ATTRIBUTES.copy();
        this.birdsExplodeOnKill = false;

        for (const [key, descriptor] of Object.entries(SHOP_ITEMS)) {
            const level = descriptor.getPurchasedLevel(this, key);
            descriptor.apply(this, descriptor.computeValue(level));
        }

        this.highestBeeAttributes = this.highestBeeAttributes.max(this.beeAttributes);
        this.highestSammyAttributeMultipliers = this.highestSammyAttributeMultipliers.max(this.sammyAttributeMultipliers);
        this.highestLevelAttributes = this.highestLevelAttributes.max(this.levelAttributes);
    }

    /**
     * Purchases the next level of a shop item.
     * @param {string} key The key of the item within SHOP_ITEMS.
     * @param {import('./shop-items.js').ShopItemDescriptor} descriptor
     * @param {number} price
     */
    purchaseShopItem(key, descriptor, price) {

        this.spendHoneycomb(price);

        const purchaseSet = descriptor.getShopPurchaseSet(this);
        purchaseSet[key] = descriptor.getPurchasedLevel(this, key) + 1;

        this.rebuildAttributes();
        this.onShopUpgradePurchased();
        this.save();
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
     * Calculates the additional prestige which would be earned if a prestige was performed now.
     * @returns {number}
     */
    calculatePotentialPrestigeEarnings() {
        return PRESTIGE_BONUS_RATE * this.prestigeStatistics.totalHoneycombCollected;
    }

    prestige() {

        this.prestigeCount += 1;
        this.lastPrestigedOn = new Date();        
        this.prestigeHoneycombMultiplier += this.calculatePotentialPrestigeEarnings();
        this.availableHoneycomb = 0;

        this.prestigeStatistics = new StatisticsSet();

        for (const [key, value] of this.levels) {
            value.onPrestige();
        }

        // Reset all standard shop purchases, forever purchases are kept.
        // The 'highest' attributes were already captured by the last rebuild.
        this.shopPurchases = { };
        this.rebuildAttributes();

        // Be sure to unlock the first level
        this.markLevelAvailable(0);

        this.save();
    }

    /**
     * Checks if the given duration is a candidate for a daily time trial record.
     * @param {number} duration 
     * @returns {boolean}
     */
    isDailyTimeTrialRecord(duration) {
        this.tryResetDailyTimeTrialStatistics();
        if (!this.dailyTimeTrialStatistics.longestDuration) return true;
        return duration > this.dailyTimeTrialStatistics.longestDuration;
    }

    /**
     * Checks if the given duration is a candidate for an overall time trial record.
     * @param {number} duration 
     * @returns {boolean}
     */
    isOverallTimeTrialRecord(duration) {
        if (!this.overallTimeTrailStatistics.longestDuration) return true;
        return duration > this.overallTimeTrailStatistics.longestDuration;
    }

    /**
     * If the daily time trial stats are not for 'today' then it resets them.
     * @param {Date} [todayDate] Defaults to today.
     */
    tryResetDailyTimeTrialStatistics(todayDate) {

        todayDate = todayDate ?? today();

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
    onStandardLevelCompleted(levelId, failed, noDamage, noSurvivors) {
        const level = this.getLevel(levelId);
        level.onLevelCompleted(failed, noDamage, noSurvivors);
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
     * @param {PlayerLevel} playerLevel
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

            saveVersion: SAVE_VERSION,

            name: this.name,
            createdOn: this.createdOn.valueOf(),
            lastPlayedOn: this.lastPlayedOn.valueOf(),
            lastSavedOn: Date.now(),

            availableHoneycomb: this.availableHoneycomb,

            // The current attribute sets are derived from the shop purchases
            // so only the 'highest' tracking needs to be persisted.
            highestBeeAttributes: this.highestBeeAttributes.toSaveObj(),
            highestSammyAttributeMultipliers: this.highestSammyAttributeMultipliers.toSaveObj(),
            highestLevelAttributes: this.highestLevelAttributes.toSaveObj(),

            prestigeCount: this.prestigeCount,
            lastPrestigedOn: this.lastPrestigedOn,
            prestigeHoneycombMultiplier: this.prestigeHoneycombMultiplier,        

            achivements: this.achivements,            
            shopPurchases: this.shopPurchases,
            foreverShopPurchases: this.foreverShopPurchases,

            ownedHats: [...this.ownedHats],
            equippedHat: this.equippedHat,

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

        this.availableHoneycomb = saveObj.availableHoneycomb ?? 0;

        // Version 1 saves also contain the current attribute sets (beeAttributes,
        // sammyAttributeMultipliers, levelAttributes, birdsExplodeOnKill). Those are
        // ignored; the attributes are rebuilt from the shop purchases below.
        this.highestBeeAttributes.loadSaveObj(saveObj.highestBeeAttributes, DEFAULT_BEE_ATTRIBUTES);
        this.highestSammyAttributeMultipliers.loadSaveObj(saveObj.highestSammyAttributeMultipliers, DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS);
        this.highestLevelAttributes.loadSaveObj(saveObj.highestLevelAttributes, DEFAULT_LEVEL_ATTRIBUTES);

        this.prestigeCount = saveObj.prestigeCount ?? 0;
        this.lastPrestigedOn = saveObj.lastPrestigedOn ? new Date(saveObj.lastPrestigedOn) : undefined;
        this.prestigeHoneycombMultiplier = saveObj.prestigeHoneycombMultiplier ?? 1;
                
        this.levels.clear();
        for (const levelIdText of Object.keys(saveObj.levels ?? {})) {
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

        this.foreverShopPurchases = { };
        if (saveObj.foreverShopPurchases) {
            for (const key of Object.keys(saveObj.foreverShopPurchases)) {
                this.foreverShopPurchases[key] = saveObj.foreverShopPurchases[key];
            }
        }

        // Ignore hats that no longer exist so a renamed or removed hat can't break the save.
        this.ownedHats = new Set((saveObj.ownedHats ?? []).filter(id => getHat(id)));
        this.equippedHat = this.ownsHat(saveObj.equippedHat) ? saveObj.equippedHat : null;

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

        // The first level must always be playable, even with a damaged save.
        this.markLevelAvailable(0);

        this.rebuildAttributes();
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