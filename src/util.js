export function getWorldSize() {
    return canvasFixedSize.scale(1 / cameraScale);
}

export function scaleTileSizeWidth(tileInfo, targetWidth) {
    return vec2(targetWidth, (tileInfo.size.y / tileInfo.size.x) * targetWidth);
}

export function scaleTileSizeHeight(tileInfo, targetHeight) {
    return vec2((tileInfo.size.x / tileInfo.size.y) * targetHeight, targetHeight);
}

export function registerClick(element, handler) {

    element.addEventListener('click', (ev) => {
        handler(ev);
        ev.preventDefault();
    });

    let touchStartOn = undefined;

    element.addEventListener('touchstart', () => {
        touchStartOn = time;
    });

    element.addEventListener('touchend', (ev) => {
        const timeSinceTouchStart = time - touchStartOn;
        if (timeSinceTouchStart < 0.3) {
            handler(ev);
            ev.preventDefault();
        }
        timeSinceTouchStart = undefined;
    });
}