import { Bee } from "./bee.js";
import { BIRD_TEMPLATES, BirdTemplate } from "./birds.js";
import { LevelScoreTracker, ProgressBar } from "./entities.js";
import { RENDER_LAYERS } from "./layers.js";
import { logDebug, logInfo } from "./logging.js";
import { LevelSummaryMenu } from "./menu-level-summary.js";
import { MENUS } from "./menus.js";
import { Owl } from "./owl.js";
import { currentPlayer } from "./player.js";
import { BASE_SAMMY_CHANCE, DEFAULT_LEVEL_ATTRIBUTES, STANDARD_LEVEL_EARNING_DECAY_BASE, NO_DAMAGE_TOKEN_LEVEL_BONUS, NO_SURVIVORS_LEVEL_BONUS, PERFECT_LEVEL_BONUS, STANDARD_LEVEL_FAILURE_EARN_RATE, TIME_TRIAL_LEVEL_EARNING_DECAY_BASE, TIME_TRIAL_PHASE_DURATION } from "./settings.js";
import { FormationDefinition, SpawnDefinition, SpawnerCollection, FormationCreationOptions, SPAWN_REGIONS } from "./spawning.js";
import { spriteAtlas } from "./sprites.js";
import { FONTS, getWorldSize } from "./util.js";

class LevelDefinition {
    constructor(id, name) {

        this.id = id;
        this.name = name;
        this.spawns = [];

        this.totalDuration = 0;
    }

    /**
     * @param {BirdTemplate} template
     * @param {Number} delay
     * @param {Vector2} pos
     */
    withSpawn(template, delay, pos) {
        const time = this.totalDuration + delay;
        const definition = new SpawnDefinition(template, time, pos);
        this.spawns.push(definition);
        this.totalDuration += delay;
        return this;
    }

    /**
     * @param {FormationDefinition} formation
     * @param {FormationCreationOptions} [options]
     */
    withFormation(formation, options) {
        let previousSpawnTime = 0;
        for (const spawn of formation.createSpawns(options)) {
            const delay = spawn.time - previousSpawnTime;
            this.withSpawn(spawn.template, delay, spawn.pos);
            previousSpawnTime = spawn.time;
        }
        return this;
    }

    /**
     * @param {Number} duration
     */
    withDelay(duration) {
        this.totalDuration += duration;
        return this;
    }

    createSpawner() {
        return new SpawnerCollection(this.spawns.map(x => x.create()));
    }

    startLevel() {
        currentLevel = new StandardLevel(this);

        currentPlayer.onLevelStarted(this.id);
    }
}

class Level extends EngineObject {

    constructor() {

        super();

        this.trackedObjects = [];

        this.bee = this.trackObj(new Bee(currentPlayer.beeAttributes));
        
        this.attributes = DEFAULT_LEVEL_ATTRIBUTES.copy();

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
            this.onLevelCompleted(levelSummaryMenu);
            levelSummaryMenu.open();

            this.destroy();      
        }

