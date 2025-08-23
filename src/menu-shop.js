import { Menu } from './menu.js'
import { currentPlayer } from './player.js';
import { registerClick } from './util.js';

const SHOP_ITEMS = {    
    BEE_SPEED: {
        title: 'Bee Speed',
        maxDescription: 'You are too fast, can\'t break the laws of physics.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeSpeed += levelData.deltaValue;
        },
        levels: {
            1: {
                price: 5,
                description: 'Now, your stingers move faster!',
                deltaValue: 0.025,
            },
            2: {
                price: 10,
                description: 'Faster stingers are harder for the birds to dodge!',
                deltaValue: 0.025,
            },
            3: {
                price: 25,
                description: 'Starting to pick up more speed!',
                deltaValue: 0.025,
            },
            4: {
                price: 50,
                description: 'Your stingers could compete in NASCAR at this point!',
                deltaValue: 0.025,
            },
            5: {
                price: 100,
                description: 'It\'s a bird! It\'s a plane! Nope, just your stingers!',
                deltaValue: 0.025,
            },
        },
    },

    BULLET_RATE: {
        title: 'Sing Rate',
        maxDescription: 'There is no way you could shoot those stingers any faster than you do.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeFireRate += levelData.valueDelta;
        },
        levels: {
            1: {
                price: 1,
                description: 'Sting faster!',
                valueDelta: -0.1,
            },
            2: {
                price: 10,
                description: 'Stinging this fast must work your abdominals!',
                valueDelta: -0.1,
            },
            3: {
                price: 30,
                description: 'In reality - you should only be able to sting once...',
                valueDelta: -0.1,
            },
            4: {
                price: 50,
                description: 'This looks painful - for the birds!',
                valueDelta: -0.1,
            },
            5: {
                price: 100,
                description: 'Hope the enemies won\'t blink, these bullets are coming fast!',
                valueDelta: -0.1,
            },
        }
    },

    BULLET_DAMAGE: {
        title: 'Damage',
        maxDescription: 'Theres just no way you could sting better!',        
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeDamage += levelData.levelDelta;
        },
        levels: {
            1: {
                price: 10,
                description: 'More potent stingers - its better than before at least...',
                valueDelta: 1.0,
            },
            2: {
                price: 25,
                description: 'Now you\'re starting to do some damage!',
                valueDelta: 1.0,
            },
            3: {
                price: 50,
                description: 'Someone\'s been working out their stinger!',
                valueDelta: 1.0,
            },
            4: {
                price: 75,
                description: 'Did you sharpen the point on your stinger?',
                valueDelta: 1.0,
            },
            5: {
                price: 100,
                description: 'You must be packing a load of bricks behind those stings!',
                valueDelta: 1.0,
            },
        }
    },

    BULLET_MULTISHOT: {
        title: 'Multishot',
        maxDescription: 'When all else fails, shoot more stingers, one of them will hit!',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeShotCount += levelData.valueDelta;
        },
        levels: {
            1: {
                price: 75,
                description: 'hrough the miracle of science, shoot 2 stingers with each sting!',
                valueDelta: 1,
            },
            2: {
                price: 200,
                description: 'Allows the bee to sting with 3 stingers at once, we\'re not sure how this is possible...',
                valueDelta: 1,
            },
        }
    },

    BULLET_SPEED: {
        title: 'Stinger Speed',
        maxDescription: 'Any faster would break the laws of bee-physics!',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeBulletSpeed += levelData.valueDelta;
        },
        levels: {
            1: {
                price: 5,
                description: 'More potent stingers - its better than before at least...',
                valueDelta: 0.06,
            },
            2: {
                price: 10,
                description: 'Faster stingers are harder for the birds to dodge!',
                valueDelta: 0.06,
            },
            3: {
                price: 25,
                description: 'Starting to pick up more speed!',
                valueDelta: 0.06,
            },
            4: {
                price: 50,
                description: 'Your stingers could compete in NASCAR at this point!',
                valueDelta: 0.06,
            },
            5: {
                price: 100,
                description: 'It\'s a bird! It\'s a plane! Nope, just your stingers!',
                valueDelta: 0.06,
            },
        }
    },

    HONEYCOMB_MAGNET: {
        title: 'Homeycomb Magnet',
        maxDescription: 'Any more attractive and I\'d be drawn to you!',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHoneycombAttration += levelData.valueDelta;
        },
        levels: {
            1: {
                price: 5,
                description: 'The honeycomb will become slightly attracted to you with this magnet!',
                valueDelta: 0.1,
            },
            2: {
                price: 15,
                description: 'Isn\'t it nice the honeycomb comes to you?',
                valueDelta: 0.1,
            },
            3: {
                price: 25,
                description: 'The honeycomb is addictive isn\'t it?',
                valueDelta: 0.1,
            },
            4: {
                price: 40,
                description: 'In Soviet Russia, honeycomb collects you!',
                valueDelta: 0.1,
            },
            5: {
                price: 60,
                description: 'Who even needs to collect honeycomb at this point?',
                valueDelta: 0.1,
            },
        }
    },

    BEE_HEALTH: {
        title: 'Health',
        maxDescription: 'You\'re fit as a fiddle - I\'m assuming fiddles are very fit.',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeMaxHealth += levelData.deltaValue;
        },
        levels: {
            1: {
                price: 5,
                description: 'Gives your more health - more health makes it harder for the birds to pick you off!',
                deltaValue: 5,
            },
            2: {
                price: 15,
                description: 'A apples weight of honey a day - or something like that...',
                deltaValue: 5,
            },
            3: {
                price: 25,
                description: 'This should help keep the birds from picking you off quickly!',
                deltaValue: 5,
            },
            4: {
                price: 45,
                description: 'Help, I\'m running out of witty descriptions!',
                deltaValue: 5,
            },
            5: {
                price: 60,
                description: 'You\'re gonna have While E. Coyote health!',
                deltaValue: 5,
            },
        }
    },

    BEE_HEALTH_REGEN: {
        title: 'Health Regen',
        maxDescription: 'If you regenerated any faster, you would have a clone!',
        onPurchased: (itemKey, itemData, levelKey, levelData) => {
            currentPlayer.beeHealthRegen += levelData.valueDelta;
        },
        levels: {
            1: {
                price: 5,
                description: 'Incraeses the rate at which your health regenerates.',
                valueDelta: 0.1,
            },
            2: {
                price: 15,
                description: 'Just make sure you don\'t get killed in a single hit...',
                valueDelta: 0.1,
            },
            3: {
                price: 25,
                description: 'We\'re not sure how you\'re able to regen your health, but its pretty awesome!',
                valueDelta: 0.1,
            },
            4: {
                price: 45,
                description: 'It\'s almost as if your skin is healing before our very eyes!',
                valueDelta: 0.1,
            },
            5: {
                price: 60,
                description: 'Who needs health when you have health regenerating abilities?',
                valueDelta: 0.1,
            },
        }
    },

    // CRIT_CHANCE: { },
    // CRIT_MULTIPLIER: { },

    // SAMMY_CHANCE: { },
}

