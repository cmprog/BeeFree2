import { RENDER_LAYERS } from "./layers.js";
import { spriteAtlas } from "./sprites.js";
import { FONTS, rgb255 } from "./util.js";

export const EntityType = Object.freeze({
    BEE: { },
    BIRD: { },    
    BIRD_BULLET: { },
    BEE_BULLET: { },
    HONEYCOMB: { },
    SAMMY: { },
});

function normalizeComponentPartSize(baseSizeScale, baseSprite, sourceSprite) {
    const targetHeight = baseSizeScale * (sourceSprite.size.y / baseSprite.size.y);    
    const sourceAspectRatio = sourceSprite.size.x / sourceSprite.size.y;
    const targetWidth = sourceAspectRatio * targetHeight;
    const targetSize = vec2(targetWidth, targetHeight);
    return targetSize;
}

export class CompositeEntityPart extends EngineObject {
    constructor(pos, parent, localPos, baseSizeScale, baseTileInfo, partTileInfo) {
        super(pos, normalizeComponentPartSize(baseSizeScale, baseTileInfo, partTileInfo), partTileInfo);
        parent.addChild(this, localPos.scale(baseSizeScale));
    }
}

export class ProgressBar extends EngineObject {

    constructor() {

        super();
        
        this.size = vec2(3, 0.3);

        this.foregroundColor = GREEN;
        this.backgroundColor = RED;

        this.currentHealthObj = new EngineObject();
        this.currentHealthObj.size = vec2(this.size);
        this.addChild(this.currentHealthObj, vec2(0, 0));

        this.value = 0;

        this.shouldRender = true;
    }

    update() {

        this.color = this.backgroundColor;
        this.renderOrder = RENDER_LAYERS.HUD;

        this.currentHealthObj.renderOrder = this.renderOrder + 1;
        this.currentHealthObj.color = this.foregroundColor;
       
        const clampedValue = clamp(this.value, 0, 1);
        this.currentHealthObj.size = vec2(this.size.x * clampedValue, this.size.y);
        this.currentHealthObj.localPos.x = (-this.size.x / 2) * (1 - clampedValue);

        if (this.shouldRender) {
            this.currentHealthObj.drawSize = undefined;
            this.drawSize = undefined;
        } else {
            // Setting the draw size to 0 is simple approach
            this.currentHealthObj.drawSize = vec2(0);
            this.drawSize = vec2(0);
        }
    }
}

/**
 * This is a custom HUD element which shows the current level score.
 */
export class LevelScoreTracker extends EngineObject {

    constructor() {

        super();

        this.size = vec2(4, 1);

        this.renderOrder = RENDER_LAYERS.HUD;

        /**
         * The total amount of collected honeycomb.
         */
        this.value = 0;
    }

    render() {        

        const halfSize = this.size.scale(0.5);
        const topLeft = vec2(this.pos.x - halfSize.x, this.pos.y + halfSize.y);
        const topRight = vec2(this.pos.x + halfSize.x, this.pos.y + halfSize.y);
        const bottomLeft = vec2(this.pos.x - halfSize.x, this.pos.y - halfSize.y);
        const bottomRight = vec2(this.pos.x + halfSize.x, this.pos.y - halfSize.y);

        drawRect(this.pos, this.size, rgb255(255, 255, 255, 128));

        const lineThickness = 0.05;

        drawLine(topLeft, topRight, lineThickness, BLACK);
        drawLine(topLeft, bottomLeft, lineThickness, BLACK);
        drawLine(bottomRight, topRight, lineThickness, BLACK);
        drawLine(bottomRight, bottomLeft, lineThickness, BLACK);
        
        const honeycombSize = vec2(this.size.y).scale(0.9);

        let honeycombPos = this.pos.copy();
        honeycombPos.x = this.pos.x + (this.size.x / 2) - (honeycombSize.x / 2);

        drawTile(honeycombPos, honeycombSize, spriteAtlas.honeycomb);

        let valuePos = this.pos.copy();
        valuePos.x = this.pos.x - (honeycombSize.x / 2);
        
        drawTextOverlay(this.value.toString(), valuePos, this.size.y * 0.9, BLACK, undefined, undefined, undefined, FONTS.SECONDARY);
    }
}

export class Score extends EngineObject {

    /**
     * @param {Vector2} pos 
     * @param {number} value
     */
    constructor(pos, value) {

        super(pos);

        this.velocity = vec2(0, 0.03);

        this.timer = new Timer(1);
        this.valueText = `+${value.toString()}`;

        this.color = rgb255(0, 0, 0, 255);
    }

    update() {
        super.update();
        this.color.a = 1 - this.timer.getPercent();

        if (this.timer.elapsed()) {
            this.destroy();
        }
    }

    render() {

        drawTextOverlay(this.valueText, this.pos, 1, this.color, undefined, undefined, undefined, FONTS.SECONDARY);
    }
}