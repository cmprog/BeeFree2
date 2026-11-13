// Helpers for art drawn in code (the birds and the bee): outlined shapes, colors, sprite sheets
// and a flap-and-blink animation. The art is drawn once at startup into a canvas, which becomes an
// engine texture, so in game it's drawn like any other sprite.

export const OUTLINE_COLOR = '#222';
export const OUTLINE_WIDTH = 0.05;

/**
 * Lightens (positive amount) or darkens (negative amount) a color.
 * @param {Color} color
 * @param {number} amount -1 to 1.
 * @returns {Color}
 */
export function shade(color, amount) {
    return amount >= 0 ? color.lerp(WHITE, amount) : color.lerp(BLACK, -amount);
}

/**
 * A shape for drawSilhouette.
 * @returns {(ctx: CanvasRenderingContext2D) => void}
 */
export function ellipse(x, y, radiusX, radiusY, rotation = 0) {
    return ctx => ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, 2 * Math.PI);
}

/**
 * Draws a list of shapes as one outlined silhouette: every shape is outlined first, then every
 * shape is filled, so the fills cover the outlines where the shapes overlap.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Color | string} color
 * @param {Array<(ctx: CanvasRenderingContext2D) => void>} shapes Each adds a path to the context.
 */
export function drawSilhouette(ctx, color, shapes) {
    ctx.save();
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = OUTLINE_WIDTH * 2;
    for (const shape of shapes) {
        ctx.beginPath();
        shape(ctx);
        ctx.stroke();
    }
    ctx.fillStyle = color.toString();
    for (const shape of shapes) {
        ctx.beginPath();
        shape(ctx);
        ctx.fill();
    }
    ctx.restore();
}

/**
 * Art drawn into a sprite sheet: one row of animation frames with eyes open, one with eyes closed.
 */
export class FrameSheet {

    /**
     * @param {{ x: number, y: number }} artFrameSize Area each frame covers, in art units, centered
     *   on the drawing's origin.
     * @param {number} pixelsPerUnit Sheet pixels per art unit.
     * @param {number} frameCount Animation frames per row.
     * @param {(ctx: CanvasRenderingContext2D, frame: number, eyesClosed: boolean) => void} draw
     *   Draws one frame, in art units with +y up and the origin at the center of the frame.
     */
    constructor(artFrameSize, pixelsPerUnit, frameCount, draw) {
        const cellWidth = Math.ceil(artFrameSize.x * pixelsPerUnit);
        const cellHeight = Math.ceil(artFrameSize.y * pixelsPerUnit);

        /** The drawn sheet, also handy for previews outside the engine. */
        this.canvas = document.createElement('canvas');
        this.canvas.width = cellWidth * frameCount;
        this.canvas.height = cellHeight * 2;

        const ctx = this.canvas.getContext('2d');
        for (let row = 0; row < 2; row++) {
            for (let frame = 0; frame < frameCount; frame++) {
                ctx.save();
                ctx.translate((frame + 0.5) * cellWidth, (row + 0.5) * cellHeight);
                ctx.scale(pixelsPerUnit, -pixelsPerUnit); // +y up, like the game world
                draw(ctx, frame, row === 1);
                ctx.restore();
            }
        }

        // Smooth, not pixelated: the art is drawn at a higher resolution than it's shown.
        const texture = new TextureInfo(this.canvas, true, false, false);

        /**
         * Tiles by [eyesClosed ? 1 : 0][frame].
         * @type {TileInfo[][]}
         */
        this.tiles = [0, 1].map(row =>
            Array.from({ length: frameCount }, (_, frame) =>
                new TileInfo(vec2(frame * cellWidth, row * cellHeight), vec2(cellWidth, cellHeight), texture, 0)));

        /** Cell size in pixels. */
        this.cellSize = vec2(cellWidth, cellHeight);
    }

    /**
     * @param {number} frame
     * @param {boolean} eyesClosed
     * @returns {TileInfo}
     */
    getTile(frame, eyesClosed) {
        return this.tiles[eyesClosed ? 1 : 0][frame];
    }
}

/** Seconds between blinks, picked at random in this range for each blink. */
const BLINK_INTERVAL = Object.freeze({ min: 2, max: 6 });

/** Seconds the eyes stay closed for a blink. */
const BLINK_DURATION = 0.15;

/**
 * Tracks one creature's looping wing animation and its blinks. Each one starts at a random point
 * in the loop and blinks on its own schedule, so a flock doesn't move in lockstep.
 */
export class FlapBlinkAnimation {

    /**
     * @param {number} frameCount Frames in one wing loop.
     * @param {number} framesPerSecond
     * @param {number} startTime The current time, in seconds.
     */
    constructor(frameCount, framesPerSecond, startTime) {
        this.frameCount = frameCount;
        this.framesPerSecond = framesPerSecond;
        this.flapOffset = Math.random() * frameCount;
        this.nextBlinkTime = startTime + randomBlinkInterval();
    }

    /**
     * @param {number} currentTime In seconds.
     * @returns {{ flapFrame: number, eyesClosed: boolean }}
     */
    getFrame(currentTime) {
        if (currentTime > this.nextBlinkTime + BLINK_DURATION) {
            this.nextBlinkTime = currentTime + randomBlinkInterval();
        }
        return {
            flapFrame: Math.floor(currentTime * this.framesPerSecond + this.flapOffset) % this.frameCount,
            eyesClosed: currentTime >= this.nextBlinkTime,
        };
    }
}

function randomBlinkInterval() {
    return BLINK_INTERVAL.min + Math.random() * (BLINK_INTERVAL.max - BLINK_INTERVAL.min);
}
