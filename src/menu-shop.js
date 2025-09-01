import { appendChildHtml } from './html.js';
import { Menu } from './menu.js'
import { currentPlayer } from './player.js';
import { DEFAULT_BEE_ATTRIBUTES } from './settings.js';
import { registerClick } from './util.js';

const SHOP_ITEMS = {    
    BEE_SPEED: {
        title: 'Bee Speed',
        description: 'Work out those wings! Helps you better dodge those pesky birds and piles of poo!',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeSpeed = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${(value * 10).toFixed(1)} flaps per second`
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_SPEED,
        valueGrowthMultiplier: 0.025,
    },

    BULLET_RATE: {
        title: 'Sting Rate',
        description: 'Increases the rate you can shoot your stinger. It does not help with singing.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeFireRate = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${(1 / value).toFixed(2)} seconds per sting`
        },
        costBase: 1,
        costGrowth: 1.80,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_FIRE_RATE,        
        valueGrowthMultiplier: 0.1,
    },

    BULLET_DAMAGE: {
        title: 'Damage',
        description: 'Increases how much damage is dealt by your stingers. Get them nice and sharp to take down those pesky birds.',        
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeDamage = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${value.toFixed(1)} stinger power`
        },
        costBase: 5,
        costGrowth: 1.5,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_DAMAGE,
        valueGrowthMultiplier: 0.5,
    },

    BULLET_MULTISHOT: {
        title: 'Multishot',
        description: 'Increase the number of stingers with each shot. Do not ask me how this works, but I\'ll bet it is painful... for the birds.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeShotCount = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${value.toFixed(0)} stingers per shoot`
        },
        costBase: 75,
        costGrowth: 3,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_SHOT_COUNT,
        valueGrowthMultiplier: 1,
    },

    BULLET_SPEED: {
        title: 'Stinger Speed',
        description: 'Makes the stingers move faster. This makes it easier to aim at those birds, especially the ones that move try to dodge.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeBulletSpeed = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${value.toFixed(2)} ouchies per second`
        },
        costBase: 5,
        costGrowth: 1.20,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_BULLET_SPEED,
        valueGrowthMultiplier: 0.06,
    },

    HONEYCOMB_MAGNET: {
        title: 'Homeycomb Magnet',
        description: 'Makes honeycomb slightly more attracted to you due to your charasmatic personality making it much easier to collect more honeycomb.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHoneycombAttration = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${value.toFixed(2)} electro-sticky-magnitism`
        },
        costBase: 5,
        costGrowth: 1.30,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_HONEYCOMB_ATTRACTION,
        valueGrowthMultiplier: 0.01,
    },

    HONEYCOMB_MAGNET_DISTANCE: {
        title: 'Homeycomb Magnet Distance',
        description: 'Honeycomb magnet works from slightly further distances.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHoneycombAttrationDistance = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${value.toFixed(1)} reachability`
        },
        costBase: 10,
        costGrowth: 1.6,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_HONEYCOMB_ATTRACTION_DISTANCE,
        valueGrowthMultiplier: 0.3,
    },

    BEE_HEALTH: {
        title: 'Health',
        description: 'Increases your maximum health making you more durable. It is recommended to just avoid taking damange in the first place.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeMaxHealth = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${value.toFixed(1)} hitpoints`
        },
        costBase: 5,
        costGrowth: 1.1,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_MAX_HEALTH,
        valueGrowthMultiplier: 1,
    },

    BEE_HEALTH_REGEN: {
        title: 'Health Regen',
        description: 'Increases your natural ability to heal. Scientists are still not sure how this works.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${value.toFixed(1)} hitpoints per second`
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_HEALTH_REGEN,
        valueGrowthMultiplier: 0.1,
    },

    CRIT_CHANCE: {
        title: 'Critical Hit Chance',
        description: 'Increases the chance that your hits will be critical, dealing additional damange.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${(value * 100).toFixed(1)}%`
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_CRIT_CHANCE,
        valueGrowthMultiplier: 0.05,
    },

    CRIT_MULTIPLIER: {
        title: 'Critical Hit Multiplier',
        description: '',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen = levelData;
        },
        formatDisplayValue: (value) => {            
            return `x${value.toFixed(1)}`
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_BEE_ATTRIBUTES.BEE_CRIT_MULTIPLER,
        valueGrowthMultiplier: 0.1,
    },

    SAMMY_CHANCE: {
        title: 'Sammy Chance',
        description: '',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen = levelData;
        },
        formatDisplayValue: (value) => {            
            return `${value.toFixed(1)} discoverability`
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_BEE_ATTRIBUTES.SAMMY_CHANCE,
        valueGrowthMultiplier: 0.1,
    },
}

