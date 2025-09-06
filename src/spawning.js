import { BirdTemplate } from "./birds.js";
import { currentLevel } from "./levels.js";

export const SPAWN_REGIONS = {

    RIGHT_UPPER: {
        /**
         * Gets a random position within this spawn region.
         * @param {RandomGenerator} rand 
         * @param {Vector2} worldSize 
         * @param {vec2} margin 
         */
        getRandomPosition(rand, worldSize, margin) {
            const posX = worldSize.x + (rand.float() * margin.x);
            const posY = rand.float() * worldSize.y;
            return vec2(posX, posY);
        }
    },
    RIGHT_LOWER: {
        /**
         * Gets a random position within this spawn region.
         * @param {RandomGenerator} rand 
         * @param {Vector2} worldSize 
         * @param {vec2} margin 
         */
        getRandomPosition(rand, worldSize, margin) {
            const posX = worldSize.x + (rand.float() * margin.x);
            const posY = rand.float() * -worldSize.y;
            return vec2(posX, posY);
        }
    },

    TOP_LEFT: {
        /**
         * Gets a random position within this spawn region.
         * @param {RandomGenerator} rand 
         * @param {Vector2} worldSize 
         * @param {vec2} margin 
         */
        getRandomPosition(rand, worldSize, margin) {
            const posX = rand.float() * -worldSize.x;
            const posY = worldSize.y + (rand.float() * margin.y);
            return vec2(posX, posY);
        }
    },
    TOP_RIGHT: {
        /**
         * Gets a random position within this spawn region.
         * @param {RandomGenerator} rand 
         * @param {Vector2} worldSize 
         * @param {vec2} margin 
         */
        getRandomPosition(rand, worldSize, margin) {
            const posX = rand.float() * worldSize.x;
            const posY = worldSize.y + (rand.float() * margin.y);
            return vec2(posX, posY);
        }
    },

    BOTTOM_LEFT: {
        /**
         * Gets a random position within this spawn region.
         * @param {RandomGenerator} rand 
         * @param {Vector2} worldSize 
         * @param {vec2} margin 
         */
        getRandomPosition(rand, worldSize, margin) {
            const posX = rand.float() * -worldSize.x;
            const posY = -worldSize.y - (rand.float() * margin.y);
            return vec2(posX, posY);
        }
    },
    BOTTOM_RIGHT: {
        /**
         * Gets a random position within this spawn region.
         * @param {RandomGenerator} rand 
         * @param {Vector2} worldSize 
         * @param {vec2} margin 
         */
        getRandomPosition(rand, worldSize, margin) {
            const posX = rand.float() * worldSize.x;
            const posY = -worldSize.y - (rand.float() * margin.y);
            return vec2(posX, posY);
        }
    },

    LEFT_UPPER: {
        /**
         * Gets a random position within this spawn region.
         * @param {RandomGenerator} rand 
         * @param {Vector2} worldSize 
         * @param {vec2} margin 
         */
        getRandomPosition(rand, worldSize, margin) {
            const posX = -worldSize.x - (rand.float() * margin.x);
            const posY = rand.float() * worldSize.y;
            return vec2(posX, posY);
        }
    },
    LEFT_LOWER: {
        /**
         * Gets a random position within this spawn region.
         * @param {RandomGenerator} rand 
         * @param {Vector2} worldSize 
         * @param {vec2} margin 
         */
        getRandomPosition(rand, worldSize, margin) {
            const posX = -worldSize.x - (rand.float() * margin.x);
            const posY = rand.float() * -worldSize.y;
            return vec2(posX, posY);
        }
    }


}

export class FormationCreationOptions {

    constructor() {

        /** @property{Vector2} */
        this.positionOffset = vec2(0);

        /**
         * Component-wise multiplier for the positioning.
         * @type {number}
         */
        this.positionScale = vec2(1);

        /**
         * A multiplier to the time scaling.
         */
        this.timeScale = 1;
        
        /** @property A dictionary mapping used to replace templates from the
         * formation with different templates
         */
        this.templateMapping = { };

        /**
         * Positional bird template replacements.
         * @type {Object.<number, BirdTemplate>}
         */
        this.replacements = {};
    }

