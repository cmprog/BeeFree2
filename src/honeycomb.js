import { EntityType } from "./entities.js";

export class Honeycomb extends EngineObject{

    constructor(pos, value) {
        
        super(pos, vec2(1));

        this.setCollision();
        this.color = YELLOW;

        // Just a means to ensure it gets auto-cleaned up
        this.lifeTimer = new Timer(10);

        this.entityType = EntityType.HONEYCOMB;
        this.value = value;        
    }

    update() {
        super.update();

        if (this.lifeTimer.elapsed()) {
            this.destroy();
        }
    }
}