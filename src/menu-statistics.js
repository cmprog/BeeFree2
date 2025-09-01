import { Menu } from './menu.js'
import { PlayerLevel } from './player-level.js';
import { currentPlayer } from './player.js';
import { StandardLevelStatistics } from './statistics.js';

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
                return currentPlayer.prestigeStatistics.totalHoneycombCollected.toString();
            }),
            new StatisticField('#statistic-kill-count', () => {
                return currentPlayer.prestigeStatistics.killCount.toString();
            }),
            new StatisticField('#statistic-death-count', () => {
                return currentPlayer.prestigeStatistics.deathCount.toString();
            }),
            new StatisticField('#statistic-levels-started', () => {
                return this.sumLevelStats(v => v.prestigeStatistics.startCount).toString();
            }),
            new StatisticField('#statistic-levels-completed', () => {
                return this.sumLevelStats(v => v.prestigeStatistics.completedCount).toString();
            }),
            new StatisticField('#statistic-levels-failed', () => {
                return this.sumLevelStats(v => v.prestigeStatistics.failureCount).toString();
            }),
            new StatisticField('#statistic-perfect-levels-completed', () => {
                return this.sumLevelStats(v => v.prestigeStatistics.noSurvivorsCount).toString();
            }),
            new StatisticField('#statistic-flawless-levels-completed', () => {
                return this.sumLevelStats(v => v.prestigeStatistics.noDamangeCount).toString();
            }),
            new StatisticField('#statistic-lucky-owls-spawned', () => {
                return currentPlayer.prestigeStatistics.sammySpawnCount.toString();
            }),
        ];
    }

    /**
     * @callback LevelSelectorCallback
     * @param {PlayerLevel}
     * @returns {number}
     */

    /**
     * Sums the standard level statistics using a selection function for the specific statistic value.
     * @param {LevelSelectorCallback} levelSelector 
     * @returns {number}
     */
    sumLevelStats(levelSelector) {
        let total = 0;
        currentPlayer.levels.forEach(value => {
            total += levelSelector(value);
        });
        return total;
    }

    onOpening() {
        for (const field of this.fields) {
            field.refresh();
        }
    }

}