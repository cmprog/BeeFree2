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

    fredBackSlash: new FormationDefinition('Fred Back Slash')    
        .withSpawn(BIRD_TEMPLATES.fred, 0, vec2(20, 9))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 6))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 3))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -3))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -6))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -9)),

    fredForwardSlash: new FormationDefinition('Fred Forward Slash') 
        .withSpawn(BIRD_TEMPLATES.fred, 0, vec2(20, -9))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -6))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -3))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 3))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 6))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 7)),

    diamond: new FormationDefinition('Diamond')
        .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 0))
        .withSpawn(BIRD_TEMPLATES.fred, 0.3, vec2(20, 5))
        .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -5))
        .withSpawn(BIRD_TEMPLATES.fred, 0.3, vec2(20, 0)),
};

export const LEVELS = [
    new LevelDefinition(0, 'Level 1')
        .withDelay(2)
        .withFormation(FORMATIONS.fredBackSlash)
        .withDelay(5),

    new LevelDefinition(1, 'Level 2')
        .withDelay(2)
        .withFormation(FORMATIONS.fredBackSlash)
        .withDelay(2)
        .withFormation(FORMATIONS.fredForwardSlash)
        .withDelay(2)
        .withFormation(FORMATIONS.fredForwardSlash)
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
        .withSpawn(BIRD_TEMPLATES.bill, 0.0, vec2(20, 0))
        .withDelay(5),
]