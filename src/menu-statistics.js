import { Menu } from './menu.js'
import { currentPlayer } from './player.js';

class StatisticField {

    constructor(selector, valueAccessor) {
        this.containerElement = document.querySelector(selector);
        if (!this.containerElement) {
            throw Error(`Failed to find element with selector "${selector}".`);
        }

        this.valueElement = this.containerElement.querySelector('.value');
        if (!this.valueElement) {
            throw Error(`Failed to find value element from statistic with selector "${selector}".`);
        }

        this.valueAccessor = valueAccessor;
    }

    refresh() {
        this.valueElement.innerText = this.valueAccessor();
    }
}

export class StatisticsMenu extends Menu {
    constructor() {
        super('#menu-statistics');

        function toRelativeTimeString(timestamp) {
            if (!timestamp) {
                return 'never';
            }

            const msPerMinute = 60 * 1000;
            const msPerHour = msPerMinute * 60;
            const msPerDay = msPerHour * 24;
            const msPerMonth = msPerDay * 30;
            const msPerYear = msPerDay * 365;

            const elapsedMs = new Date() - timestamp;
            if (elapsedMs < 1000) {
                return 'just now';
            }

            if (elapsedMs < msPerMinute) {
                return `${Math.round(elapsedMs / 1000)} seconds ago`;
            }

            if (elapsedMs < msPerHour) {
                return `${Math.round(elapsedMs / msPerMinute)} minutes ago`;
            }

            if (elapsedMs < msPerDay) {
                return `${Math.round(elapsedMs / msPerHour)} hours ago`;
            }

            if (elapsedMs < msPerMonth) {
                return `approximately ${Math.round(elapsedMs / msPerDay)} days ago`;
            }

            if (elapsedMs < msPerYear) {
                return `approximately ${Math.round(elapsedMs / msPerMonth)} months ago`;
            }

            return `approximately ${Math.round(elapsedMs / msPerYear)} years ago`;
        }

        this.fields = [
            new StatisticField('#statistic-created-on', () => {
                return toRelativeTimeString(currentPlayer.createdOn);
            }),
            new StatisticField('#statistic-last-saved-on', () => {
                return toRelativeTimeString(currentPlayer.lastSavedOn);              
            }),

            new StatisticField('#statistic-total-honeycomb-collected', () => {
                return currentPlayer.totalHoneycombCollected.toString();
            }),
            new StatisticField('#statistic-kill-count', () => {
                return currentPlayer.killCount.toString();
            }),
            new StatisticField('#statistic-death-count', () => {
                return currentPlayer.deathCount.toString();
            }),
            new StatisticField('#statistic-levels-started', () => {
                return currentPlayer.levelsStarted.toString();
            }),
            new StatisticField('#statistic-levels-completed', () => {
                return currentPlayer.levelsCompleted.toString();
            }),
            new StatisticField('#statistic-levels-failed', () => {
                return currentPlayer.levelsFailed.toString();
            }),
            new StatisticField('#statistic-perfect-levels-completed', () => {
                return currentPlayer.perfectLevelsCompleted.toString();
            }),
            new StatisticField('#statistic-flawless-levels-completed', () => {
                return currentPlayer.flawlessLevelsCompleted.toString();
            }),
            new StatisticField('#statistic-lucky-owls-spawned', () => {
                return currentPlayer.luckyOwlsSpawned.toString();
            }),
        ];
    }

    onOpening() {
        for (const field of this.fields) {
            field.refresh();
        }
    }

}