import { currentLevel } from "./levels.js";

export class FormationCreationOptions {

    constructor() {
        /** @property{Vector2} */
        this.positionOffset = vec2(0);
        
        /** @property A dictionary mapping used to replace templates from the
         * formation with different templates
         */
        this.templateMapping = { };
    }
    
    withPositionOffset(offset) {
        this.positionOffset = offset;
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

        /** @property{Array.<SpawnDefinition>} */
        this.spawns = [];

        this.totalDuration = 0;
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

        for (const sourceSpawn of this.spawns) {

            let template = sourceSpawn.template;
            let time = sourceSpawn.time;
            let pos = sourceSpawn.pos;

            if (options) {
                pos = pos.add(options.positionOffset);

                if (template in options.templateMapping) {
                    template = options.templateMapping[template];
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
        this.template = template;
        this.time = time;
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
        if (this.timer.elapsed()) {
            console.log(`Spawning bird '${this.template.name}' at ${this.pos}.`)
            const bird = this.template.create(this.pos)
            currentLevel.trackObj(bird);
            currentLevel.onBirdSpawned();            
            this.timer.unset();
        }
    }
}