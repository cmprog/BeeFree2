import { Menu } from "./menu.js";
import { MENUS } from "./menus.js";
import { currentPlayer } from "./player.js";
import { registerClick } from "./util.js";

export class PrestigeMenu extends Menu{

    constructor() {
        super('#menu-prestige');

        this.confirmButton = this.element.querySelector('button.confirm');
        registerClick(this.confirmButton, this.onConfirmButtonClick.bind(this));
    }

    onOpening() {
        const currentBonusEl = this.element.querySelector('.prestige-multiplier-current');
        currentBonusEl.innerText = this.formatMultiplier(currentPlayer.prestigeHoneycombMultiplier);

        const additionalPrestigeBonus = currentPlayer.calculatePotentialPrestigeEarnings();
        const newPrestigeBonus = currentPlayer.prestigeHoneycombMultiplier + additionalPrestigeBonus;
        const nextBonusEl = this.element.querySelector('.prestige-multiplier-new');
        nextBonusEl.innerText = this.formatMultiplier(newPrestigeBonus);
    }

    /**
     * Gets the formatted multiplier for display in the UI.
     * @param {number} value 
     */
    formatMultiplier(value) {
        return `${(value - 1).toFixed(1)}`
    }

    onConfirmButtonClick() {

        if (this.confirmButtonTimeout) {
            this.onPrestigeConfirmed();
            return;
        }

        this.confirmButtonTimeout = window.setTimeout(this.onConfirmButtonTimeout.bind(this), 2000);
        this.refreshButtonText();
    }

    onConfirmButtonTimeout() {

        if (this.confirmButtonTimeout) {

            window.clearTimeout(this.confirmButtonTimeout);
            this.confirmButtonTimeout = undefined;  
            
            this.refreshButtonText();
        }
    }

    onPrestigeConfirmed() {
        this.refreshButtonText();

        currentPlayer.prestige();

        this.close();
        MENUS.MAIN.open();
    }

    refreshButtonText() {
    
        if (this.confirmButtonTimeout) {
            this.confirmButton.innerText = 'no take backs';
        } else {
            this.confirmButton.innerText = "LET'S DO IT!"
        }
    }
}