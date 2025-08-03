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
        this.spawnedObjects = [];
    }

    update() {

    }

    destroy() {
        for (const obj of this.spawnedObjects) {
            obj.destroy();
        }
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
            console.log('spawning...')
            const bird = this.template.create(this.pos)
            this.spawnedObjects.push(bird);
            this.timer.unset();
        }
    }
}