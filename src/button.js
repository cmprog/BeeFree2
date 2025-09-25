import { registerClick } from "./util.js";

export class DoubleClickButton {

    /**
     * @callback OnClickCallback
     * @param {DoubleClickButton}
     */
    
    /**
     * 
     * @param {HTMLElement} el 
     */
    constructor(el) {

        /**
         * @type {HTMLElement}
         */
        this.element = el;

        /**
         * @type {number}
         */
        this.confirmationTimeoutDuration = 2000;

        /**
         * @callback GetTextCallback
         * @param {DoubleClickButton}
         */

        /**
         * @type {string}
         */
        this.defaultText = undefined;

        /**
         * @type {GetTextCallback}
         */
        this.defaultTextSelector = undefined;

        /**
         * @type {string}
         */
        this.confirmationText = undefined;

        /**
         * @type {GetTextCallback}
         */
        this.confirmationTextSelector = undefined;

        /**
         * @type {OnClickCallback}
         */
        this.onClick = undefined;

        registerClick(this.element, this.onElementClicked.bind(this));
    }

    onElementClicked() {

        if (this.clickTimeout) {
            
            this.clearTimeout();
            this.refreshText();
            
            if (this.onClick) {
                this.onClick(this);
            }
            
        } else {

            this.setTimeout();
            this.refreshText();

        }
    }

    clearTimeout() {
        if (this.clickTimeout) {
            window.clearTimeout(this.clickTimeout);
            this.clickTimeout = undefined;
        }
    }

    setTimeout() {

        this.clickTimeout = window.setTimeout(
            this.onTimeout.bind(this), 
            this.confirmationTimeoutDuration);
    }

    onTimeout() {
        this.clearTimeout();
        this.refreshText();
    }
    
    refreshText() {
        if (this.clickTimeout) {
            this.element.innerText = this.resolveText(this.confirmationText, this.confirmationTextSelector, 'Are you sure?');
        } else {
            this.element.innerText = this.resolveText(this.defaultText, this.defaultTextSelector, 'Do thing!');
        }
    }

    resolveText(fixedText, textCallback, defaultText) {
        if (fixedText) return fixedText;
        if (textCallback) return textCallback(this);
        return defaultText;
    }

    /**
     * @param {HTMLElement} el 
     * @param {OnClickCallback}
     * @returns {DoubleClickButton}
     */
    static create(el, onClick) {

        const button = new DoubleClickButton(el);        
        button.onClick = onClick;

        button.defaultText = el.innerText;
        button.confirmationText = el.dataset['confirmation-text'];

        return button;
    }
}