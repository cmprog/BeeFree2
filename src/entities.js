export const EntityType = Object.freeze({
    BEE: { },
    BIRD: { },    
    BIRD_BULLET: { },
    BEE_BULLET: { },
    HONEYCOMB: { },
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

export class HealthBar extends EngineObject {

    constructor() {

        super();

        this.color = RED;
        this.size = vec2(3, 0.3);

        this.currentHealthObj = new EngineObject();
        this.currentHealthObj.color = GREEN;
        this.currentHealthObj.size = vec2(this.size);
        this.addChild(this.currentHealthObj, vec2(0, 0));

        this.currentValue = 1;
        this.maxValue = 1;
    }

    update() {
        const percentHealth = clamp(this.currentValue / this.maxValue, 0, 1);
        this.currentHealthObj.size.x = this.size.x * percentHealth;
        this.currentHealthObj.localPos.x = (-this.size.x / 2) * (1 - percentHealth);
    }



}