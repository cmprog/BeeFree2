import { EntityType } from "./entities.js";
import { spriteAtlas } from "./sprites.js";

export class Honeycomb extends EngineObject{

    constructor(pos, value) {
        
        super(pos, vec2(1));

        this.setCollision();
        this.tileInfo = spriteAtlas.honeycomb

        // Just a means to ensure it gets auto-cleaned up
        this.lifeTimer = new Timer(10);

        this.entityType = EntityType.HONEYCOMB;
        this.value = value;        
    }

    update() {
        super.update();

        // Use time since spawn to ensure all the honeycomb aren't synced in their rotation
        this.angle = wave(0.2, 0.5 * PI, time - this.spawnTime);

        if (this.lifeTimer.elapsed()) {
            this.destroy();
        }
    }

    collideWithObject() {
        // Just want to disable physics handling
        return false;
    }
}