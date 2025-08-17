import { Menu } from './menu.js'
import { MENUS } from './menus.js';
import { currentPlayer } from './player.js';
import { registerClick } from './util.js';

export class MainMenu extends Menu {

    constructor() {
        super('#main-menu')
        
        // We must bind to selector functions. If we bind to the variable it will bind null values
        // at this point since the values may not be initialized at time of constructions.
        registerClick('#main-menu-level-select', this.openMenu.bind(this, () => MENUS.LEVEL_SELECTION));
        registerClick('#main-menu-shop', this.openMenu.bind(this, () => MENUS.SHOP));
        registerClick('#main-menu-statistics', this.openMenu.bind(this, () => MENUS.STATISTICS));
        registerClick('#main-menu-achivements', this.openMenu.bind(this, () =>MENUS.ACHIVEMENTS));
        registerClick('#main-menu-reset-save', this.resetSave.bind(this));
    }
    
    openMenu(menuSelector) {

        const targetMenu = menuSelector();
        this.close();
        targetMenu.open();
    }

    resetSave() {
        currentPlayer.reset();
    }
}