import { queryAllElements, queryElement } from "./html.js";
import { DoubleClickButton } from "./button.js";
import { LEVELS } from "./level-list.js";
import { Menu } from "./menu.js";
import { currentPlayer } from "./player.js";
import { GAME_SETTINGS } from "./settings.js";
import { MENUS } from "./menu-registry.js";
import { registerClick } from "./util.js";

export class SettingsMenu extends Menu {
    constructor() {
        super('#menu-settings');

        if (!GAME_SETTINGS.IS_LOCAL_DEV_ENVIRONMENT) {
            for (const el of queryAllElements(this.element, '.section-debug')) {
                el.classList.add('hidden');
            }        
        }        

        for (const el of queryAllElements(this.element, 'button[data-honeycomb]')) {            
            const honeycomb = Number(el.dataset['honeycomb'] || 0);
            registerClick(el, this.addHoneycomb.bind(this, honeycomb));
        }

        DoubleClickButton.create(
            queryElement(this.element, '#settings-save-reset'),
            this.resetSave.bind(this)
        );

        DoubleClickButton.create(
            queryElement(this.element, '#settings-debug-unlock-all-levels'),
            this.unlockAllLevels.bind(this)
        );

        registerClick('#settings-debug-hat-tuning', () => {
            this.close();
            MENUS.HAT_TUNING.open();
        });
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