class ShopItem {
    constructor(shopMenu, key, data) {

        this.shopMenu = shopMenu;

        this.key = key;
        this.data = data;
        this.levelKey = 1;
        this.levelData = data.levels[this.levelKey];

        const imgEl = document.createElement('img');

        const titleEl = document.createElement('div');
        titleEl.classList.add('title');
        titleEl.innerText = this.data.title;

        this.descriptionEl = document.createElement('div');        
        this.descriptionEl.classList.add('description');
        this.descriptionEl.innerText = '';

        this.purchaseButton = document.createElement('button');
        this.purchaseButton.classList.add('purchase');
        this.purchaseButton.type = 'button';
        this.purchaseButton.innerText = '42 hc';
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
        return (this.levelData && (currentPlayer.availableHoneycomb >= this.levelData.price));
    }

    onPurchaseButtonTimeout() {
        if (this.purchaseButtonTimeout) {
            window.clearTimeout(this.purchaseButtonTimeout);
            this.purchaseButtonTimeout = undefined;
            this.refresh();
        }
    }

    onPurchaseConfirmed() {

        this.onPurchaseButtonTimeout();
        
        currentPlayer.availableHoneycomb -= this.levelData.price;
        currentPlayer.shopPurchases[this.key] = this.levelKey;

        this.data.onPurchased(this.key, this.data, this.levelKey, this.levelData);

        currentPlayer.save();

        this.refresh();
        this.shopMenu.refreshAvaialbleHoneycomb();
    }

    refresh() {

        let candidateLevelKey = 1;
        if (currentPlayer.shopPurchases && currentPlayer.shopPurchases.hasOwnProperty(this.key)) {
            const playerLevelKey = currentPlayer.shopPurchases[this.key];
            candidateLevelKey = playerLevelKey + 1;            
        }

        if (this.data.levels.hasOwnProperty(candidateLevelKey)) {
            this.levelKey = candidateLevelKey;
            this.levelData = this.data.levels[this.levelKey];
        } else {
            this.levelKey = undefined;
            this.levelData = undefined;
        }

        if (this.levelData) {
            this.purchaseButton.classList.remove('hidden');
            
            while (this.purchaseButton.firstChild) {
                this.purchaseButton.removeChild(this.purchaseButton.lastChild);
            }
            
            this.purchaseButton.appendChild(document.createTextNode(this.levelData.price));
            this.purchaseButton.appendChild(document.createElement('br'));
            this.purchaseButton.appendChild(document.createTextNode('honeycomb'));

            this.descriptionEl.innerText = this.levelData.description;
        } else {
            this.purchaseButton.classList.add('hidden');
            this.descriptionEl.innerText = this.data.maxDescription;
        }
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