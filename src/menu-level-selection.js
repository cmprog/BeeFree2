import { LEVELS } from './levels.js';
import { Menu } from './menu.js'
import { currentPlayer } from './player.js';
import { registerClick } from './util.js';

class LevelSelectionButton {

    constructor(levelDefinition) {

        this.definition = levelDefinition;

        this.flawlessBadgeElement = document.createElement('div');            
        this.flawlessBadgeElement.classList.add('level-badge');
        this.flawlessBadgeElement.classList.add('level-badge-flawless');
        this.flawlessBadgeElement.innerText = 'F'

        this.perfectBadgeElement = document.createElement('div');
        this.perfectBadgeElement.classList.add('level-badge');
        this.perfectBadgeElement.classList.add('level-badge-perfect');
        this.perfectBadgeElement.innerText = 'P'

        const badgeContainer = document.createElement('div');                  
        badgeContainer.classList.add('level-badge-container');
        badgeContainer.appendChild(this.flawlessBadgeElement);
        badgeContainer.appendChild(this.perfectBadgeElement);

        this.element = document.createElement('button');
        this.element.type = 'button';
        this.element.innerText = levelDefinition.name;
        this.element.classList.add('level');
        this.element.appendChild(badgeContainer);     
        
        this.refreshBadges();
    }

    refreshBadges() {

        const levelData = currentPlayer.getLevel(this.definition.id);
        this.updateBadgeClass(this.flawlessBadgeElement, levelData.flawlessCount > 0);
        this.updateBadgeClass(this.perfectBadgeElement, levelData.perfectCount > 0);
    }

    updateBadgeClass(element, hasBadge) {
        const CLASS_NAME = 'level-badge-acquired';
        if (hasBadge) {
            element.classList.add(CLASS_NAME);
        } else {
            element.classList.remove(CLASS_NAME);
        }
    }
}

export class LevelSelectionMenu extends Menu {
    constructor() {
        super('#level-selection-menu')

        const levelsList = this.element.querySelector('ol.levels');

        this.buttons = [];

        for (const levelDefinition of LEVELS) {

            const button = new LevelSelectionButton(levelDefinition);
            this.buttons.push(button);

            registerClick(button.element, this.loadLevel.bind(this, levelDefinition));
            
            const itemElement = document.createElement('li');
            itemElement.appendChild(button.element);
            
            levelsList.appendChild(itemElement);
        }
    }

    onOpening() {
        for (const button of this.buttons) {
            button.refreshBadges();
        }
    }

    loadLevel(levelDefinition) {        
        this.close();
        levelDefinition.startLevel();
    }
}