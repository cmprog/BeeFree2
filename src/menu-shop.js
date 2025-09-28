import { appendChildHtml } from './html.js';
import { Menu } from './menu.js'
import { currentPlayer } from './player.js';
import { DEFAULT_BEE_ATTRIBUTES, DEFAULT_LEVEL_ATTRIBUTES, DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS } from './settings.js';
import { registerClick, Util } from './util.js';

/**
 * @typedef {object} ShopItemCanPurchaseResult
 * @property {boolean} canPurchase Whether or not the user can purchase the item.
 * @property {string} reason A user facing justification for why they cannot purchase the item.
 */

/**
 * @typedef {object} ShopItemCategory
 * @property {string} name
 * @property {string} title
 */

const ShopItemCategory = Object.freeze({
    
    /**
     * @type {ShopItemCategory}
     */
    ATTRIBUTE: { 
        name: 'Attribute',
        title: `Get Swole`,
    },

    /**
     * @type {ShopItemCategory}
     */
    SAMMY: { 
        name: 'Sammy', 
        title: `Sammy (the party animal)`,
    },

    /**
     * @type {ShopItemCategory}
     */
    PARTY_SUPPLY: { 
        name: 'Party Supply', 
        title: `Party Supplies`,
    },

    /**
     * @type {ShopItemCategory}
     */
    COSMETIC: { 
        name: 'Cosmetic', 
        title: `Cosmetics`,
    },
});

class ShopItemDescriptor {
    constructor() {
        /**
         * @type {string}
         */
        this.title = '';
        /**
         * @type {string}
         */
        this.description = '';

        /**
         * @type {ShopItemCategory}
         */
        this.category = ShopItemCategory.ATTRIBUTE;

        /**
         * Whether or not purchasing the item is 'forever' - meaning
         * it persists across prestiges.
         */
        this.isForever = false;

        /**
         * @callback ShopItemCanPurchaseCallback
         * @param {string} itemKey
         * @param {ShopItemDescriptor} descriptor
         * @param {number} nextLevel
         * @param {number} nextLevelValue
         * @returns {ShopItemCanPurchaseResult}
         */

        /**
         * Custom callback method for checking if a shop item can be purchased.
         * This is not for things like if the player has enough money (though it can
         * be used for that type of checking). Its generally intended for clamping
         * the number of purchases for things like cosmetics.
         * @type {ShopItemCanPurchaseCallback}
         */
        this.canPurchase = undefined;

        /**
         * @callback ShopItemPurchasedCallback
         * @param {string} itemKey
         * @param {ShopItemDescriptor} itemData
         * @param {number} levelKey
         * @param {number} levelData
         */

        /**
         * @type {ShopItemPurchasedCallback}
         */
        this.onPurchased = undefined;

        /**
         * @callback FormatShopItemValueCallback
         * @param {number} value The value to format.
         * @returns {string}
         */

        /**
         * @type {FormatShopItemValueCallback}
         */
        this.formatDisplayValue = undefined;

        /**
         * @type {number}
         */
        this.costBase = 0;
        /**
         * @type {number}
         */
        this.costGrowth = 0;
        /**
         * @type {number}
         */
        this.valueBase = 0;
        /**
         * @type {number}
         */
        this.valueGrowthMultiplier = 0;
    }

    /**
     * Returns the set from the player based on whether the item
     * is forever or not.
     * @type {Object.<string, number>}
     */
    getShopPurchaseSet() {
        return this.isForever 
            ? currentPlayer.foreverShopPurchases 
            : currentPlayer.shopPurchases;
    }

    /**
     * @callback ConfigureShopItemDescriptorCallback
     * @param {ShopItemDescriptor}
     */

    /**
     * @param {ConfigureShopItemDescriptorCallback} configure 
     * @returns 
     */
    static create(configure) {
        const descriptor = new ShopItemDescriptor();
        configure(descriptor);
        return descriptor;
    }
}

