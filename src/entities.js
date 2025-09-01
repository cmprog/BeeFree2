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