    /**
     * Replaces the template at the given index with a new bird.
     * @param {number} index 
     * @param {BirdTemplate} targetTemplate 
     */
    withReplacement(index, targetTemplate) {
        this.replacements[index] = targetTemplate;
        return this;
    }
    
    withPositionOffset(offset) {
        this.positionOffset = offset;
        return this;
    }

    /**
     * Scales the position components by the given amounts.
     * @param {Vector2} scale 
     */
    withPositionScaling(scale) {
        this.positionScale = scale;
        return this;
    }

    /**
     * Scales the release timing by the given amount.
     * @param {number} scale 
     */
    withTimeScaling(scale) {
        this.timeScale = scale;
        return this;
    }

    withTemplateMapping(sourceTemplate, targetTemplate) {
        this.templateMapping[sourceTemplate] = targetTemplate;
        return this;
    }
}

/**
 * A wrapper around a set of spawn definitions so that
 * common sets of spawns can be more easily re-used.
 */
export class FormationDefinition {
    constructor(name) {
        this.name = name;

        /** 
         * @type {Array.<SpawnDefinition>}
         * */
        this.spawns = [];

        /**
         * @type {number}
         */
        this.totalDuration = 0;

        /**
         * @type {number}
         */
        this.verticalOffset = 0;
    }

    withDelay(duration) {
        this.totalDuration += duration;
        return this;
    }

    withSpawn(template, delay, pos) {
        const time = this.totalDuration + delay;
        const definition = new SpawnDefinition(template, time, pos);
        this.spawns.push(definition);
        this.totalDuration += delay;
        return this;
    }

    /** Creates a new list of spawn definitions with the given options.
     * @param {FormationCreationOptions} [options]
     * @return {Array.<SpawnDefinition>}
     */
    createSpawns(options) {
        const resultSpawns = [];

        for (let iSpawn = 0; iSpawn < this.spawns.length; iSpawn += 1) {

            const sourceSpawn = this.spawns[iSpawn];

            let template = sourceSpawn.template;
            let time = sourceSpawn.time;            
            let pos = sourceSpawn.pos;

            if (options) {
                
                pos = pos.multiply(options.positionScale);
                pos = pos.add(options.positionOffset);

                time = time * options.timeScale;

                if (template in options.templateMapping) {
                    template = options.templateMapping[template];
                }

                if (iSpawn in options.replacements) {
                    template = options.replacements[iSpawn];
                }
            }

            const transformSpawn = new SpawnDefinition(template, time, pos);
            resultSpawns.push(transformSpawn);

        }

        return resultSpawns;
    }
}

export class SpawnDefinition {
    constructor(template, time, pos) {

        /**
         * @type {BirdTemplate}
         */
        this.template = template;

        /**
         * @type {number}
         */
        this.time = time;

        /**
         * @type {Vector2}
         */
        this.pos = pos;
    }

    create() {
        return new SingleEnemySpawner(this);
    }
}

class Spawner {

    constructor() {
    }

    update() {

    }
}

export class SpawnerCollection extends Spawner {

    constructor(spawners) {
        super();
        this.spawners = spawners;
    }

    update() {
        for (const spawner of this.spawners) {
            spawner.update();
        }
    }

    destroy() {
        for (const spawner of this.spawners) {
            spawner.destroy();
        }
    }
}

class SingleEnemySpawner extends Spawner {
    constructor(definition) {
        super();
        this.template = definition.template;
        this.timer = new Timer(definition.time);
        this.pos = definition.pos;
    }

    update() {
        if (this.timer.elapsed() && currentLevel) {
            console.log(`Spawning bird '${this.template.name}' at ${this.pos}.`)
            const bird = this.template.create(this.pos)
            currentLevel.trackObj(bird);
            currentLevel.onBirdSpawned();            
            this.timer.unset();
        }
    }
}