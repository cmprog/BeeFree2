import { AchievementsMenu } from "./menu-achievements.js";
import { LevelSelectionMenu } from "./menu-level-selection.js";
import { LevelSummaryMenu } from "./menu-level-summary.js";
import { MainMenu } from "./menu-main.js";
import { PrestigeMenu } from "./menu-prestige.js";
import { SettingsMenu } from "./menu-settings.js";
import { ShopMenu } from "./menu-shop.js";
import { StatisticsMenu } from "./menu-statistics.js";
import { WardrobeMenu } from "./menu-wardrobe.js";
import { HatTuningMenu } from "./menu-hat-tuning.js";
import { MENUS } from "./menu-registry.js";

export class MenuSet {
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
         * @type {AchievementsMenu}
         */
        this.ACHIEVEMENTS = new AchievementsMenu();
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
        /**
         * @type {WardrobeMenu}
         */
        this.WARDROBE = new WardrobeMenu();
        /**
         * Dev-only view for positioning hats.
         * @type {HatTuningMenu}
         */
        this.HAT_TUNING = new HatTuningMenu();
    }
}

/**
 * Creates every menu and makes them available through MENUS in menu-registry.js.
 */
export function initMenus() {
    Object.assign(MENUS, new MenuSet());
}