import { logDebug } from "./logging.js";
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

        const contentEl = this.element.querySelector('.content');
        if (contentEl) {
            const computedStyle = window.getComputedStyle(contentEl);
            
            logDebug(`contentEl.scrollHeight: ${contentEl.scrollHeight}`);
            logDebug(`computedStyle.height: ${computedStyle.height}`);
        }
        
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