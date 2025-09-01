import { AchivementsMenu } from "./menu-achivements.js";
import { LevelSelectionMenu } from "./menu-level-selection.js";
import { LevelSummaryMenu } from "./menu-level-summary.js";
import { MainMenu } from "./menu-main.js";
import { ShopMenu } from "./menu-shop.js";
import { StatisticsMenu } from "./menu-statistics.js";

export let MENUS;

export function initMenus() {
    MENUS = {        
        MAIN: new MainMenu(),
        SHOP: new ShopMenu(),
        LEVEL_SELECTION: new LevelSelectionMenu(),
        STATISTICS: new StatisticsMenu(),
        ACHIVEMENTS: new AchivementsMenu(),
        LEVEL_SUMMARY: new LevelSummaryMenu(),
    }
}