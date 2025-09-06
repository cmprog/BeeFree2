import { EntityType } from "./entities.js";
import { currentLevel } from "./levels.js";
import { currentPlayer } from "./player.js";
import { spriteAtlas } from "./sprites.js";
import { isWellOutsideWorldBoundary } from "./util.js";

export class Honeycomb extends EngineObject{

    constructor(pos, value) {
        
        super(pos, vec2(1));

        this.setCollision();
        this.tileInfo = spriteAtlas.honeycomb

        this.entityType = EntityType.HONEYCOMB;
        this.value = value;        
    }

    update() {
        super.update();

        // Use time since spawn to ensure all the honeycomb aren't synced in their rotation
        this.angle = wave(0.2, 0.5 * PI, time - this.spawnTime);

        if (currentPlayer.beeAttributes.honeycombAttraction) {
            const distanceToBee = currentLevel.bee.pos.subtract(this.pos);
            if (distanceToBee.length() <= currentPlayer.beeAttributes.honeycombAttractionDistance) {
                this.velocity = distanceToBee.normalize(currentPlayer.beeAttributes.honeycombAttraction);
            }            
        }

        if (isWellOutsideWorldBoundary(this)) {            
            this.destroy();
        }
    }

    collideWithObject() {
        // Just want to disable physics handling
        return false;
    }
}