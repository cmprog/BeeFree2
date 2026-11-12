import { registerClick } from "../core/util.js";

/**
 * @callback OnClickCallback
 * @param {DoubleClickButton} doubleClickButton
 * @returns {void}
 */

/**
 * @callback GetTextCallback
 * @param {DoubleClickButton} doubleClickButton
 * @returns {string}
 */

/**
 * A button which must be clicked twice to act. The first click changes its text to a
 * confirmation message, and the second click (within a couple of seconds) runs the action.
 */
export class DoubleClickButton {

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
     * @param {OnClickCallback} onClick
     * @returns {DoubleClickButton}
     */
    static create(el, onClick) {

        const button = new DoubleClickButton(el);        
        button.onClick = onClick;

        button.defaultText = el.innerText;
        button.confirmationText = el.dataset.confirmationText;

        return button;
    }
}