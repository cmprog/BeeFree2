import { Menu } from './menu.js'
import { currentPlayer } from './player.js';
import { DEFAULT_ATTRIBUTE_VALUES } from './settings.js';
import { registerClick } from './util.js';

const SHOP_ITEMS = {    
    BEE_SPEED: {
        title: 'Bee Speed',
        description: 'Work out those wings! Helps you better dodge those pesky birds and piles of poo!',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeSpeed = levelData;
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_SPEED,
        valueGrowthMultiplier: 0.025,
    },

    BULLET_RATE: {
        title: 'Sing Rate',
        description: 'Increases the rate you can shoot your stinger.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeFireRate = levelData;
        },
        costBase: 1,
        costGrowth: 1.80,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_FIRE_RATE,        
        valueGrowthMultiplier: 1.1,
    },

    BULLET_DAMAGE: {
        title: 'Damage',
        description: 'Increases how much damage is dealt by your stingers. Get them nice and sharp to take down those pesky birds.',        
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeDamage = levelData;
        },
        costBase: 5,
        costGrowth: 1.5,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_DAMAGE,
        valueGrowthMultiplier: 0.5,
    },

    BULLET_MULTISHOT: {
        title: 'Multishot',
        description: 'Increase the number of stingers with each shot. Do not ask me how this works, but I\'ll bet it is painful... for the birds.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeShotCount = levelData;
        },
        costBase: 75,
        costGrowth: 3,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_SHOT_COUNT,
        valueGrowthMultiplier: 1,
    },

    BULLET_SPEED: {
        title: 'Stinger Speed',
        description: 'Makes the stingers move faster. This makes it easier to aim at those birds, especially the ones that move try to dodge.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeBulletSpeed = levelData;
        },
        costBase: 5,
        costGrowth: 1.20,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_BULLET_SPEED,
        valueGrowthMultiplier: 0.06,
    },

    HONEYCOMB_MAGNET: {
        title: 'Homeycomb Magnet',
        description: 'Makes honeycomb slightly more attracted to you due to your charasmatic personality making it much easier to collect more honeycomb.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHoneycombAttration = levelData;
        },
        costBase: 5,
        costGrowth: 1.30,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_HONEYCOMB_ATTRACTION,
        valueGrowthMultiplier: 0.01,
    },

    HONEYCOMB_MAGNET_DISTANCE: {
        title: 'Homeycomb Magnet Distance',
        description: 'Honeycomb magnet works from slightly further distances.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHoneycombAttrationDistance = levelData;
        },
        costBase: 10,
        costGrowth: 1.6,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_HONEYCOMB_ATTRACTION_DISTANCE,
        valueGrowthMultiplier: 0.3,
    },

    BEE_HEALTH: {
        title: 'Health',
        description: 'Increases your maximum health making you more durable. It is recommended to just avoid taking damange in the first place.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeMaxHealth = levelData;
        },
        costBase: 5,
        costGrowth: 1.1,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_MAX_HEALTH,
        valueGrowthMultiplier: 1,
    },

    BEE_HEALTH_REGEN: {
        title: 'Health Regen',
        description: 'Increases your natural ability to heal. Scientists are still not sure how this works.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen = levelData;
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_HEALTH_REGEN,
        valueGrowthMultiplier: 0.1,
    },

    CRIT_CHANCE: {
        title: 'Critical Hit Chance',
        description: 'Increases the chance that your hits will be critical, dealing additional damange.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen = levelData;
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_CRIT_CHANCE,
        valueGrowthMultiplier: 0.1,
    },

    CRIT_MULTIPLIER: {
        title: 'Critical Hit Multiplier',
        description: '',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen = levelData;
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.BEE_CRIT_MULTIPLER,
        valueGrowthMultiplier: 0.1,
    },

    SAMMY_CHANCE: {
        title: 'Critical Hit Chance',
        description: '',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen = levelData;
        },
        costBase: 5,
        costGrowth: 1.2,
        valueBase: DEFAULT_ATTRIBUTE_VALUES.SAMMY_CHANCE,
        valueGrowthMultiplier: 0.1,
    },
}

class ShopItem {
    constructor(shopMenu, key, data) {

        this.shopMenu = shopMenu;

        this.key = key;
        this.data = data;
        this.currentLevel = 0;

        const imgEl = document.createElement('img');

        const titleEl = document.createElement('div');
        titleEl.classList.add('title');
        titleEl.innerText = this.data.title;

        this.descriptionEl = document.createElement('div');        
        this.descriptionEl.classList.add('description');
        this.descriptionEl.innerText = data.description;

        this.purchaseButton = document.createElement('button');
        this.purchaseButton.classList.add('purchase');
        this.purchaseButton.type = 'button';
        registerClick(this.purchaseButton, this.onPurchaseButtonClick.bind(this));
        
        const detailsEl = document.createElement('div');
        detailsEl.classList.add('details');
        detailsEl.appendChild(titleEl);
        detailsEl.appendChild(this.descriptionEl);

        this.element = document.createElement('div');
        this.element.classList.add('shop-item');
        this.element.dataset['key'] = key;
        this.element.appendChild(imgEl);
        this.element.appendChild(detailsEl);
        this.element.appendChild(this.purchaseButton);

        this.listItemEl = document.createElement('li');
        this.listItemEl.appendChild(this.element);
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