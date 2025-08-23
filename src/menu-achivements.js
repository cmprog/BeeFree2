import { Menu } from './menu.js'
import { currentPlayer } from './player.js';

class AchivementListItem {
    constructor(achivement) {

        this.achivement = achivement;

        this.element = document.createElement('li');
        this.element.classList.add('achivement');

        const nameElement = document.createElement('div');
        nameElement.classList.add('name');
        nameElement.innerText = achivement.name;

        const descriptionElement = document.createElement('div');        
        descriptionElement.classList.add('description');
        descriptionElement.innerText = achivement.description;

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
        iconElement.innerText = achivement.icon;

        this.element.appendChild(iconElement);
        this.element.appendChild(contentElement);
    }

    refresh() {

        this.progressElement.value = this.achivement.getProgress();

        const CLASS_NAME_UNLOCKED = 'unlocked';
        if (currentPlayer.hasAchivement(this.achivement.id)) {
            this.element.classList.add(CLASS_NAME_UNLOCKED);            
        } else {
            this.element.classList.remove(CLASS_NAME_UNLOCKED);
        }
    }
}

export class AchivementsMenu extends Menu {

    constructor() {
        super('#menu-achivements')

        this.achivementListEl = this.element.querySelector('.achivement-list');        
    }

    onOpening() {

        if (!this.achivementListItems) {
            
            this.achivementListItems = [];
            
            medalsForEach(achivement => {
                const listItem = new AchivementListItem(achivement);
                this.achivementListItems.push(listItem);
                this.achivementListEl.appendChild(listItem.element);
            });
        }

        this.achivementListItems.forEach(li => li.refresh());
    }
}