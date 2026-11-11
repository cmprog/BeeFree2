import { Bee } from "./bee.js";
import { BIRD_TEMPLATES, BirdTemplate } from "./birds.js";
import { LevelScoreTracker, ProgressBar } from "./entities.js";
import { RENDER_LAYERS } from "./layers.js";
import { logDebug, logInfo } from "./logging.js";
import { LevelDefinition } from "./level-definition.js";
import { LEVELS } from "./level-list.js";
import { LevelSummaryMenu } from "./menu-level-summary.js";
import { MENUS } from "./menu-registry.js";
import { Owl } from "./owl.js";
import { currentPlayer } from "./player.js";
import { pickRandomHat } from "./hats.js";
import { BASE_SAMMY_CHANCE, SAMMY_PARTY_SAMMY_HAT_CHANCE, STANDARD_LEVEL_EARNING_DECAY_BASE, NO_DAMAGE_TOKEN_LEVEL_BONUS, NO_SURVIVORS_LEVEL_BONUS, PERFECT_LEVEL_BONUS, STANDARD_LEVEL_FAILURE_EARN_RATE, TIME_TRIAL_LEVEL_EARNING_DECAY_BASE, TIME_TRIAL_PHASE_DURATION } from "./settings.js";
import { SPAWN_REGIONS } from "./spawning.js";
import { spriteAtlas } from "./sprites.js";
import { FONTS, getWorldSize } from "./util.js";

class Level extends EngineObject {

    constructor() {

        super();

        this.trackedObjects = [];

        this.bee = this.trackObj(new Bee(currentPlayer.beeAttributes));
        
        this.attributes = currentPlayer.levelAttributes.copy();

        this.sammyTimer = new Timer();

        this.birdSpawnCount = 0;
        this.birdKillCount = 0;
        this.honeycombCollected = 0;
        this.noDamage = true;
        this.levelFailed = false;
        this.isBeeAlive = true;

        touchGamepadEnable = true;   
    }

    /**
     * @template T
     * @param {T} obj 
     * @returns {T}
     */
    trackObj(obj) {
        this.trackedObjects.push(obj);
        return obj;
    }

    update() {

        if (!this.isBeeAlive || this.isLevelComplete()) {

            /**
             * @type {LevelSummaryMenu}
             */
            const levelSummaryMenu = MENUS.LEVEL_SUMMARY;
            levelSummaryMenu.levelFailed = this.levelFailed;
            this.onLevelCompleted(levelSummaryMenu);
            levelSummaryMenu.open();

            this.destroy();

            // The level is over, nothing else should spawn. Subclasses must
            // also check `this.destroyed` after calling `super.update()`.
            return;
        }

        if (randInt(0, BASE_SAMMY_CHANCE * (1 / this.attributes.sammyChance)) == 0) {
            
            // This gets the bottom right - but to get a positive size
            // we just flip the y-sign
            const worldSize = screenToWorld(mainCanvasSize);
            worldSize.y = -worldSize.y;

            const spawnRandom = new RandomGenerator(time);

            const margin = vec2(10, 10);
            const spawnRegion = randInt(0, 2) == 0 ? SPAWN_REGIONS.LEFT_UPPER : SPAWN_REGIONS.LEFT_LOWER;
            const sammyPos = spawnRegion.getRandomPosition(spawnRandom, worldSize, margin);

            const sammy = this.trackObj(new Owl(sammyPos));
            sammy.velocity = vec2(1, 0).normalize(this.attributes.sammySpeed);

            // Sammy sometimes shows up to his own party in a hat.
            if (this.isSammyPartyTime() && (rand() < SAMMY_PARTY_SAMMY_HAT_CHANCE)) {
                sammy.wearHat(pickRandomHat().id);
            }

            if (currentPlayer) {
                currentPlayer.onSammySpawned();
            }

            logInfo(`Sammy spawn at ${sammy.pos}!`);
        }
    }

