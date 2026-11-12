import { computeHatPlacement, getHat } from './hats.js';
import { spriteAtlas } from '../core/sprites.js';

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

    /**
     * The top edge of the hat's rotated bounds, as a y offset relative to the wearer.
     * @returns {number}
     */
    getLocalTop() {
        const halfSize = this.size.y / 2;
        return this.localPos.y + (halfSize * (Math.abs(Math.cos(this.localAngle)) + Math.abs(Math.sin(this.localAngle))));
    }

    update() {
        // Purposefully not calling super, hats don't have physics.
        this.applyPlacement();
    }
}

// Space between the top of a hat and a health bar drawn above it.
const HAT_HEALTH_BAR_GAP = 0.2;

/**
 * Where to put a wearer's health bar so it isn't drawn over their hat. Without a hat, or
 * with one that doesn't reach the bar, the bar stays at its default offset.
 * @param {HatAttachment | undefined} hat
 * @param {number} defaultOffsetY
 * @returns {Vector2} The bar's local position relative to the wearer.
 */
export function computeHealthBarOffset(hat, defaultOffsetY) {
    if (!hat) return vec2(0, defaultOffsetY);
    return vec2(0, Math.max(defaultOffsetY, hat.getLocalTop() + HAT_HEALTH_BAR_GAP));
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
