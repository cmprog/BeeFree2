import { appendChildHtml } from "./html.js";
import { logDebug } from "./logging.js";
import { Menu } from "./menu.js";
import { MENUS } from "./menus.js";
import { registerClick } from "./util.js";

/**
 * Represents a line item shown on the summary screen.
 */
class LevelSummaryItem {
    /**
     * @param {string} description 
     * @param {string} bonus 
     * @param {string} amount 
     * @param {string} icon 
     */
    constructor(description, bonus, amount, icon) {
        /**
         * @type {string}
         */
        this.description = description || '';
        /**
         * @type {string}
         */
        this.bonus = bonus || '';
        /**
         * @type {string}
         */
        this.amount = amount || '';
        /**
         * @type {string}
         */
        this.icon = icon || '';
    }
}

export class LevelSummaryMenu extends Menu {
    constructor() {
        super('#menu-level-summary');

        this.tableContainerEl = this.element.querySelector('.table-container');

        this.returnButtonEl = this.element.querySelector('button.return');
        registerClick(this.returnButtonEl, this.onReturnButtonClick.bind(this));

        this.totalHoneycombEarned = 0;

        /**
         * @type {LevelSummaryItem[]}
         */
        this.items = [];

        /**
         * @type {string}
         */
        this.returnMenuText = 'Return to main menu';

        /**
         * @type {Menu}
         */
        this.returnMenu = undefined;
    }

    onOpening() {

        const resultEl = this.element.querySelector('.level-result');
        resultEl.innerText = this.levelFailed ? 'Level Failed' : 'Level Completed';

        while (this.tableContainerEl.lastChild) {
            this.tableContainerEl.removeChild(this.tableContainerEl.lastChild);
        }       

        this.tableEl = document.createElement('table');
        this.tableEl.createTBody();        
        this.tableContainerEl.appendChild(this.tableEl);

        this.returnButtonEl.classList.add('hidden');
        this.returnButtonEl.innerText = this.returnMenuText;
    }

    onOpened() {
        this.scheduleItem();
    }
    
    scheduleItem() {

        logDebug(`Scheduling item (length: ${this.items.length})`);

        if (this.items.length) {            
            logDebug(`  Setting timeout`);
            window.setTimeout(this.appendItem.bind(this), 500);
        } else {
            logDebug(`  Scheduling total row`);
            this.scheduleTotalRow();
        }        
    }

    appendItem() {

        logDebug(`Appending item (length: ${this.items.length})`);

        if (this.items.length) {

            const item = this.items.shift();

            const templateHtml = `
                <tr>
                    <td>${item.description}</td>
                    <td>${item.bonus}</td>
                    <td>${item.amount}</td>
                    <td>${item.icon}</td>
                </tr>
            `;

            appendChildHtml(this.tableEl.tBodies[0], templateHtml);            
        }       

        this.scheduleItem();
    }

    /**
     * Schedules a new item to be added in the level summary table.
     * @param {string} description 
     * @param {string} bonus 
     * @param {string} amount 
     * @param {string} icon 
     */
    addItem(description, bonus, amount, icon) {
        this.items.push(new LevelSummaryItem(description, bonus, amount, icon));
    }

    scheduleTotalRow() {
        window.setTimeout(this.appendTotalRow.bind(this), 500);
    } 

    scheduleReturnButton() {
        window.setTimeout(this.toggleReturnButton.bind(this, true), 500);
    }    

    appendTotalRow() {        

        const templateHtml = `
            <tr>
                <td>total</td>
                <td></td>
                <td>${(this.totalHoneycombEarned).toFixed(1)}</td>
                <td></td>
            </tr>
        `;

        this.tableEl.tFoot = this.tableEl.tFoot || document.createElement('tfoot');

        appendChildHtml(this.tableEl.tFoot, templateHtml);

        this.scheduleReturnButton();
    }

    toggleReturnButton(flag) {

        if (flag) {
            this.returnButtonEl.classList.remove('hidden');
        } else {
            this.returnButtonEl.classList.add('hidden');
        }
    }

    onReturnButtonClick() {
        
        this.close();

        const targetMenu = this.returnMenu || MENUS.MAIN;
        targetMenu.open();
    }
}