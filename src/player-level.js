export class PlayerLevel {
    constructor(id) {
        
        this.id = id;
        this.isUnlocked = false;

        this.startCount = 0;
        this.completedCount = 0;
        this.failureCount = 0;
        this.noDamangeCount = 0;
        this.noSurvivorsCount = 0;    
        this.perfectCount = 0;

        /**
         * The number of times the level was started in the current prestige.
         * @type {number}
         */
        this.prestigeStartCount = 0;

        /**
         * The number of times the level was completed in the current prestige.
         * @type {number}
         */
        this.prestigeCompleteCount = 0;

        /**
         * The number of times the level was failed in the current prestige.
         * @type {number}
         */
        this.prestigeFailureCount = 0;

        /**
         * The number of times the level was completed without taking damange in the current prestige.
         * @type {number}
         */
        this.prestigeNoDamangeCount = 0;

        /**
         * The number of times the level was completed without any bird survivors in the current prestige.
         * @type {number}
         */
        this.prestigeNoSurvivorsCount = 0;

        /**
         * The number of times the level was completed both without taking damange or leaving survivors in the current prestige.
         * @type {number}
         */
        this.prestigePerfectCount = 0;
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

            startCount: this.startCount,
            completedCount: this.completedCount,
            failureCount: this.failureCount,
            noDamangeCount: this.noDamangeCount,
            noSurvivorsCount: this.noSurvivorsCount,
            perfectCount: this.perfectCount,

            prestigeStartCount: this.prestigeStartCount,
            prestigeCompleteCount: this.prestigeCompleteCount,
            prestigeFailureCount: this.prestigeFailureCount,
            prestigeNoDamangeCount: this.prestigeNoDamangeCount,
            prestigeNoSurvivorsCount: this.prestigeNoSurvivorsCount,
            prestigePerfectCount: this.prestigePerfectCount,
        }
    }

    loadSaveObj(saveObj) {
        
        if (saveObj.id != this.id) {
            logError(`Unexpected level id. Expected ${this.id} but got ${saveObj.id}.`);            
        }

        // CARE SHOULD BE HAD TO ENSURE WE CAN LOAD OLD SAVES
        
        this.isUnlocked = saveObj.isUnlocked;

        this.startCount = saveObj.startCount || 0;        
        this.completedCount = saveObj.completedCount || 0;
        this.failureCount = saveObj.failureCount || 0;
        this.noDamangeCount = saveObj.noDamangeCount || 0;
        this.noSurvivorsCount = saveObj.noSurvivorsCount || 0;
        this.perfectCount = saveObj.perfectCount || 0;

        this.prestigeStartCount = saveObj.prestigeStartCount || 0;        
        this.prestigeCompleteCount = saveObj.prestigeCompleteCount || 0;
        this.prestigeFailureCount = saveObj.prestigeFailureCount || 0;
        this.prestigeNoDamangeCount = saveObj.prestigeNoDamangeCount || 0;
        this.prestigeNoSurvivorsCount = saveObj.prestigeNoSurvivorsCount || 0;
        this.prestigePerfectCount = saveObj.prestigePerfectCount || 0;
    }
}