class ShopItemDescriptorSet {
    constructor() {

        this.BEE_SPEED = ShopItemDescriptor.create(desc => {
            desc.title = 'Bee Speed';
            desc.description = 'Work out those wings! Helps you better dodge those pesky birds and piles of poo!';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.speed = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${(value * 10).toFixed(1)} flaps per second`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.4;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.speed;
            desc.valueGrowthMultiplier = 0.025;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });         

        this.BULLET_RATE = ShopItemDescriptor.create(desc => {
            desc.title = 'Sting Rate';
            desc.description = 'Increases the rate you can shoot your stinger. It does not help with singing.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.fireRate = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${(1 / value).toFixed(2)} seconds per sting`
            };
            desc.costBase = 1;
            desc.costGrowth = 1.80;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.fireRate;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.BULLET_DAMAGE = ShopItemDescriptor.create(desc => {
            desc.title = 'Damage';
            desc.description = 'Increases how much damage is dealt by your stingers. Get them nice and sharp to take down those pesky birds.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.damage = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(1)} stinger power`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.5;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.damage;
            desc.valueGrowthMultiplier = 0.5;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.BULLET_MULTISHOT = ShopItemDescriptor.create(desc => {
            desc.title = 'Multishot';
            desc.description = 'Increase the number of stingers with each shot. Do not ask me how this works, but I\'ll bet it is painful... for the birds.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.shotCount = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(0)} stingers per shoot`
            };
            desc.costBase = 75;
            desc.costGrowth = 3;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.shotCount;
            desc.valueGrowthMultiplier = 1;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.BULLET_SPEED = ShopItemDescriptor.create(desc => {
            desc.title = 'Stinger Speed';
            desc.description = 'Makes the stingers move faster. This makes it easier to aim at those birds, especially the ones that move try to dodge.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.bulletSpeed = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(2)} ouchies per second`
            };
            desc.costBase = 10;
            desc.costGrowth = 1.6;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.bulletSpeed;
            desc.valueGrowthMultiplier = 0.025;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.HONEYCOMB_MAGNET = ShopItemDescriptor.create(desc => {
            desc.title = 'Honeycomb Magnet';
            desc.description = 'Makes honeycomb slightly more attracted to you due to your charasmatic personality making it much easier to collect more honeycomb.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.honeycombAttraction = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(2)} electro-sticky-magnitism`
            };
            desc.costBase = 10;
            desc.costGrowth = 1.70;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.honeycombAttraction;
            desc.valueGrowthMultiplier = 0.02;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.HONEYCOMB_MAGNET_DISTANCE = ShopItemDescriptor.create(desc => {
            desc.title = 'Honeycomb Magnet Distance';
            desc.description = 'Honeycomb magnet works from slightly further distances.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.honeycombAttractionDistance = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(1)} reachability`
            };
            desc.costBase = 10;
            desc.costGrowth = 1.95;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.honeycombAttractionDistance;
            desc.valueGrowthMultiplier = 0.8;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.BEE_HEALTH = ShopItemDescriptor.create(desc => {
            desc.title = 'Health';
            desc.description = 'Increases your maximum health making you more durable. It is recommended to just avoid taking damange in the first place.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.maxHealth = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(1)} hitpoints`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.1;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.maxHealth;
            desc.valueGrowthMultiplier = 1;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.BEE_HEALTH_REGEN = ShopItemDescriptor.create(desc => {
            desc.title = 'Health Regen';
            desc.description = 'Increases your natural ability to heal. Scientists are still not sure how this works.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.healthRegen = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(1)} hitpoints per second`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.2;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.healthRegen;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.CRIT_CHANCE = ShopItemDescriptor.create(desc => {
            desc.title = 'Critical Hit Chance';
            desc.description = 'Increases the chance that your hits will be critical, dealing additional damange.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.critChance = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${(value * 100).toFixed(1)}%`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.2;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.critChance;
            desc.valueGrowthMultiplier = 0.05;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.CRIT_MULTIPLIER = ShopItemDescriptor.create(desc => {
            desc.title = 'Critical Hit Multiplier';
            desc.description = '';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.beeAttributes.critMultiplier = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `x${value.toFixed(1)}`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.2;
            desc.valueBase = DEFAULT_BEE_ATTRIBUTES.critMultiplier;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.ATTRIBUTE;
        });

        this.SAMMY_CHANCE = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Chance';
            desc.description = 'Increases the likelihood of finding that wonderful Owl. I hear he likes to throw wild parties.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.levelAttributes.sammyChance = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(1)} discoverability`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.2;
            desc.valueBase = DEFAULT_LEVEL_ATTRIBUTES.sammyChance;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.SAMMY;
        });

        this.SAMMY_DURATION = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Duration';
            desc.description = 'Increases the duration of parties thrown by Sammy. There ain\'t no party like a Sammy owl party..';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.levelAttributes.sammyDuration = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(1)} seconds`
            };
            desc.costBase = 25;
            desc.costGrowth = 2;
            desc.valueBase = DEFAULT_LEVEL_ATTRIBUTES.sammyDuration;
            desc.valueGrowthMultiplier = 1;
            desc.category = ShopItemCategory.SAMMY;
        });

        this.SAMMY_SPEED = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Speed';
            desc.description = 'Slows down Sammy so that he is easier to catch so you can join his parties.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.levelAttributes.sammySpeed = DEFAULT_LEVEL_ATTRIBUTES.sammySpeed * (DEFAULT_LEVEL_ATTRIBUTES.sammySpeed / levelData);
            };
            desc.formatDisplayValue = (value) => {            
                return `${value.toFixed(1)} flaps per second`
            };
            desc.costBase = 25;
            desc.costGrowth = 1.9;
            desc.valueBase = DEFAULT_LEVEL_ATTRIBUTES.sammyDuration;
            desc.valueGrowthMultiplier = 0.01;
            desc.category = ShopItemCategory.SAMMY;
        });

        this.SAMMY_BEE_SPEED_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Bee Speed Multipler';
            desc.description = 'Increases your flying speed when Sammy is throwing a part.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.speed = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.4;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.speed;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });         

        this.SAMMY_BULLET_RATE_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Sting Rate Multiplier';
            desc.description = 'Increases your sting rate when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.fireRate = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 1;
            desc.costGrowth = 1.80;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.fireRate;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_BULLET_DAMAGE_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Damage Multiplier';
            desc.description = 'Increases your damange  when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.damage = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.5;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.damage;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_BULLET_MULTISHOT_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Multishot Multiplier';
            desc.description = 'Increases your multi-shot when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.shotCount = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 75;
            desc.costGrowth = 3;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.shotCount;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_BULLET_SPEED_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Stinger Speed Multiplier';
            desc.description = 'Increases your stinger speed when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.bulletSpeed = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 10;
            desc.costGrowth = 1.6;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.bulletSpeed;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_HONEYCOMB_MAGNET_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Honeycomb Magnet Multiplier';
            desc.description = 'Increases your honeycomb magnet strength when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.honeycombAttraction = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 10;
            desc.costGrowth = 1.42;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.honeycombAttraction;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_HONEYCOMB_MAGNET_DISTANCE_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Honeycomb Magnet Distance Multiplier';
            desc.description = 'Increases your honeycomb magnet distance when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.honeycombAttractionDistance = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 10;
            desc.costGrowth = 1.4;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.honeycombAttractionDistance;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_BEE_HEALTH_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Health Multiplier';
            desc.description = 'Increases your health when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.maxHealth = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.25;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.maxHealth;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_BEE_HEALTH_REGEN_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Health Regen Multiplier';
            desc.description = 'Increases your health regen when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.healthRegen = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.3;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.healthRegen;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_CRIT_CHANCE_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Critical Hit Chance Multiplier';
            desc.description = 'Increases your critical hit chance when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.critChance = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.45;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.critChance;
            desc.valueGrowthMultiplier = 0.05;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        this.SAMMY_CRIT_MULTIPLIER_MULTI = ShopItemDescriptor.create(desc => {
            desc.title = 'Sammy Party Critical Hit Multiplier Multiplier';
            desc.description = 'Increases how much extra damage done with a critical hit when Sammy is throwing a party.';
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.sammyAttributeMultipliers.critMultiplier = levelData;
            };
            desc.formatDisplayValue = (value) => {            
                return `${((value - 1) * 100).toFixed(0)}% bonus`
            };
            desc.costBase = 5;
            desc.costGrowth = 1.4;
            desc.valueBase = DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.critMultiplier;
            desc.valueGrowthMultiplier = 0.1;
            desc.category = ShopItemCategory.PARTY_SUPPLY;
        });

        // ===============================================================
        // COSMETICS
        // ===============================================================

        this.SOMETHING = ShopItemDescriptor.create(desc => {
            desc.title = 'Exploding Birds';
            desc.description = 'Causes the birds to explode when you shoot them. Very satisfying.';
            desc.canPurchase = (key, descriptor, nextLevel, nextLevelValue) => {
                return {
                    canPurchase: nextLevel < 2,
                    reason: 'Max Level',
                }
            },
            desc.onPurchased = (itemKey, itemData, levelKey, levelData) => {
                currentPlayer.birdsExplodeOnKill = true;
            };
            desc.formatDisplayValue = (value) => {            
                return value == 0 ? "no explosion" : 'explosiion';
            };
            desc.costBase = 5000;
            desc.costGrowth = 1.4;
            desc.valueBase = 0;
            desc.valueGrowthMultiplier = 1;
            desc.category = ShopItemCategory.COSMETIC;
            desc.isForever = true;
        });
    }
}


class ShopItem {
    constructor(shopMenu, key, data) {

        this.shopMenu = shopMenu;

        /**
         * @type {string}
         */
        this.key = key;

        /**
         * @type {ShopItemDescriptor}
         */
        this.data = data;
        
        /**
         * @type {number}
         */
        this.currentLevel = 0;

        /**
         * @type {boolean}
         */
        this.isDisabled = true;

        const templateHtml = `
            <div>
                <div class="details">
                    <div class="title">${this.data.title}</div>
                    <div class="description">${this.data.description}</div>
                </div>
                <div class="shop-item-footer">           
                    <div class="attribute-container">
                        <span>From</span>
                        <span class="attribute-value attribute-current"></span>
                        <span>to</span>
                        <span class="attribute-value attribute-next"></span>
                    </div>
                    <button type="button" class="purchase"></button>
                </div>
                
            </div>
        `;

        this.listItemEl = document.createElement('li');
        this.listItemEl.classList.add('shop-item');
        appendChildHtml(this.listItemEl, templateHtml);

        this.currentValueEl = this.listItemEl.querySelector('.attribute-value.attribute-current');
        this.nextValueEl = this.listItemEl.querySelector('.attribute-value.attribute-next');

        this.purchaseButton = this.listItemEl.querySelector('.purchase');
        registerClick(this.purchaseButton, this.onPurchaseButtonClick.bind(this));
    }

    onPurchaseButtonClick() {

        if (this.isDisabled) return;

        if (this.purchaseButtonTimeout) {

            if (this.hasAvailableHoneycomb()) {
                this.onPurchaseConfirmed();
            }
            
            return;
        }

        if (!this.hasAvailableHoneycomb()) {
            this.purchaseButton.innerText = 'not enough honeycomb'
            this.purchaseButtonTimeout = window.setTimeout(
                this.onPurchaseButtonTimeout.bind(this),
                2000,
            );
        } else {
            this.purchaseButton.innerText = 'confirm';
            this.purchaseButtonTimeout = window.setTimeout(
                this.onPurchaseButtonTimeout.bind(this),
                2000,
            );
        }        
    }

    hasAvailableHoneycomb() {
        return (currentPlayer.availableHoneycomb >= this.computePrice());
    }

    onPurchaseButtonTimeout() {
        if (this.purchaseButtonTimeout) {
            window.clearTimeout(this.purchaseButtonTimeout);
            this.purchaseButtonTimeout = undefined;
            this.refresh();
        }
    }

    computePrice(level) {
        level = level || this.currentLevel;
        return Math.trunc(this.data.costBase * Math.pow(this.data.costGrowth, level));
    }

    computeValue(level) {
        level = level || this.currentLevel;
        return this.data.valueBase + (level * this.data.valueGrowthMultiplier);
    }

    onPurchaseConfirmed() {

        this.onPurchaseButtonTimeout();
        
        const price = this.computePrice();
        currentPlayer.spendHoneycomb(price);

        this.currentLevel += 1;        
        const newValue = this.computeValue();

        const shopPurchases = this.data.getShopPurchaseSet();
        shopPurchases[this.key] = this.currentLevel;
        
        this.data.onPurchased(this.key, this.data, this.currentLevel, newValue);

        currentPlayer.onShopUpgradePurchased();
        currentPlayer.save();

        this.refresh();
        this.shopMenu.refreshAvaialbleHoneycomb();
    }

    refresh() {
        
        const shopPurchases = this.data.getShopPurchaseSet();

        if (shopPurchases && shopPurchases.hasOwnProperty(this.key)) {            
            this.currentLevel = shopPurchases[this.key];
        } else {
            this.currentLevel = 0;
        }

        const formatValue = this.data.formatDisplayValue || ((value) => value.toString());    
        
        const currentLevelValue = this.computeValue(this.currentLevel);
        const nextLevelValue = this.computeValue(this.currentLevel + 1);

        this.currentValueEl.innerText = formatValue(currentLevelValue);
        this.nextValueEl.innerText = formatValue(nextLevelValue);
           
        const canPurchase = this.data.canPurchase || (() => { return { canPurchase: true, reason: '' } });
        const canPurchaseResult = canPurchase(this.key, this.data, this.currentLevel + 1, nextLevelValue);

        this.isDisabled = !canPurchaseResult.canPurchase;
        
        Util.setClass(this.listItemEl, 'disabled', this.isDisabled);
        Util.removeAllChildren(this.purchaseButton);

        if (this.isDisabled) {
            this.purchaseButton.appendChild(document.createTextNode(canPurchaseResult.reason));
        } else {
            this.purchaseButton.appendChild(document.createTextNode(this.computePrice()));
            this.purchaseButton.appendChild(document.createElement('br'));
            this.purchaseButton.appendChild(document.createTextNode('honeycomb'));
        }
    }
}

const SHOP_ITEMS = new ShopItemDescriptorSet();

export class ShopMenu extends Menu {
    constructor() {
        super('#menu-shop')

        const menuContentEl = this.element.querySelector('.content');

        /**
         * @type {Array.<ShopItem>}
         */
        this.allShopItems = [];        

        for (const categoryKey of Object.keys(ShopItemCategory)) {

            /**
             * @type {ShopItemCategory}
             */
            const category = ShopItemCategory[categoryKey];
            
            const templateHtml = `
                <div class="section">
                    <div class="section-header">${category.title}</div>
                    <ol class="shop-item-list"></ol>
                </div>
            `;

            const sectionEl = appendChildHtml(menuContentEl, templateHtml);
            const listEl = sectionEl.querySelector('.shop-item-list');

            for (const shopDescriptorKey of Object.keys(SHOP_ITEMS)) {

                /**
                 * @type {ShopItemDescriptor}
                 */
                const descriptor = SHOP_ITEMS[shopDescriptorKey];

                if (descriptor.category != category) continue;                

                const shopItem = new ShopItem(this, shopDescriptorKey, descriptor);

                listEl.appendChild(shopItem.listItemEl);

                this.allShopItems.push(shopItem);
            }
        }
    }

    onOpening() {
        for (const shopItem of this.allShopItems) {
            shopItem.refresh();
        }

        this.refreshAvaialbleHoneycomb();
    }

    refreshAvaialbleHoneycomb(){
        const availableHoneycombEl = this.element.querySelector('.available-honeycomb');
        availableHoneycombEl.innerText = `${currentPlayer.availableHoneycomb.toFixed(1)} honeycomb available`;
    }
}