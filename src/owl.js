import { CompositeEntityPart } from "./entities.js";
import { logDebug, logWarning } from "./logging.js";
import { spriteAtlas } from "./sprites.js";

const BASE_OWL_SIZE = 1.5

class OwlPart extends CompositeEntityPart {
    constructor(pos, owl, localPos, tileInfo) {
        super(pos, owl, localPos, BASE_OWL_SIZE, spriteAtlas.owl.body, tileInfo);
    }
}

class OwlBody extends OwlPart {
    constructor(pos, owl) {
        super(pos, owl, vec2(0, 0), spriteAtlas.owl.body);
        this.renderOrder = 110;
    }
}

class OwlFrontWing extends OwlPart {
    constructor(pos, owl) {
        super(pos, owl, vec2(-0.3, 0.2), spriteAtlas.owl.frontWing);
        this.renderOrder = 120;

        this.baseLocalPos = this.localPos;
    }

    update() {
        super.update();
        this.localAngle = Math.sin(time * 5) * (PI * 0.2);
    }
}

class OwlBackWing extends OwlPart {
    constructor(pos, owl) {
        super(pos, owl, vec2(-0.2, 0.3), spriteAtlas.owl.backWing);
        this.renderOrder = 100;
    }

    update() {
        super.update();
        this.localAngle = Math.sin(time * 5) * (PI * 0.2);
    }
}

export class Owl extends EngineObject {

    constructor(pos) {
        super(pos, vec2(1, 1));

        this.setCollision();
        this.mass = 0;

        this.body = new OwlBody(pos, this);
        this.frontWing = new OwlFrontWing(pos, this);
        this.backWing = new OwlBackWing(pos, this);
    }

    render() {

    }

}