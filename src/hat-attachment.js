import { computeHatPlacement, getHat } from './hats.js';
import { spriteAtlas } from './sprites.js';

/**
 * A hat worn by an entity. It is a child of the wearer so it follows the wearer's
 * position and rotation, and it is destroyed along with the wearer.
 */
export class HatAttachment extends EngineObject {

    /**
     * @param {EngineObject} wearer The entity wearing the hat.
     * @param {{ key: string, facing: number }} wearerType One of HatWearer.
     * @param {string} hatId
     * @param {number} renderOrder Should be just above the wearer's top-most part.
     */
    constructor(wearer, wearerType, hatId, renderOrder) {

        super(wearer.pos.copy());

        this.wearerType = wearerType;
        this.renderOrder = renderOrder;

        /** @type {string} */
        this.hatId = undefined;
        this.setHat(hatId);

        wearer.addChild(this);
        this.applyPlacement();
    }

    /**
     * Changes the hat being worn.
     * @param {string} hatId
     */
    setHat(hatId) {
        this.hatId = hatId;
        this.tileInfo = spriteAtlas.hats[hatId];
    }

    /**
     * Recomputes the local transform from the current tuning values. Done every frame
     * so the dev tuning view updates live.
     */
    applyPlacement() {
        const placement = computeHatPlacement(this.hatId, this.wearerType);
        this.localPos = vec2(placement.x, placement.y);
        this.localAngle = placement.angle;
        this.size = vec2(placement.size);
        this.mirror = placement.mirror;
    }

    update() {
        // Purposefully not calling super, hats don't have physics.
        this.applyPlacement();
    }
}

/**
 * Puts a hat on an entity.
 * @param {EngineObject} wearer
 * @param {{ key: string, facing: number }} wearerType One of HatWearer.
 * @param {string} hatId
 * @param {number} renderOrder
 * @returns {HatAttachment | undefined} The attachment, or undefined if the hat doesn't exist.
 */
export function attachHat(wearer, wearerType, hatId, renderOrder) {
    if (!hatId || !getHat(hatId)) return undefined;
    return new HatAttachment(wearer, wearerType, hatId, renderOrder);
}
