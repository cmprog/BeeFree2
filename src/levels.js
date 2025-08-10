import { Bee } from "./bee.js";
import { BIRD_TEMPLATES, BirdTemplate } from "./birds.js";
import { logInfo } from "./logging.js";
import { Owl } from "./owl.js";
import { currentPlayer } from "./player.js";
import { FormationDefinition, SpawnDefinition, SpawnerCollection, FormationCreationOptions } from "./spawning.js";
import { getWorldSize } from "./util.js";

export let currentLevel;

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

class Level {

    constructor() {

        this.bee = new Bee();

        this.birdsKilled = 0;
        this.honeycombCollected = 0;
        touchGamepadEnable = true;       
        
        this.levelFailed = false;
    }

    update() {
        
    }

    isComplete() {
        return false;
    }

    onBeeDestroyed() {
        this.levelFailed = true;
    }

    destroy() {

        this.bee.destroy();
        this.spawner.destroy();

        currentLevel = undefined;
        touchGamepadEnable = false;
    }
}

class StandardLevel extends Level {
    
    constructor(levelDefinition) {

        super();

        this.id = levelDefinition.id;
        this.levelDefinition = levelDefinition;        
        this.levelTimer = new Timer(this.levelDefinition.totalDuration);
        this.spawner = levelDefinition.createSpawner();

        this.spawnedOwls = [];
    }

    update() {
        this.spawner.update();

        if (randInt(0, 5_000) == 0) {
            const worldSize = getWorldSize();
            const halfWorldSize = worldSize.scale(0.5);
            const owl = new Owl(vec2(-halfWorldSize.x - 10, rand(-halfWorldSize.y, halfWorldSize.y)));
            currentPlayer.luckyOwlsSpawned += 1;
            logInfo(`Lucky Owl Spawn at ${owl.pos}!`);
            owl.velocity = vec2(0.1, 0);
            this.spawnedOwls.push(owl);
        }
    }

    isComplete() {
        return this.levelTimer.elapsed();
    }

    destroy() {
        super.destroy();

        for (const owl of this.spawnedOwls) {
            owl.destroy();
        }

        currentPlayer.onLevelCompleted(this.id, this.levelFailed, false, false);

        if (this.id + 1 < LEVELS.length) {
            currentPlayer.markLevelAvailable(this.id + 1);
        }        
    }
}

const FORMATIONS = {

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

export const LEVELS = [
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

        
    // new LevelDefinition(5, 'Level 6'),
    // new LevelDefinition(6, 'Level 7'),
    // new LevelDefinition(7, 'Level 8'),
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