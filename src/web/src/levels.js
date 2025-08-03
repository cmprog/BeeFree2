import { Bee } from "./bee.js";
import { BIRD_TEMPLATES } from "./birds.js";
import { SpawnDefinition, SpawnerCollection } from "./spawning.js";

export let currentLevel;

class LevelDefinition {
    constructor(name) {
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
    }
}

class Level {

    constructor() {

        this.bee = new Bee();

        this.birdsKilled = 0;
        this.honeycombCollected = 0;
    }

    update() {
        
    }

    isComplete() {
        return false;
    }

    destroy() {

        this.bee.destroy();
        this.spawner.destroy();

        currentLevel = undefined;
    }
}

class StandardLevel extends Level {
    
    constructor(levelDefinition) {

        super();

        this.levelDefinition = levelDefinition;
        this.levelTimer = new Timer(this.levelDefinition.totalLevelDuration);
        this.spawner = levelDefinition.createSpawner();
    }

    update() {
        this.spawner.update();
    }

    isComplete() {
        return this.levelTimer.elapsed();
    }
}

export const LEVELS = [
    new LevelDefinition('Level 1')
        .withSpawn(BIRD_TEMPLATES.fred, 2, vec2(20, 9))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 6))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 3))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -3))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -6))
        .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -9))
        .withDelay(5),
]