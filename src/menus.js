import { AchivementsMenu } from "./menu-achivements.js";
import { LevelSelectionMenu } from "./menu-level-selection.js";
import { LevelSummaryMenu } from "./menu-level-summary.js";
import { MainMenu } from "./menu-main.js";
import { PrestigeMenu } from "./menu-prestige.js";
import { SettingsMenu } from "./menu-settings.js";
import { ShopMenu } from "./menu-shop.js";
import { StatisticsMenu } from "./menu-statistics.js";

class MenuSet {
    constructor() {
        /**
         * @type {MainMenu}
         */
        this.MAIN = new MainMenu();
        /**
         * @type {ShopMenu}
         */
        this.SHOP = new ShopMenu();        
        /**
         * @type {LevelSelectionMenu}
         */
        this.LEVEL_SELECTION = new LevelSelectionMenu();
        /**
         * @type {StatisticsMenu}
         */
        this.STATISTICS = new StatisticsMenu();
        /**
         * @type {AchivementsMenu}
         */
        this.ACHIVEMENTS = new AchivementsMenu();
        /**
         * @type {LevelSummaryMenu}
         */
        this.LEVEL_SUMMARY = new LevelSummaryMenu();
        /**
         * @type {PrestigeMenu}
         */
        this.PRESTIGE = new PrestigeMenu();
        /**
         * @type {SettingsMenu}
         */
        this.SETTINGS = new SettingsMenu();
    }
}

/**
 * @type {MenuSet}
 */
export let MENUS;

export function initMenus() {
    MENUS = new MenuSet();
}