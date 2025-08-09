import { currentLevel, LEVELS } from "./levels.js";
import { logDebug, logInfo } from "./logging.js";
import { registerClick } from "./util.js";

export let MAIN_MENU;
export let LEVEL_SELECTION_MENU;

const CLASS_MENU_CLOSED = 'menu-closed'

class Menu {

    constructor(selector) {
        this.element = document.querySelector(selector);
        this.isOpen = false;        
    }

    open() {
        this.element.classList.remove(CLASS_MENU_CLOSED);
        this.isOpen = true;
        this.opened();
    }

    opened() {

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

        const startButton = this.element.querySelector('button.start');
        registerClick(startButton, this.onStartButtonClicked.bind(this));
    }

    onStartButtonClicked() {

        logDebug('Start Button Clicked');

        this.close();

        LEVEL_SELECTION_MENU.open();
    }

}

class LevelSelectionMenu extends Menu {
    constructor() {
        super('#level-selection-menu')

        const levelsList = this.element.querySelector('ol.levels');
        for (let levelDefinition of LEVELS) {
            const levelButton = document.createElement('button');
            levelButton.innerText = levelDefinition.name;
            levelButton.classList.add('level');
            levelButton.addEventListener('click', this.loadLevel.bind(this, levelDefinition));
            
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

MAIN_MENU = new MainMenu();
LEVEL_SELECTION_MENU = new LevelSelectionMenu();