    /**
     * A hook for levels to perform whatever close-out logic needed to end the level.
     * @param {LevelSummaryMenu} levelSummaryMenu 
     */
    onLevelCompleted(levelSummaryMenu) { 
    }

    getExitMenu() {
        return MENUS.MAIN;
    }

    getExitMenuText() {
        return 'Return to main menu';
    }

    isLevelComplete() {
        return false;
    }

    isComplete() {
        return false;
    }

    onBirdSpawned() {
        this.birdSpawnCount += 1;
    }

    onBirdKilled() {
        this.birdKillCount += 1;
    }

    onBeeDamageTaken() {
        this.noDamage = false;   
    }

    onBeeDeath() {
        this.isBeeAlive = false;
    }

    onHoneycombCollected(amount) {
        this.honeycombCollected += amount;
    }

    onSammyCollected() {        
        this.sammyTimer.set(this.attributes.sammyDuration);
    }

    /**
     * Checks if it is currently Sammy party time - what more is there to be said?
     * @returns {boolean}
     */
    isSammyPartyTime() {
        return this.sammyTimer.active();
    }

    destroy() {
        super.destroy();

        for (const obj of this.trackedObjects) {
            obj.destroy();
        }

        currentLevel = undefined;
        touchGamepadEnable = false;
    }

    render() {
        // Purposefully blank since we don't care about default rendering
    }
}

/**
 * @type {Level}
 */
export let currentLevel;

class StandardLevel extends Level {
    
    constructor(levelDefinition) {

        super();

        this.id = levelDefinition.id;
        this.levelDefinition = levelDefinition;        
        this.levelTimer = new Timer(this.levelDefinition.totalDuration);
        this.spawner = levelDefinition.createSpawner();

        this.timeRemainingBar = this.trackObj(new ProgressBar());
        this.timeRemainingBar.size = vec2(10, 1.0);
        this.timeRemainingBar.borderColor = YELLOW;
        this.timeRemainingBar.borderStyle = spriteAtlas.borders.flat.style11;
        this.timeRemainingBar.renderOrder = RENDER_LAYERS.HUD;

        this.scoreTracker = this.trackObj(new LevelScoreTracker());

        const margin = vec2(0.1);

        const halfWorldSize = screenToWorld(mainCanvasSize);
        halfWorldSize.y = -halfWorldSize.y;

        this.timeRemainingBar.pos = vec2(
            -halfWorldSize.x + (this.timeRemainingBar.size.x * 0.5) + margin.x,
            halfWorldSize.y - (this.timeRemainingBar.size.y * 0.5) - margin.y,
        );

        this.scoreTracker.pos = vec2(
            halfWorldSize.x - (this.scoreTracker.size.x * 0.5) - margin.x,
            halfWorldSize.y - (this.scoreTracker.size.y * 0.5) - margin.y,
        );
    }

    isLevelComplete() {
        return this.levelTimer.elapsed();
    }

