import { Bee } from "./bee.js";
import { BIRD_TEMPLATES } from "./birds.js";
import { logInfo } from "./logging.js";
import { Owl } from "./owl.js";
import { currentPlayer } from "./player.js";
import { SpawnDefinition, SpawnerCollection } from "./spawning.js";
import { getWorldSize } from "./util.js";

export let currentLevel;

class LevelDefinition {
    constructor(id, name) {

        this.id = id;
        this.name = name;
        this.spawns = [];

        this.totalLevelDuration = 0;
    }

    withSpawn(type, deltaTime, pos) {
        this.spawns.push(new SpawnDefinition(type, this.totalLevelDuration + deltaTime, pos));
        this.totalLevelDuration += deltaTime;
        return this;
    }

    withDelay(duration) {
        this.totalLevelDuration += duration;
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
        this.levelTimer = new Timer(this.levelDefinition.totalLevelDuration);
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

export const LEVELS = [
    new LevelDefinition(0, 'Level 1')
        .withSpawn(BIRD_TEMPLATES.fred, 2, vec2(20, 9))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 6))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 3))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -3))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -6))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -9))
        .withDelay(5),
]