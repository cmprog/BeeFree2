import { currentLevel, LEVELS } from "./levels.js";
import { logDebug, logInfo } from "./logging.js";
import { currentPlayer } from "./player.js";
import { registerClick } from "./util.js";

export let MENU_MAIN;
export let MENU_LEVEL_SELECTION;
export let MENU_SHOP;
export let MENU_STATISTICS;
export let MENU_ACHIVEMENTS;

const CLASS_MENU_CLOSED = 'menu-closed'

class Menu {

    constructor(selector) {
        this.element = document.querySelector(selector);
        this.isOpen = false;

        this.element.querySelectorAll('button.main-menu-return').forEach(el => {
            registerClick(el, () => {
                this.close();
                MENU_MAIN.open();
            });
        });        
    }

    open() {
        this.onOpening();
        this.element.classList.remove(CLASS_MENU_CLOSED);
        this.isOpen = true;
        this.onOpened();
    }

    onOpening() {

    }

    onOpened() {

    }

    close() {
        
        this.element.classList.add(CLASS_MENU_CLOSED);
        this.isOpen = false;
        this.closed();
    }

    closed() {

    }
}

class MainMenu extends Menu {

    constructor() {
        super('#main-menu')
        
        // We must bind to selector functions. If we bind to the variable it will bind null values
        // at this point since the values may not be initialized at time of constructions.
        registerClick('#main-menu-level-select', this.openMenu.bind(this, () => MENU_LEVEL_SELECTION));
        registerClick('#main-menu-shop', this.openMenu.bind(this, () => MENU_SHOP));
        registerClick('#main-menu-statistics', this.openMenu.bind(this, () => MENU_STATISTICS));
        registerClick('#main-menu-achivements', this.openMenu.bind(this, () => MENU_ACHIVEMENTS));
    }
    
    openMenu(menuSelector) {

        const targetMenu = menuSelector();
        this.close();
        targetMenu.open();
    }
}

class LevelSelectionMenu extends Menu {
    constructor() {
        super('#level-selection-menu')

        const levelsList = this.element.querySelector('ol.levels');

        for (let levelDefinition of LEVELS) {

            const levelButton = document.createElement('button');
            levelButton.type = 'button';
            levelButton.innerText = levelDefinition.name;
            levelButton.classList.add('level');

            registerClick(levelButton, this.loadLevel.bind(this, levelDefinition));
            
            const itemElement = document.createElement('li');
            itemElement.appendChild(levelButton);
            
            levelsList.appendChild(itemElement);
        }
    }

    loadLevel(levelDefinition) {        
        this.close();
        levelDefinition.startLevel();
    }
}

class ShopMenu extends Menu {
    constructor() {
        super('#menu-shop')
    }
}

class StatisticField {

    constructor(selector, valueAccessor) {
        this.containerElement = document.querySelector(selector);
        if (!this.containerElement) {
            throw Error(`Failed to find element with selector "${selector}".`);
        }

        this.valueElement = this.containerElement.querySelector('.value');
        if (!this.valueElement) {
            throw Error(`Failed to find value element from statistic with selector "${selector}".`);
        }

        this.valueAccessor = valueAccessor;
    }

    refresh() {
        this.valueElement.innerText = this.valueAccessor();
    }
}

class StatisticsMenu extends Menu {
    constructor() {
        super('#menu-statistics');

        function toRelativeTimeString(timestamp) {
            if (!timestamp) {
                return 'never';
            }

            const msPerMinute = 60 * 1000;
            const msPerHour = msPerMinute * 60;
            const msPerDay = msPerHour * 24;
            const msPerMonth = msPerDay * 30;
            const msPerYear = msPerDay * 365;

            const elapsedMs = new Date() - timestamp;
            if (elapsedMs < 1000) {
                return 'just now';
            }

            if (elapsedMs < msPerMinute) {
                return `${Math.round(elapsedMs / 1000)} seconds ago`;
            }

            if (elapsedMs < msPerHour) {
                return `${Math.round(elapsedMs / msPerMinute)} minutes ago`;
            }

            if (elapsedMs < msPerDay) {
                return `${Math.round(elapsedMs / msPerHour)} hours ago`;
            }

            if (elapsedMs < msPerMonth) {
                return `approximately ${Math.round(elapsedMs / msPerDay)} days ago`;
            }

            if (elapsedMs < msPerYear) {
                return `approximately ${Math.round(elapsedMs / msPerMonth)} months ago`;
            }

            return `approximately ${Math.round(elapsedMs / msPerYear)} years ago`;
        }

        this.fields = [
            new StatisticField('#statistic-created-on', () => {
                return toRelativeTimeString(currentPlayer.createdOn);
            }),
            new StatisticField('#statistic-last-saved-on', () => {
                return toRelativeTimeString(currentPlayer.lastSavedOn);              
            }),

            new StatisticField('#statistic-total-honeycomb-collected', () => {
                return currentPlayer.totalHoneycombCollected.toString();
            }),
            new StatisticField('#statistic-kill-count', () => {
                return currentPlayer.killCount.toString();
            }),
            new StatisticField('#statistic-death-count', () => {
                return currentPlayer.deathCount.toString();
            }),
            new StatisticField('#statistic-levels-started', () => {
                return currentPlayer.levelsStarted.toString();
            }),
            new StatisticField('#statistic-levels-completed', () => {
                return currentPlayer.levelsCompleted.toString();
            }),
            new StatisticField('#statistic-levels-failed', () => {
                return currentPlayer.levelsFailed.toString();
            }),
            new StatisticField('#statistic-perfect-levels-completed', () => {
                return currentPlayer.perfectLevelsCompleted.toString();
            }),
            new StatisticField('#statistic-flawless-levels-completed', () => {
                return currentPlayer.flawlessLevelsCompleted.toString();
            }),
            new StatisticField('#statistic-lucky-owls-spawned', () => {
                return currentPlayer.luckyOwlsSpawned.toString();
            }),
        ];
    }

    onOpening() {
        for (const field of this.fields) {
            field.refresh();
        }
    }

}

class AchivementsMenu extends Menu {
    constructor() {
        super('#menu-achivements')
    }
}

MENU_MAIN = new MainMenu();
MENU_LEVEL_SELECTION = new LevelSelectionMenu();
MENU_SHOP = new ShopMenu();
MENU_STATISTICS = new StatisticsMenu();
MENU_ACHIVEMENTS = new AchivementsMenu();