    /**
     * 
     * @param {LevelSummaryMenu} levelSummaryMenu 
     */
    onLevelCompleted(levelSummaryMenu) {

        const noSurvivors = this.birdSpawnCount == this.birdKillCount;
        currentPlayer.onStandardLevelCompleted(this.id, this.levelFailed, this.noDamage, noSurvivors);

        if (this.id + 1 < LEVELS.length) {
            currentPlayer.markLevelAvailable(this.id + 1);
        }

        let honeycombEarned = this.honeycombCollected;

        levelSummaryMenu.addItem(
            'honeycomb collected', '', 
            honeycombEarned.toFixed(1));

        if (this.levelFailed) {

            levelSummaryMenu.addItem(
                'failure', 
                `${((1 - STANDARD_LEVEL_FAILURE_EARN_RATE) * 100).toFixed(0)}% penalty`, 
                `- ${(honeycombEarned * (1 - STANDARD_LEVEL_FAILURE_EARN_RATE)).toFixed(1)}`);

            honeycombEarned = honeycombEarned * STANDARD_LEVEL_FAILURE_EARN_RATE;

        } else {

            // Each bonus is a percentage of the collected honeycomb (before any
            // other bonus), so they stack additively.
            let bonusAmount = 0;

            if (this.noDamage) {
                const bonus = honeycombEarned * NO_DAMAGE_TOKEN_LEVEL_BONUS;
                bonusAmount += bonus;
                levelSummaryMenu.addItem(
                    'no damage taken',
                    `${(NO_DAMAGE_TOKEN_LEVEL_BONUS * 100).toFixed(0)}% bonus`,
                    `+ ${bonus.toFixed(1)}`,
                    '<div class="level-badge level-badge-no-damage"></div>'
                )
            }

            if (noSurvivors) {
                const bonus = honeycombEarned * NO_SURVIVORS_LEVEL_BONUS;
                bonusAmount += bonus;
                levelSummaryMenu.addItem(
                    'no survivors',
                    `${(NO_SURVIVORS_LEVEL_BONUS * 100).toFixed(0)}% bonus`,
                    `+ ${bonus.toFixed(1)}`,
                    '<div class="level-badge level-badge-no-survivors"></div>'
                )
            }

            if (this.noDamage && noSurvivors) {
                const bonus = honeycombEarned * PERFECT_LEVEL_BONUS;
                bonusAmount += bonus;
                levelSummaryMenu.addItem(
                    'perfect',
                    `${(PERFECT_LEVEL_BONUS * 100).toFixed(0)}% bonus`,
                    `+ ${bonus.toFixed(1)}`,
                    '<div class="level-badge level-badge-perfect"></div>'
                )
            }

            honeycombEarned += bonusAmount;
        }

        if (currentPlayer.prestigeHoneycombMultiplier > 1) {
            
            levelSummaryMenu.addItem(
                'leveled-up earnings', 
                `${((currentPlayer.prestigeHoneycombMultiplier - 1) * 100).toFixed(0)}% bonus`, 
                `+ ${(honeycombEarned * (currentPlayer.prestigeHoneycombMultiplier - 1)).toFixed(1)}`);

            honeycombEarned = honeycombEarned * currentPlayer.prestigeHoneycombMultiplier;
        }

        const playerLevel = currentPlayer.getLevel(this.id);
        // Subtract so the first time played causes a decay of 0
        const decayLevel = playerLevel.prestigeStatistics.startCount - 1;    
        
        if (decayLevel) {

            const replayDecayAmount = Math.pow(STANDARD_LEVEL_EARNING_DECAY_BASE, decayLevel);

            levelSummaryMenu.addItem(
                'diminishing returns', 
                `${((1 - replayDecayAmount) * 100).toFixed(0)}% penalty`, 
                `- ${(honeycombEarned * (1 - replayDecayAmount)).toFixed(1)}`);

            honeycombEarned = honeycombEarned * replayDecayAmount;
        }

        levelSummaryMenu.totalHoneycombEarned = honeycombEarned;
        
        currentPlayer.onHoneycombCollected(honeycombEarned);
        currentPlayer.save();

        levelSummaryMenu.returnMenu = MENUS.LEVEL_SELECTION;
        levelSummaryMenu.returnMenuText = 'Return to level selection';
    }

    onBeeDeath() {
        super.onBeeDeath();
        this.levelFailed = true;
    }

    update() {

        super.update();
        if (this.destroyed) return;

        this.spawner.update();

        this.scoreTracker.value = this.honeycombCollected;

        const timeRemaining = -this.levelTimer.get();
        this.timeRemainingBar.value = timeRemaining / this.levelDefinition.totalDuration;
    }

    isComplete() {
        return this.levelTimer.elapsed();
    }

