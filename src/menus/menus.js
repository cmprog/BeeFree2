import { AchievementsMenu } from "./achievements.js";
import { LevelSelectionMenu } from "./level-selection.js";
import { LevelSummaryMenu } from "./level-summary.js";
import { MainMenu } from "./main.js";
import { PrestigeMenu } from "./prestige.js";
import { SettingsMenu } from "./settings.js";
import { ShopMenu } from "./shop.js";
import { StatisticsMenu } from "./statistics.js";
import { WardrobeMenu } from "./wardrobe.js";
import { HatTuningMenu } from "./dev/hat-tuning.js";
import { MENUS } from "./registry.js";

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
 * Creates every menu and makes them available through MENUS in menus/registry.js.
 */
export function initMenus() {
    Object.assign(MENUS, new MenuSet());
}