class ShopItem {
    constructor(shopMenu, key, data) {

        this.shopMenu = shopMenu;

        this.key = key;
        this.data = data;
        this.currentLevel = 0;

        const templateHtml = `
            <div class="shop-item">
                <img />
                <div class="details">
                    <div class="title">${this.data.title}</div>
                    <div class="description">${this.data.description}</div>
                    <div class="attribute-container">
                        <span>From</span>
                        <span class="attribute-value attribute-current"></span>
                        <span>to</span>
                        <span class="attribute-value attribute-next"></span>
                    </div>
                </div>
                <button type="button" class="purchase"></button>
            </div>
        `;

        this.listItemEl = document.createElement('li');
        appendChildHtml(this.listItemEl, templateHtml);

        this.currentValueEl = this.listItemEl.querySelector('.attribute-value.attribute-current');
        this.nextValueEl = this.listItemEl.querySelector('.attribute-value.attribute-next');

        this.purchaseButton = this.listItemEl.querySelector('.purchase');
        registerClick(this.purchaseButton, this.onPurchaseButtonClick.bind(this));
    }

    onPurchaseButtonClick() {

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
        currentPlayer.shopPurchases[this.key] = this.currentLevel;
        this.data.onPurchased(this.key, this.data, this.currentLevel, newValue);

        currentPlayer.save();

        this.refresh();
        this.shopMenu.refreshAvaialbleHoneycomb();
    }

    refresh() {

        if (currentPlayer.shopPurchases && currentPlayer.shopPurchases.hasOwnProperty(this.key)) {            
            this.currentLevel = currentPlayer.shopPurchases[this.key];
        } else {
            this.currentLevel = 0;
        }

        const formatValue = this.data.formatDisplayValue || ((value) => value.toString());        

        this.currentValueEl.innerText = formatValue(this.computeValue(this.currentLevel));
        this.nextValueEl.innerText = formatValue(this.computeValue(this.currentLevel + 1));
            
        while (this.purchaseButton.firstChild) {
            this.purchaseButton.removeChild(this.purchaseButton.lastChild);
        }
        
        this.purchaseButton.appendChild(document.createTextNode(this.computePrice()));
        this.purchaseButton.appendChild(document.createElement('br'));
        this.purchaseButton.appendChild(document.createTextNode('honeycomb'));
    }
}

export class ShopMenu extends Menu {
    constructor() {
        super('#menu-shop')

        const itemsListEl = this.element.querySelector('.items');
        this.shopItems = [];

        for (const shopItemKey of Object.keys(SHOP_ITEMS)) {

            const shopItemData = SHOP_ITEMS[shopItemKey];
            const shopItem = new ShopItem(this, shopItemKey, shopItemData);

            itemsListEl.appendChild(shopItem.listItemEl);

            this.shopItems.push(shopItem);
        }
    }

    onOpening() {
        for (const shopItem of this.shopItems) {
            shopItem.refresh();
        }

        this.refreshAvaialbleHoneycomb();
    }

    refreshAvaialbleHoneycomb(){
        const availableHoneycombEl = this.element.querySelector('.available-honeycomb');
        availableHoneycombEl.innerText = `${currentPlayer.availableHoneycomb} honeycomb`;
    }
}