    render() {
        const formattedSecondsRemaining = `${(Math.max(0, -this.levelTimer.get())).toFixed(1)} s`
        drawTextOverlay(formattedSecondsRemaining, this.timeRemainingBar.pos, 0.8 * this.timeRemainingBar.size.y, BLACK, undefined, undefined, undefined, FONTS.SECONDARY);
        drawTextOverlay('time remaining', this.timeRemainingBar.pos.add(vec2(0, -this.timeRemainingBar.size.y)), 0.8 * this.timeRemainingBar.size.y, BLACK, undefined, undefined, undefined, FONTS.SECONDARY);
    }
}

 class TimeTrialLevel extends Level {

    constructor() {
        super();

        this.timeRemainingBar = new ProgressBar();
        this.trackObj(this.timeRemainingBar);

        this.timeRemainingBar.size = vec2(10, 1.0);
        this.timeRemainingBar.value = 1;

        const currentDate = new Date();
        const currentDateValue = currentDate.setHours(0, 0, 0, 0);

        // Seed the random generator with a value representing the current date
        // This means the level is the same per calendar day but will change daily.
        this.rand = new RandomGenerator(currentDateValue);
        this.spawnTimer = new Timer();

        this.availableBirdKeys = Object.keys(BIRD_TEMPLATES);        
        this.availableBirdKeysByPhase = { };

        const maxPhase = Math.max(... Object.keys(BIRD_TEMPLATES)
            .map(key => BIRD_TEMPLATES[key].timeTrialPhase || 0));

        // Places a copy of each key in all defined phase buckets greater than
        // or equal to the phase in which it exists
        for (let targetPhase = 0; targetPhase <= maxPhase; targetPhase += 1) {

            // This should only happen if there are 'gaps' in the declared
            // phases of the bird templates
            if (!(targetPhase in this.availableBirdKeysByPhase)) {
                this.availableBirdKeysByPhase[targetPhase] = [];
            }

            const targetPhaseKeySet = this.availableBirdKeysByPhase[targetPhase];

            for (const key of this.availableBirdKeys) {
                
                /**
                 * @type {BirdTemplate}
                 */
                const birdTemplate = BIRD_TEMPLATES[key];

                if (birdTemplate.timeTrialPhase <= targetPhase) {
                    targetPhaseKeySet.push(key);
                }
            }
        }

        this.levelDuration = 0;

        const margin = vec2(0.1);

        this.timeRemainingBar.pos = screenToWorld(mainCanvasSize).scale(-1)
            .add(vec2((this.timeRemainingBar.size.x * 0.5) + margin.x, (-this.timeRemainingBar.size.y * 0.5) - margin.y));

        this.resetSpawnTimer();
    }

    resetSpawnTimer() {
        const spawnBaseValue = 0.99;
        this.spawnTimer.set(2 * Math.pow(spawnBaseValue, this.levelDuration));
    }

    /**
     * 
     * @param {LevelSummaryMenu} levelSummaryMenu 
     */
    onLevelCompleted(levelSummaryMenu) {
    
        let honeycombEarned = this.honeycombCollected;
        
        levelSummaryMenu.addItem(
            'honeycomb collected', '', 
            honeycombEarned.toFixed(1));

        if (currentPlayer.prestigeHoneycombMultiplier > 1) {
            
            levelSummaryMenu.addItem(
                'leveled-up earnings', 
                `${((currentPlayer.prestigeHoneycombMultiplier - 1) * 100).toFixed(0)}% bonus`, 
                `+ ${(honeycombEarned * (currentPlayer.prestigeHoneycombMultiplier - 1)).toFixed(1)}`);

            honeycombEarned = honeycombEarned * currentPlayer.prestigeHoneycombMultiplier;
        }

        // Subtract so the first time played causes a decay of 0
        const decayLevel = currentPlayer.prestigeStatistics.timeTrialLevelsStarted - 1;
        
        if (decayLevel) {

            const replayDecayAmount = Math.pow(TIME_TRIAL_LEVEL_EARNING_DECAY_BASE, decayLevel);

            levelSummaryMenu.addItem(
                'diminishing returns', 
                `${((1 - replayDecayAmount) * 100).toFixed(0)}% penalty`, 
                `- ${(honeycombEarned * (1 - replayDecayAmount)).toFixed(1)}`);

            honeycombEarned = honeycombEarned * replayDecayAmount;
        }

        if (currentPlayer.isDailyTimeTrialRecord(this.levelDuration)) {

            let bonusText = `${this.levelDuration.toFixed(0)}s`;

            if (currentPlayer.dailyTimeTrialStatistics.longestDuration) {
                bonusText = `${currentPlayer.dailyTimeTrialStatistics.longestDuration.toFixed(0)}s -> ${bonusText}`;                
            }  

            levelSummaryMenu.addItem('new daily record!', bonusText, '');
        }
        
        if (currentPlayer.isOverallTimeTrialRecord(this.levelDuration)) {

            let bonusText = `${this.levelDuration.toFixed(0)}s`;

            if (currentPlayer.overallTimeTrailStatistics.longestDuration) {
                bonusText = `${currentPlayer.overallTimeTrailStatistics.longestDuration.toFixed(0)}s -> ${bonusText}`;
            }  

            levelSummaryMenu.addItem('new overall record!', bonusText, '');
        }

        levelSummaryMenu.totalHoneycombEarned = honeycombEarned;
        
        currentPlayer.onHoneycombCollected(honeycombEarned);
        currentPlayer.onTimeTrialCompleted(this.levelDuration);
        currentPlayer.save();

        levelSummaryMenu.returnMenu = MENUS.MAIN;
        levelSummaryMenu.returnMenuText = 'Return to main menu';
    }

    spawn() {

        const currentPhase = Math.trunc(this.levelDuration / TIME_TRIAL_PHASE_DURATION);

        // Select the set of available keys based on the current phase
        const birdTemplateKeySet = (currentPhase in this.availableBirdKeysByPhase)
            ? this.availableBirdKeysByPhase[currentPhase]
            : this.availableBirdKeys;

        const birdTemplateKey = birdTemplateKeySet[this.rand.int(0, birdTemplateKeySet.length)];
        const birdTemplate = BIRD_TEMPLATES[birdTemplateKey];

        // This gets the bottom right - but to get a positive size
        // we just flip the y-sign
        const worldSize = screenToWorld(mainCanvasSize);
        worldSize.y = -worldSize.y;

        const margin = vec2(1, 1);

        // Default to the right side of the screen. Don't modify the template's
        // array since templates are shared across every level.
        const spawnRegions = birdTemplate.spawnRegions.length
            ? birdTemplate.spawnRegions
            : [SPAWN_REGIONS.RIGHT_UPPER, SPAWN_REGIONS.RIGHT_LOWER];

        const targetSpawnRegion = spawnRegions[this.rand.int(0, spawnRegions.length)];
        const pos = targetSpawnRegion.getRandomPosition(this.rand, worldSize, margin);

        const bird = birdTemplate.create(pos);

        logDebug(`Spawning '${birdTemplate.name}' at '${pos}'.`);

        this.trackObj(bird);
        this.onBirdSpawned();
    }

    update() {

        super.update();
        if (this.destroyed) return;

        this.levelDuration = time - this.spawnTime;

        if (this.spawnTimer.elapsed()) {
            this.spawn();
            this.resetSpawnTimer();
        }
    }

    render() {
        const formattedLevelDuration = `${(time - this.spawnTime).toFixed(1)} s`
        drawTextOverlay(formattedLevelDuration, this.timeRemainingBar.pos, 0.8 * this.timeRemainingBar.size.y, BLACK, undefined, undefined, undefined, FONTS.SECONDARY);
    }
}

export function startTimeTrial() {

    if (currentPlayer) {
        currentPlayer.onTimeTrialStarted();
    }

    currentLevel = new TimeTrialLevel();
}

/**
 * Starts a scripted level.
 * @param {LevelDefinition} levelDefinition
 */
export function startStandardLevel(levelDefinition) {
    currentLevel = new StandardLevel(levelDefinition);
    currentPlayer.onLevelStarted(levelDefinition.id);
}
