/**
 * This represents the set of core attributes we track and can maniulate on
 * most entities.
 */
export class AttributeSet {

    constructor() {
        this.speed = 0;
        this.maxHealth = 1;
        this.healthRegen = 0;
        this.fireRate = 1;
        this.damage = 1;
        this.shotCount = 1;
        this.honeycombAttraction = 0;
        this.honeycombAttractionDistance = 0;
        this.bulletSpeed = 0.1;
        this.critChance = 0;
        this.critMultiplier = 1;
        this.doubleShotChance = 0;

        /**
         * The amount of damage done when touching an entity. Generally
         * only applies when dealing damage to the bee for running into a bird.
         * @type {number}
         */
        this.touchDamage = 1;
    }

    /**
     * Creates a copy of the attribute set.
     * @returns {AttributeSet}
     */
    copy() {

        const ret = new AttributeSet();        
        for (const propertyName of Object.keys(this)) {
            ret[propertyName] = this[propertyName];
        }

        return ret;
    }

    /**
     * Returns a new set of attributes representing the maximum attribute
     * between this set and the other set.
     * @param {AttributeSet} other 
     * @returns {AttributeSet}
     */
    max(other) {

        const ret = new AttributeSet();        
        for (const propertyName of Object.keys(this)) {
            ret[propertyName] = Math.max(this[propertyName], other[propertyName]);
        }

        return ret;
    }

    /**
     * Returns a new set of attributes based on this set scaled
     * based on the given set of multipliers. Generally used for Sammy party time!
     * @param {AttributeSet} other 
     * @returns {AttributeSet}
     */
    scale(other) {
        
        const ret = new AttributeSet();        
        for (const propertyName of Object.keys(this)) {
            ret[propertyName] = this[propertyName] * other[propertyName];
        }
        
        return ret;
    }

    /**
     * Creates a bare DTO save object containing this set of attributes.
     * @returns {object}
     */
    toSaveObj() {
        return {
            speed: this.speed,
            maxHealth: this.maxHealth,
            healthRegen: this.healthRegen,
            fireRate: this.fireRate,
            damage: this.damage,
            shotCount: this.shotCount,
            honeycombAttraction: this.honeycombAttraction,
            honeycombAttractionDistance: this.honeycombAttractionDistance,
            bulletSpeed: this.bulletSpeed,
            critChance: this.critChance,
            critMultiplier: this.critMultiplier,            
            doubleShotChance: this.doubleShotChance,
            touchDamage: this.touchDamage,
        };
    }

    /**
     * Populates this set of attributes using the given save obj.
     * @param {Object} saveObj
     * @param {AttributeSet} defaults
     */
    loadSaveObj(saveObj, defaults) {

        saveObj = saveObj || {};

        this.speed = saveObj.speed || defaults.speed;
        this.maxHealth = saveObj.maxHealth || defaults.maxHealth;
        this.healthRegen = saveObj.healthRegen || defaults.healthRegen;
        this.fireRate = saveObj.fireRate || defaults.fireRate;
        this.damage = saveObj.damage || defaults.damage;
        this.shotCount = saveObj.shotCount || defaults.shotCount;
        this.honeycombAttraction = saveObj.honeycombAttraction || defaults.honeycombAttraction;
        this.honeycombAttractionDistance = saveObj.honeycombAttractionDistance || defaults.honeycombAttractionDistance;
        this.bulletSpeed = saveObj.bulletSpeed || defaults.bulletSpeed;
        this.critChance = saveObj.critChance || defaults.critChance;
        this.critMultiplier = saveObj.critMultiplier || defaults.critMultiplier;
        this.doubleShotChance = saveObj.doubleShotChance || defaults.doubleShotChance;
        this.touchDamage = saveObj.touchDamage || defaults.touchDamage;
    }
}

/**
 * This represents the set of attributes which affect general level characteristics.
 */
export class LevelAttributeSet {
    constructor() {
        
        /**
         * The default spawn chance for Sammy.
         */
        this.sammyChance = 1;

        /**
         * The default speed for Sammy.
         */
        this.sammySpeed = 1;

        /**
         * This represents the duration of the bonus effects granted by Sammy.
         */
        this.sammyDuration = 3;
    }

    /**
     * Returns a new set of attributes representing the maximum attribute
     * between this set and the other set.
     * @param {LevelAttributeSet} other 
     * @returns {LevelAttributeSet}
     */
    max(other) {

        const ret = new LevelAttributeSet();        
        for (const propertyName of Object.keys(this)) {
            ret[propertyName] = Math.max(this[propertyName], other[propertyName]);
        }

        return ret;
    }

    /**
     * Creates a copy of the attribute set.
     */
    copy() {
        
        const ret = new LevelAttributeSet();
        for (const field of Object.keys(this)) {
            ret[field] = this[field];
        }

        return ret;
    }

    /**
     * Creates a bare DTO save object containing this set of attributes.
     * @returns {object}
     */
    toSaveObj() {

        return {
            sammyChance: this.sammyChance,
            sammySpeed: this.sammySpeed,
            sammyDuration: this.sammyDuration,
        };
    }

    /**
     * Populates this set of attributes using the given save obj.
     * @param {Object} saveObj
     * @param {LevelAttributeSet} defaults
     */
    loadSaveObj(saveObj, defaults) {
        
        saveObj = saveObj || {};

        this.sammyChance = saveObj.sammyChance || defaults.sammyChance;
        this.sammySpeed = saveObj.sammySpeed || defaults.sammySpeed;
        this.sammyDuration = saveObj.sammyDuration || defaults.sammyDuration;
    }
}