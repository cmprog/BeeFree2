import { BirdTemplate } from "../birds/bird.js";
import { startStandardLevel } from "./levels.js";
import { FormationCreationOptions, FormationDefinition, SpawnDefinition, SpawnerCollection } from "./spawning.js";

/**
 * A scripted level: a timeline of bird spawns built with the fluent with* methods.
 */
export class LevelDefinition {
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
        startStandardLevel(this);
    }
}

