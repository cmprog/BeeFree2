export function getWorldSize() {
    return canvasFixedSize.scale(1 / cameraScale);
}

export function scaleTileSizeWidth(tileInfo, targetWidth) {
    return vec2(targetWidth, (tileInfo.size.y / tileInfo.size.x) * targetWidth);
}

export function scaleTileSizeHeight(tileInfo, targetHeight) {
    return vec2((tileInfo.size.x / tileInfo.size.y) * targetHeight, targetHeight);
}