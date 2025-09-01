import { appendChildHtml } from './html.js';
import { Menu } from './menu.js'
import { PlayerLevel } from './player-level.js';
import { currentPlayer } from './player.js';
import { today } from './util.js';

class StatisticField {

    /**
     * @param {HTMLElement} parentEl 
     */
    constructor() {

        const templateHtml = `       
            <div class="statistic">
                <div class="label"></div>
                <div class="value"></div>
            </div>
        `;

        this.containerElement = document.createElement('div');
        
        appendChildHtml(this.containerElement, templateHtml);

        this.valueAccessor = undefined;
    }
    
    withValue(valueAccessor) {
        this.valueAccessor = valueAccessor;
    }

    withLabel(text) {
        const el = this.containerElement.querySelector('.label');
        el.innerText = text;
        return this;
    }

    refresh() {
        if (this.valueAccessor) {
            const el = this.containerElement.querySelector('.value');
            el.innerText = this.valueAccessor();
        }
    }
}

export class StatisticsMenu extends Menu {
    constructor() {
        super('#menu-statistics');

        /**
         * @type {StatisticField[]}
         */
        this.fields = [];

        this.appendField()
            .withLabel('first played')
            .withValue(() => {
                return this.toRelativeTimeString(currentPlayer.createdOn);
            });

        this.appendField()
            .withLabel('last saved')
            .withValue(() => {
                return this.toRelativeTimeString(currentPlayer.lastSavedOn); 
            });

        this.appendSeperator();

        this.appendField()
            .withLabel('honeycomb collected')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.totalHoneycombCollected.toString();
            });

        this.appendField()
            .withLabel('birds blasted')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.killCount.toString();
            });

        this.appendField()
            .withLabel('levels started')
            .withValue(() => {
                return this.sumLevelStats(x => x.prestigeStatistics.startCount).toString();
            });

        this.appendField()
            .withLabel('levels completed')
            .withValue(() => {
                return this.sumLevelStats(x => x.prestigeStatistics.completedCount).toString();
            });

        this.appendField()
            .withLabel('levels completed (no damage taken)')
            .withValue(() => {
                return this.sumLevelStats(x => x.prestigeStatistics.noDamangeCount).toString();
            });

        this.appendField()
            .withLabel('levels completed (no survivors)')
            .withValue(() => {
                return this.sumLevelStats(x => x.prestigeStatistics.noSurvivorsCount).toString();
            });

        this.appendField()
            .withLabel('levels completed (perfect)')
            .withValue(() => {
                return this.sumLevelStats(x => x.prestigeStatistics.perfectCount).toString();
            });

        this.appendField()
            .withLabel('levels failed')
            .withValue(() => {
                return this.sumLevelStats(x => x.prestigeStatistics.failureCount).toString();
            });

        this.appendField()
            .withLabel('deaths')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.deathCount.toString();
            });

        this.appendField()
            .withLabel('shots fired')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.shotCount.toString();
            });

        this.appendField()
            .withLabel('stingers fired')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.bulletCount.toString();
            });

        this.appendField()
            .withLabel('Sammys spawned')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.sammySpawnCount.toString();
            });

        this.appendField()
            .withLabel('Sammys collected')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.sammyCollectionCount.toString();
            });

        this.appendField()
            .withLabel('distance traveled')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.distanceTraveled.toString();
            });

        this.appendField()
            .withLabel('upgrades purchased')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.shopUpgradesPurchased.toString();
            });

        this.appendField()
            .withLabel('critical hits')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.criticalHitCount.toString();
            });
            
        this.appendField()
            .withLabel('time trials started')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.timeTrialLevelsStarted.toString();
            });
            
        this.appendField()
            .withLabel('damage taken')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.damageTaken.toString();
            });
            
        this.appendField()
            .withLabel('damage dealt')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.damageDealt.toString();
            });
            
        this.appendField()
            .withLabel('hits')
            .withValue(() => {
                return currentPlayer.prestigeStatistics.hitCount.toString();
            });            
            
        this.appendField()
            .withLabel('accuracy')
            .withValue(() => {

                if (!currentPlayer.prestigeStatistics.bulletCount) {
                    return 'N/A';
                }

                const hitPercentage = 
                    currentPlayer.prestigeStatistics.hitCount / 
                    currentPlayer.prestigeStatistics.bulletCount;

                return `${(100 * hitPercentage).toFixed(2)} %`;
            });

        this.appendSeperator();

        this.appendSectionHeading('Time Trial')

        this.appendField()
            .withLabel('today\'s best')
            .withValue(() => {

                // We must try resetting here
                currentPlayer.tryResetDailyTimeTrialStatistics(today());
                if (!currentPlayer.overallTimeTrailStatistics.longestDuration) {                    
                    return 'N/A';
                }

                return `${currentPlayer.dailyTimeTrialStatistics.longestDuration.toFixed(1)} seconds`;
            });

        this.appendField()
            .withLabel('overall best')
            .withValue(() => {
                if (!currentPlayer.overallTimeTrailStatistics.longestDuration) {                    
                    return 'N/A';
                }

                const longestDurationText = currentPlayer.overallTimeTrailStatistics.longestDuration.toFixed(1);
                const longestDurationDateText = currentPlayer.overallTimeTrailStatistics.longestDate.toDateString();
                return `${longestDurationText} seconds on ${longestDurationDateText}`;
            });
    }

    /**
     * Creates and appends a new statistics field.
     * @returns {StatisticField}
     */
    appendField() {

        const field = new StatisticField();
        this.fields.push(field);

        const contentEl = this.element.querySelector('.content');
        contentEl.appendChild(field.containerElement);

        return field;
    }

    appendSeperator() {
        const contentEl = this.element.querySelector('.content');
        contentEl.appendChild(document.createElement('hr'));
    }

    appendSectionHeading(text) {

        const headingEl = document.createElement('div');
        headingEl.classList.add('section-header');
        headingEl.innerText = text;

        const contentEl = this.element.querySelector('.content');
        contentEl.appendChild(headingEl);
    }

    /**
     * 
     * @param {Date} timestamp 
     * @returns {string}
     */
    toRelativeTimeString(timestamp) {

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