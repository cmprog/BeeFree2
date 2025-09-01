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

        this.prestigeStatistics.onStarted();
        this.overallStatistics.onStarted();
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

        this.prestigeStatistics.onCompleted(failed, noDamage, noSurvivors);
        this.overallStatistics.onCompleted(failed, noDamage, noSurvivors);
        
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