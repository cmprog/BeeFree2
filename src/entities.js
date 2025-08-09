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