        if (randInt(0, BASE_SAMMY_CHANCE * (1 / this.attributes.sammyChance)) == 0) {
            
            // This gets the bottom right - but to get a positive size
            // we just flip the y-sign
            const worldSize = screenToWorld(mainCanvasSize);
            worldSize.y = -worldSize.y;

            const rand = new RandomGenerator(time);

            const margin = vec2(10, 10);
            const spawnRegion = randInt(0, 2) == 0 ? SPAWN_REGIONS.LEFT_UPPER : SPAWN_REGIONS.LEFT_LOWER;
            const sammyPos = spawnRegion.getRandomPosition(rand, worldSize, margin);

            const sammy = this.trackObj(new Owl(sammyPos));
            sammy.velocity = vec2(1, 0).normalize(this.attributes.sammySpeed);

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

            let bonusAmount = 0;

            if (this.noDamage) {
                levelSummaryMenu.addItem(
                    'no damage taken',
                    `${(NO_DAMAGE_TOKEN_LEVEL_BONUS * 100).toFixed(0)}% bonus`,
                    `+ ${(honeycombEarned * NO_DAMAGE_TOKEN_LEVEL_BONUS).toFixed(1)}`,
                    '<div class="level-badge level-badge-no-damage"></div>'
                )
            }

            if (noSurvivors) {
                levelSummaryMenu.addItem(
                    'no survivors',
                    `${(NO_SURVIVORS_LEVEL_BONUS * 100).toFixed(0)}% bonus`,
                    `+ ${(honeycombEarned * NO_SURVIVORS_LEVEL_BONUS).toFixed(1)}`,
                    '<div class="level-badge level-badge-no-survivors"></div>'
                )
            }

            if (this.noDamage && noSurvivors) {                                
                levelSummaryMenu.addItem(
                    'perfect',
                    `${(PERFECT_LEVEL_BONUS * 100).toFixed(0)}% bonus`,
                    `+ ${(honeycombEarned * PERFECT_LEVEL_BONUS).toFixed(1)}`,
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

        levelSummaryMenu.returnMenu = MENUS.LEVEL_SELECTION;
        levelSummaryMenu.returnMenuText = 'Return to level selection';
    }

    onBeeDeath() {
        super.onBeeDeath();
        this.levelFailed = true;
    }

    update() {

        super.update();

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

        this.sammyChance = currentPlayer.sammyChance;

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

        const spawnRegions = birdTemplate.spawnRegions;
        if (!spawnRegions.length) {
            // Just default to the right side of the screen.
            spawnRegions.push(SPAWN_REGIONS.RIGHT_UPPER);
            spawnRegions.push(SPAWN_REGIONS.RIGHT_LOWER);
        }

        const targetSpawnRegion = spawnRegions[this.rand.int(0, spawnRegions.length)];
        const pos = targetSpawnRegion.getRandomPosition(this.rand, worldSize, margin);

        const bird = birdTemplate.create(pos);

        logDebug(`Spawning '${birdTemplate.name}' at '${pos}'.`);

        this.trackObj(bird);
        this.onBirdSpawned();
    }

    update() {

        super.update();

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

let FORMATIONS;
export let LEVELS;

function initFormations() {
    FORMATIONS = {

        /** A set of 6 birds in the shape of a backward slash (\). */
        backSlash: new FormationDefinition('Back Slash (\\)')    
            .withSpawn(BIRD_TEMPLATES.fred, 0, vec2(20, 9))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 6))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 3))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -3))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -6))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -9)),

        /** A set of 6 birds in the shape of a forward slash (/). */
        forwardSlash: new FormationDefinition('Forward Slash (/)') 
            .withSpawn(BIRD_TEMPLATES.fred, 0, vec2(20, -9))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -6))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -3))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 3))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 6))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 7)),

        /** A set of 4 birds aranged in a diamond pattern. */
        diamond: new FormationDefinition('Diamond')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 0))
            .withSpawn(BIRD_TEMPLATES.fred, 0.3, vec2(20, 5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.3, vec2(20, 0)),

        /** A vertical stack of 2 birds. */
        vert2: new FormationDefinition('Vertical (2)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -5)),

        /** A vertical stack of 3 birds. */
        vert3: new FormationDefinition('Vertical (3)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 0))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 7))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -7)),

        /** The thing 1 & 2 twin birds which always come from the right
         * side of the screen and move diagonally.
         */
        twinsRight: new FormationDefinition("Twins (Right - 1 & 2)")
            .withSpawn(BIRD_TEMPLATES.thing1, 0.0, vec2(20, -12))
            .withSpawn(BIRD_TEMPLATES.thing2, 0.0, vec2(20, 12)),

        /** The thing 1 & 2 twin birds which always come from the right
         * side of the screen and move diagonally.
         */
        twinsLeft: new FormationDefinition("Twins (Left - 3 & 4)")
            .withSpawn(BIRD_TEMPLATES.thing1, 0.0, vec2(-20, -12))
            .withSpawn(BIRD_TEMPLATES.thing2, 0.0, vec2(-20, 12)),

        /** Releases a set of birds in the shape of a greater than (>) sign.
         * This spawns 5 'columns' of birds where the third and fifth column
         * are a different type of bird. The final column is the 'point' and
         * only has one bird.
         */
        greaterThan: new FormationDefinition('Greater Than (>)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 9))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -9))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 7))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -7))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.bill, 0.0, vec2(20, 5))
            .withSpawn(BIRD_TEMPLATES.bill, 0.0, vec2(20, -5))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 3))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -3))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.bill, 0.0, vec2(20, 0)),

    };
};

