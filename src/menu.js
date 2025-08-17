import { MENUS } from "./menus.js";
import { registerClick } from "./util.js";

const CLASS_MENU_CLOSED = 'menu-closed'

export class Menu {

    constructor(selector) {
        this.element = document.querySelector(selector);
        this.isOpen = false;

        this.element.querySelectorAll('button.main-menu-return').forEach(el => {
            registerClick(el, () => {
                this.close();
                MENUS.MAIN.open();
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