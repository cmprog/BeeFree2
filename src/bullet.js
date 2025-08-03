import { spriteAtlas } from "./sprites.js";
import { scaleTileSizeHeight } from "./util.js";

export class Bullet extends EngineObject {

    constructor(pos, velocity, tileInfo) {
        super(pos, vec2(1), tileInfo);

        this.velocity = velocity;
        
        this.size = scaleTileSizeHeight(this.tileInfo, 0.5);

        // Just a means to ensure it gets auto-cleaned up
        this.lifeTimer = new Timer(10);
    }

    update() {
        super.update();

        if (this.lifeTimer.elapsed()) {
            this.destroy();
        }
    }
}

export class BeeBullet extends Bullet {
    constructor(pos, velocity) {
        super(pos, velocity, spriteAtlas.ammo.bee);
    }
}

export class BirdBullet extends Bullet {
    constructor(pos, velocity) {
        super(pos, velocity, spriteAtlas.ammo.bird);
    }    
}