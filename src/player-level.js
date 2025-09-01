import { StandardLevelStatistics } from "./statistics.js";

export class PlayerLevel {
    constructor(id) {
        
        this.id = id;
        this.isUnlocked = false;

        this.overallStatistics = new StandardLevelStatistics();
        this.prestigeStatistics = new StandardLevelStatistics();
    }

    onLevelStarted() {

        if (!this.isUnlocked) {
            logError(`Level started but not unlocked.`);
        }

        this.startCount += 1;
        this.prestigeStartCount += 1;
    }

    /**
     * Signals that the level was completed - updates stats.
     * @param {boolean} failed 
     * @param {boolean} noDamage 
     * @param {boolean} noSurvivors 
     */
    onLevelCompleted(failed, noDamage, noSurvivors) {

        if (!this.isUnlocked) {
            logError(`Level completed but not unlocked.`);
        }

        if (failed) {
            this.failureCount += 1;
            this.prestigeFailureCount += 1;

        } else {

            this.completedCount += 1;
            this.prestigeCompleteCount += 1;

            if (noDamage) {
                this.noDamangeCount += 1;
                this.prestigeNoDamangeCount += 1;
            }

            if (noSurvivors) {
                this.noSurvivorsCount += 1;
                this.prestigeNoSurvivorsCount += 1;
            }

            if (noDamage && noSurvivors) {
                this.perfectCount += 1;
                this.prestigePerfectCount += 1;
            }
        }
        
    }

    markAvailable() {
        this.isUnlocked = true;
    }

    /**
     * Creates a bare DTO save object containing the player level data.
     * @returns {object}
     */
    toSaveObj() {
        
        return {            
            
            id: this.id,
            isUnlocked: this.isUnlocked,

            overallStatistics: this.overallStatistics.toSaveObj(),
            prestigeStatistics: this.prestigeStatistics.toSaveObj(),
        }
    }

    loadSaveObj(saveObj) {
        
        if (saveObj.id != this.id) {
            logError(`Unexpected level id. Expected ${this.id} but got ${saveObj.id}.`);           
        }

        // ********************************************************
        // CARE SHOULD BE HAD TO ENSURE WE CAN LOAD OLD SAVES
        // ********************************************************
        
        this.isUnlocked = saveObj.isUnlocked;

        this.overallStatistics.loadSaveObj(saveObj.overallStatistics);
        this.prestigeStatistics.loadSaveObj(saveObj.prestigeStatistics);
    }
}