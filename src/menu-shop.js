import { appendChildHtml, queryElement } from './html.js';
import { Menu } from './menu.js'
import { currentPlayer } from './player.js';
import { SHOP_ITEMS, ShopItemCategory, ShopItemDescriptor } from './shop-items.js';
import { registerClick, Util } from './util.js';

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

        this.currentValueEl = queryElement(this.listItemEl, '.attribute-value.attribute-current');
        this.nextValueEl = queryElement(this.listItemEl, '.attribute-value.attribute-next');

        this.purchaseButton = queryElement(this.listItemEl, '.purchase');
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

    /**
     * The price of purchasing the next level of this item.
     * @returns {number}
     */
    computePrice() {
        return this.data.computePrice(this.currentLevel);
    }

    onPurchaseConfirmed() {

        this.onPurchaseButtonTimeout();

        currentPlayer.purchaseShopItem(this.key, this.data, this.computePrice());

        this.refresh();
        this.shopMenu.refreshAvaialbleHoneycomb();
    }

    refresh() {

        this.currentLevel = this.data.getPurchasedLevel(currentPlayer, this.key);

        const formatValue = this.data.formatDisplayValue || ((value) => value.toString());

        const currentLevelValue = this.data.computeValue(this.currentLevel);
        const nextLevelValue = this.data.computeValue(this.currentLevel + 1);

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
            this.purchaseButton.appendChild(document.createTextNode(this.computePrice().toString()));
            this.purchaseButton.appendChild(document.createElement('br'));
            this.purchaseButton.appendChild(document.createTextNode('honeycomb'));
        }
    }
}

export class ShopMenu extends Menu {
    constructor() {
        super('#menu-shop')

        const menuContentEl = queryElement(this.element, '.content');

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
            const listEl = queryElement(sectionEl, '.shop-item-list');

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
        const availableHoneycombEl = queryElement(this.element, '.available-honeycomb');
        availableHoneycombEl.innerText = `${currentPlayer.availableHoneycomb.toFixed(1)} honeycomb available`;
    }
}