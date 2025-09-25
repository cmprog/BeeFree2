import { DoubleClickButton } from "./button.js";
import { LEVELS } from "./levels.js";
import { Menu } from "./menu.js";
import { currentPlayer } from "./player.js";
import { GAME_SETTINGS } from "./settings.js";
import { registerClick } from "./util.js";

export class SettingsMenu extends Menu {
    constructor() {
        super('#menu-settings');

        if (!GAME_SETTINGS.IS_LOCAL_DEV_ENVIRONMENT) {
            for (const el of this.element.querySelectorAll('.section-debug')) {
                el.classList.add('hidden');
            }        
        }        

        for (const el of this.element.querySelectorAll('button[data-honeycomb]')) {            
            const honeycomb = Number(el.dataset['honeycomb'] || 0);
            registerClick(el, this.addHoneycomb.bind(this, honeycomb));
        }

        DoubleClickButton.create(
            this.element.querySelector('#settings-save-reset'),
            this.resetSave.bind(this)
        );

        DoubleClickButton.create(
            this.element.querySelector('#settings-debug-unlock-all-levels'),
            this.unlockAllLevels.bind(this)
        );
    }

    resetSave() {
        if (currentPlayer) {
            currentPlayer.reset();
        }
    }

    addHoneycomb(amount) {
        if (currentPlayer) {
            currentPlayer.onHoneycombCollected(amount);
        }
    }

    unlockAllLevels() {

        if (currentPlayer) {
            for (const level of LEVELS) {
                currentPlayer.markLevelAvailable(level.id);
            }
        }

    }
}