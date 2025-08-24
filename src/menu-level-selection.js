import { appendChildHtml } from './html.js';
import { LEVELS } from './levels.js';
import { Menu } from './menu.js'
import { currentPlayer } from './player.js';
import { registerClick } from './util.js';

class LevelSelectionItem {

    constructor(levelDefinition) {

        this.definition = levelDefinition;

        const templateHtml = `
            <button type="button" class="level">
                <div class="level-title">${levelDefinition.name}</div>
                <div class="level-badge-container">
                    <div class="level-badge level-badge-flawless">F</div>
                    <div class="level-badge level-badge-perfect">P</div>
                </div>
            </div>
        `;

        this.listItemEl = document.createElement('li');
        appendChildHtml(this.listItemEl, templateHtml);

        this.flawlessBadgeElement = this.listItemEl.querySelector('.level-badge-flawless');
        this.perfectBadgeElement = this.listItemEl.querySelector('.level-badge-perfect');
        this.element = this.listItemEl.querySelector('button');
        
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

            const button = new LevelSelectionItem(levelDefinition);
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