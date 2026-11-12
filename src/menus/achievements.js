import { forEachAchievement } from '../player/achievements.js';
import { queryElement } from '../core/html.js';
import { Menu } from './menu.js'
import { currentPlayer } from '../player/player.js';

class AchievementListItem {
    constructor(achievement) {

        this.achievement = achievement;

        this.element = document.createElement('li');
        this.element.classList.add('achievement');

        const nameElement = document.createElement('div');
        nameElement.classList.add('name');
        nameElement.innerText = achievement.name;

        const descriptionElement = document.createElement('div');        
        descriptionElement.classList.add('description');
        descriptionElement.innerText = achievement.description;

        this.progressElement = document.createElement('progress');
        this.progressElement.classList.add('progress');
        this.progressElement.max = 1.0;

        const contentElement = document.createElement('div');
        contentElement.classList.add('content');
        contentElement.appendChild(nameElement);
        contentElement.appendChild(descriptionElement);
        contentElement.appendChild(this.progressElement);

        const iconElement = document.createElement('div');
        iconElement.classList.add('icon');
        iconElement.innerText = achievement.icon;

        this.element.appendChild(iconElement);
        this.element.appendChild(contentElement);
    }

    refresh() {

        this.progressElement.value = this.achievement.getProgress();

        const CLASS_NAME_UNLOCKED = 'unlocked';
        if (currentPlayer.hasAchievement(this.achievement.id)) {
            this.element.classList.add(CLASS_NAME_UNLOCKED);            
        } else {
            this.element.classList.remove(CLASS_NAME_UNLOCKED);
        }
    }
}

export class AchievementsMenu extends Menu {

    constructor() {
        super('#menu-achievements')

        this.achievementListEl = queryElement(this.element, '.achievement-list');        
    }

    onOpening() {

        if (!this.achievementListItems) {
            
            this.achievementListItems = [];
            
            forEachAchievement(achievement => {
                const listItem = new AchievementListItem(achievement);
                this.achievementListItems.push(listItem);
                this.achievementListEl.appendChild(listItem.element);
            });
        }

        this.achievementListItems.forEach(li => li.refresh());
    }
}