import { queryElement } from "./html.js";
import { MENUS } from "./menu-registry.js";
import { registerClick } from "./util.js";

const CLASS_MENU_CLOSED = 'menu-closed'

export class Menu {

    constructor(selector) {

        /**
         * The root level element representing the menu.
         * @type {HTMLDivElement}
         */
        this.element = queryElement(document, selector);

        /**
         * Whether or not the menu is currently open.
         * @type {boolean}
         */
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

        setInputPreventDefault(false);
    }

    onOpening() {

    }

    onOpened() {

    }

    close() {
        
        this.element.classList.add(CLASS_MENU_CLOSED);
        this.isOpen = false;
        this.closed();

        setInputPreventDefault(true);
    }

    closed() {

    }
}