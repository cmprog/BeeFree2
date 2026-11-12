import { GAME_SETTINGS } from "./settings.js";

// Just defining something to use like an enum
const LogLevel = Object.freeze({
    DEBUG: { displayText: "DEBUG", className: "debug", browserLog: console.debug.bind(console), },
    INFO: { displayText: "INFO", className: "info", browserLog: console.info.bind(console), },
    WARN: { displayText: "WARN", className: "warning", browserLog: console.warn.bind(console), },
    ERROR: {  displayText: "ERROR", className: "error", browserLog: console.error.bind(console), }
});

const LOG_LEVELS = Object.keys(LogLevel).map(x => LogLevel[x]);

function leftPad(text, char, length) {
    const requiredPadding = length - text.length;
    if (requiredPadding > 0) {
        text = char.repeat(requiredPadding) + text;
    }
    return text;
}

function formatTimestamp(timestamp) {
    const hourText = leftPad(timestamp.getHours().toString(), '0', 2);
    const minText = leftPad(timestamp.getMinutes().toString(), '0', 2);
    const secText = leftPad(timestamp.getSeconds().toString(), '0', 2);    
    return `${hourText}:${minText}:${secText}`;
}

/**
 * Writes log messages to the browser console and, on localhost, to the on-screen log panel.
 * The panel exists so output can be seen on devices without dev tools, such as phones.
 *
 * Nothing touches the page or the console methods until initLogging() is called, so modules
 * can be loaded outside a browser. Messages logged before then are kept and shown in the
 * panel once it is attached.
 */
class Logger {

    constructor() {

        this.consoleLoggingEnabled = true;

        /** Whether messages go to the on-screen panel. Decided by initLogging(). */
        this.uiLoggingEnabled = false;

        /** Whether initLogging() has run. */
        this.isInitialized = false;

        /**
         * Panel entries logged before initLogging() ran.
         * @type {Array<[timestamp: string, level: object, message: string]>}
         */
        this.pendingUiEntries = [];

        /** @type {HTMLElement} */
        this.listElement = undefined;
        /** @type {HTMLElement} */
        this.scrollElement = undefined;

        this.isEnabled = {};
        for (const level of LOG_LEVELS) {
            this.isEnabled[level.displayText] = true;
        }
    }

    /**
     * Attaches to the log panel and starts mirroring everything written to the console into it.
     */
    init() {

        if (this.isInitialized) return;
        this.isInitialized = true;

        console.log = this.interceptBrowserConsole.bind(this, LogLevel.INFO);
        console.info = this.interceptBrowserConsole.bind(this, LogLevel.INFO);
        console.debug = this.interceptBrowserConsole.bind(this, LogLevel.DEBUG);
        console.warn = this.interceptBrowserConsole.bind(this, LogLevel.WARN);
        console.error = this.interceptBrowserConsole.bind(this, LogLevel.ERROR);
        console.assert = this.interceptBrowserAssert.bind(this);

        this.listElement = document.querySelector('.log-messages');
        this.scrollElement = document.querySelector('.log-container > .content');

        this.uiLoggingEnabled = GAME_SETTINGS.IS_LOCAL_DEV_ENVIRONMENT;

        if (!this.uiLoggingEnabled) {
            document.querySelector('.log-container').classList.add('hidden');
        }

        const pending = this.pendingUiEntries;
        this.pendingUiEntries = [];
        for (const entry of pending) {
            this.logToUI(...entry);
        }
    }

    log(level, message) {

        if (!this.isEnabled[level.displayText]) return;

        const formattedTimestamp = formatTimestamp(new Date());

        this.logToConsole(formattedTimestamp, level, message);
        this.logToUI(formattedTimestamp, level, message);
    }

    logToUI(formattedTimestamp, level, message) {

        if (!this.isInitialized) {
            this.pendingUiEntries.push([formattedTimestamp, level, message]);
            return;
        }

        if (!this.uiLoggingEnabled) return;

        const timeElement = document.createElement('span');
        timeElement.classList.add('time');
        timeElement.innerText = formattedTimestamp;

        const levelElement = document.createElement('span');
        levelElement.classList.add('level');
        levelElement.innerText = level.displayText;

        const messageElement = document.createElement('span');
        messageElement.classList.add('message');
        messageElement.innerText = message;

        const itemElement = document.createElement('li');
        itemElement.classList.add('log-message', level.className);
        itemElement.appendChild(timeElement);
        itemElement.appendChild(levelElement);
        itemElement.appendChild(messageElement);

        this.listElement.appendChild(itemElement);

        this.scrollElement.scrollTo(0, this.scrollElement.scrollHeight);
    }

    logToConsole(formattedTimestamp, level, message) {
        if (!this.consoleLoggingEnabled) return;        
        level.browserLog(`[${formattedTimestamp}] [${level.displayText}] ${message}`);
    }

    interceptBrowserConsole(level, ...args) {
        this.logToUI(formatTimestamp(new Date()), level, args.map(String).join(' '));
        level.browserLog(...args);
    }

    interceptBrowserAssert(condition, ...args) {
        if (condition) return;        
        this.log(LogLevel.ERROR, "Assertion failed: " + args);
    }
}

const LOGGER = new Logger();

/**
 * Starts the on-screen log panel (on localhost) and mirrors console output into it.
 * Called once by game.js at startup.
 */
export function initLogging() {
    LOGGER.init();
}

export function logDebug(message) {
    LOGGER.log(LogLevel.DEBUG, message);
}

export function logInfo(message) {
    LOGGER.log(LogLevel.INFO, message);
}

export function logWarning(message) {
    LOGGER.log(LogLevel.WARN, message);
}

export function logError(message) {
    LOGGER.log(LogLevel.ERROR, message);
}