export function initLevels() {

    initFormations();

    LEVELS = [
        new LevelDefinition(0, 'Level 1')
            .withDelay(2)
            .withFormation(FORMATIONS.backSlash)
            .withDelay(5),

        new LevelDefinition(1, 'Level 2')
            .withDelay(2)
            .withFormation(FORMATIONS.backSlash)
            .withDelay(2)
            .withFormation(FORMATIONS.forwardSlash)
            .withDelay(2)
            .withFormation(FORMATIONS.forwardSlash)
            .withDelay(5),

        new LevelDefinition(2, 'Level 3')
            .withDelay(2)
            .withFormation(FORMATIONS.diamond)
            .withDelay(2)
            .withFormation(FORMATIONS.diamond, new FormationCreationOptions()
                .withPositionOffset(vec2(0, 5))
            )
            .withDelay(2)
            .withFormation(FORMATIONS.diamond, new FormationCreationOptions()
                .withPositionOffset(vec2(0, -5))
            )
            .withDelay(5),

        new LevelDefinition(3, 'Level 4')
            .withDelay(2)
            .withFormation(FORMATIONS.greaterThan)
            .withDelay(2)
            .withFormation(FORMATIONS.greaterThan)
            .withDelay(5),

        new LevelDefinition(4, 'Level 5')
            .withDelay(2)
            .withFormation(FORMATIONS.greaterThan)
            .withDelay(2)
            .withFormation(FORMATIONS.greaterThan)
            .withDelay(5),

        new LevelDefinition(5, 'Level 6')
            .withDelay(2)
            .withFormation(FORMATIONS.vert3)
            .withDelay(1)
            .withFormation(FORMATIONS.twinsRight)
            .withDelay(2)
            .withFormation(FORMATIONS.vert3)
            .withDelay(0.3)
            .withFormation(FORMATIONS.vert2, new FormationCreationOptions()
                .withTemplateMapping(BIRD_TEMPLATES.fred, BIRD_TEMPLATES.bill)
            )
            .withDelay(1)
            .withFormation(FORMATIONS.twinsRight)
            .withDelay(5),

        new LevelDefinition(6, 'Level 7')
            .withDelay(2)
            .withFormation(FORMATIONS.twinsRight)
            .withDelay(1)
            .withFormation(FORMATIONS.twinsLeft)
            .withDelay(2)            
            .withFormation(FORMATIONS.backSlash)
            .withDelay(2)
            .withFormation(FORMATIONS.vert3, new FormationCreationOptions()
                .withTemplateMapping(BIRD_TEMPLATES.fred, BIRD_TEMPLATES.bill)
            )
            .withDelay(5),

        new LevelDefinition(7, 'Level 8')
            .withDelay(2)
            .withFormation(FORMATIONS.twinsRight)
            .withDelay(1)
            .withFormation(FORMATIONS.twinsLeft)
            .withDelay(2)            
            .withFormation(FORMATIONS.backSlash)
            .withDelay(2)
            .withFormation(FORMATIONS.vert3, new FormationCreationOptions()
                .withTemplateMapping(BIRD_TEMPLATES.fred, BIRD_TEMPLATES.bill)
            )
            .withDelay(5),
            
        // new LevelDefinition(8, 'Level 9'),
        // new LevelDefinition(9, 'Level 10'),
        // new LevelDefinition(10, 'Level 11'),
        // new LevelDefinition(11, 'Level 12'),
        // new LevelDefinition(12, 'Level 13'),
        // new LevelDefinition(13, 'Level 14'),
        // new LevelDefinition(14, 'Level 15'),
        // new LevelDefinition(15, 'Level 16'),
        // new LevelDefinition(16, 'Level 17'),
        // new LevelDefinition(17, 'Level 18'),
        // new LevelDefinition(18, 'Level 19'),
        // new LevelDefinition(19, 'Level 20'),
        // new LevelDefinition(20, 'Level 21'),
        // new LevelDefinition(21, 'Level 22'),
        // new LevelDefinition(22, 'Level 23'),
        // new LevelDefinition(23, 'Level 24'),
        // new LevelDefinition(24, 'Level 25'),
    ]
}