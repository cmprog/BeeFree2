import { appendChildHtml } from "./html.js";
import { Menu } from "./menu.js";
import { MENUS } from "./menus.js";
import { NO_DAMAGE_TOKEN_LEVEL_BONUS, NO_SURVIVORS_LEVEL_BONUS, PERFECT_LEVEL_BONUS } from "./settings.js";
import { registerClick } from "./util.js";

export class LevelSummaryMenu extends Menu {
    constructor() {
        super('#menu-level-summary');

        this.tableContainerEl = this.element.querySelector('.table-container');

        this.returnButtonEl = this.element.querySelector('button.return');
        registerClick(this.returnButtonEl, this.onReturnButtonClick.bind(this));

        this.honeycombEarned = 0;
        this.levelFailed = false;
        this.noDamageTaken = true;
        this.noSurvivors = true;

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
        this.scheduleHoneycombRow();
    }   

    scheduleHoneycombRow() {
        window.setTimeout(this.appendHoneycombRow.bind(this), 500);
    }

    scheduleNoDamageRow() {
        if (this.noDamageTaken) {
            window.setTimeout(this.appendNoDamageRow.bind(this), 500);
        } else {
            this.scheduleNoSurvivorsRow();
        }
    }

    scheduleNoSurvivorsRow() {
        if (this.noSurvivors) {
            window.setTimeout(this.appendNoSurvivorsRow.bind(this), 500);
        } else {
            this.schedulePerfectRow();
        }
    }

    schedulePerfectRow() {
        if (this.noDamageTaken && this.noSurvivors) {
            window.setTimeout(this.appendPerfectRow.bind(this), 500);
        } else {
            this.scheduleReturnButton();
        }
    }

    scheduleTotalRow() {
        window.setTimeout(this.appendTotalRow.bind(this), 500);
    } 

    scheduleReturnButton() {
        window.setTimeout(this.toggleReturnButton.bind(this, true), 500);
    }    
    
    appendHoneycombRow() {

        const templateHtml = `
            <tr>
                <td>honeycomb collected</td>
                <td></td>
                <td>${this.honeycombEarned.toFixed(1)}</td>
            </tr>
        `;

        appendChildHtml(this.tableEl.tBodies[0], templateHtml);

        this.scheduleNoDamageRow();
    } 
    
    appendNoDamageRow() {

        const templateHtml = `
            <tr>
                <td>no damage taken</td>
                <td>${(NO_DAMAGE_TOKEN_LEVEL_BONUS * 100).toFixed(0)}% bonus</td>
                <td>+ ${(this.honeycombEarned * NO_DAMAGE_TOKEN_LEVEL_BONUS).toFixed(1)}</td>
            </tr>
        `;

        appendChildHtml(this.tableEl.tBodies[0], templateHtml);

        this.scheduleNoSurvivorsRow();
    }

    appendNoSurvivorsRow() {

        const templateHtml = `
            <tr>
                <td>no survivors</td>
                <td>${(NO_SURVIVORS_LEVEL_BONUS * 100).toFixed(0)}% bonus</td>
                <td>+ ${(this.honeycombEarned * NO_SURVIVORS_LEVEL_BONUS).toFixed(1)}</td>
            </tr>
        `;

        appendChildHtml(this.tableEl.tBodies[0], templateHtml);

        this.schedulePerfectRow();
    }

    appendPerfectRow() {

        const templateHtml = `
            <tr>
                <td>perfection!</td>
                <td>${(PERFECT_LEVEL_BONUS * 100).toFixed(0)}% bonus</td>
                <td>+ ${(this.honeycombEarned * PERFECT_LEVEL_BONUS).toFixed(1)}</td>
            </tr>
        `;

        appendChildHtml(this.tableEl.tBodies[0], templateHtml);

        this.scheduleTotalRow();
    }

    appendTotalRow() {        

        let total = this.honeycombEarned;

        if (this.noDamageTaken) {
            total += this.honeycombEarned * NO_DAMAGE_TOKEN_LEVEL_BONUS;
        }

        if (this.noSurvivors) {
            total += this.honeycombEarned * NO_SURVIVORS_LEVEL_BONUS;
        }

        if (this.noDamageTaken && this.noSurvivors) {
            total += this.honeycombEarned * PERFECT_LEVEL_BONUS;
        }

        const templateHtml = `
            <tr>
                <td>total</td>
                <td></td>
                <td>${(total).toFixed(1)}</td>
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