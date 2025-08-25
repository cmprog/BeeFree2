import { appendChildHtml } from './html.js';
import { LEVELS } from './levels.js';
import { Menu } from './menu.js'
import { currentPlayer } from './player.js';
import { registerClick } from './util.js';

class LevelSelectionItem {

    constructor(parent, levelDefinition) {

        this.parent = parent;
        this.definition = levelDefinition;
        this.isUnlocked = false;

        const templateHtml = `
            <button type="button" class="level">
                <div class="level-title">${levelDefinition.name}</div>
                <div class="level-locked-status">(locked)</div>
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
       
        registerClick(this.element, this.loadLevel.bind(this));
        
        this.reload();
    }

    reload() {

        const levelData = currentPlayer.getLevel(this.definition.id);

        this.updateBadgeClass(this.flawlessBadgeElement, levelData.flawlessCount > 0);
        this.updateBadgeClass(this.perfectBadgeElement, levelData.perfectCount > 0);

        const CLASS_NAME_UNLOCKED = 'unlocked';

        this.isUnlocked = levelData.isUnlocked;

        if (this.isUnlocked) {
            this.element.classList.add(CLASS_NAME_UNLOCKED);
        } else {
            this.element.classList.remove(CLASS_NAME_UNLOCKED);
        }
    }

    updateBadgeClass(element, hasBadge) {
        const CLASS_NAME = 'level-badge-acquired';
        if (hasBadge) {
            element.classList.add(CLASS_NAME);
        } else {
            element.classList.remove(CLASS_NAME);
        }
    }

    loadLevel() {

        if (this.isUnlocked) {
            this.parent.close();
            this.definition.startLevel();
        }
    }
}

export class LevelSelectionMenu extends Menu {
    constructor() {
        super('#level-selection-menu')

        const levelsList = this.element.querySelector('ol.levels');

        this.buttons = [];

        for (const levelDefinition of LEVELS) {

            const button = new LevelSelectionItem(this, levelDefinition);
            this.buttons.push(button);
            
            const itemElement = document.createElement('li');
            itemElement.appendChild(button.element);
            
            levelsList.appendChild(itemElement);
        }
    }

    onOpening() {
        for (const button of this.buttons) {
            button.reload();
        }
    }
}