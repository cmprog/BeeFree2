// The bee's art, drawn in code like the birds' (see core/art.js). It's drawn once at startup into a
// sprite sheet: a fast wing buzz, eyes open and closed.
//
// The drawing works in world units: the bee faces right (+x), +y is up, and (0, 0) is the bee's
// position. The body fills about the same 2 x 2 box as the bee's hitbox, and the head sits under
// the BEE hat anchor in hats/adjustments.js (the top of the head is at about (0.6, 0.62)).

import { drawSilhouette, ellipse, FlapBlinkAnimation, FrameSheet, OUTLINE_COLOR, OUTLINE_WIDTH, shade } from '../core/art.js';

/** Number of wing positions in one buzz. */
export const BEE_BUZZ_FRAME_COUNT = 4;

/** Wing frames shown per second: fast, so the wings read as a buzz. */
export const BEE_BUZZ_FRAMES_PER_SECOND = 24;

/** Area each frame covers, in world units, centered on the bee's position. */
export const BEE_FRAME_SIZE = Object.freeze({ x: 2.5, y: 2.6 });

/** Sprite sheet pixels per world unit. Well above what the game shows, so it stays sharp on phones. */
const PIXELS_PER_UNIT = 100;

const BODY_COLOR = rgb(0.9, 0.8, 0.08);
const STRIPE_COLOR = rgb(0.1, 0.1, 0.1);
const WING_COLOR = 'rgba(190, 228, 248, 0.88)';

const HEAD = Object.freeze({ x: 0.6, y: 0.22, radius: 0.4 });

/** The body ellipse: center, radii and tilt (front up). */
const BODY = Object.freeze({ x: -0.12, y: -0.22, radiusX: 0.64, radiusY: 0.48, tilt: 0.08 });

/**
 * How far each frame of the buzz swings the wings, in radians from pointing straight back. Up,
 * across and back down again.
 */
const WING_ANGLES = Object.freeze([2.0, 2.45, 2.9, 2.45]);

/**
 * Draws the bee in world units (see the top of this file).
 * @param {CanvasRenderingContext2D} ctx
 * @param {number} buzzFrame 0 to BEE_BUZZ_FRAME_COUNT - 1.
 * @param {boolean} eyesClosed
 */
export function drawBee(ctx, buzzFrame, eyesClosed) {

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    const wingAngle = WING_ANGLES[buzzFrame];

    // Back to front.
    drawWing(ctx, vec2(-0.25, 0.18), wingAngle + 0.25, 0.9);
    drawStinger(ctx);
    drawBody(ctx);
    drawHead(ctx, eyesClosed);
    drawWing(ctx, vec2(-0.08, 0.2), wingAngle, 1);
}

function drawStinger(ctx) {
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(-0.66, -0.1);
    ctx.lineTo(-1.02, -0.3);
    ctx.lineTo(-0.66, -0.4);
    ctx.closePath();
    ctx.fillStyle = STRIPE_COLOR.toString();
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = OUTLINE_WIDTH;
    ctx.fill();
    ctx.stroke();
    ctx.restore();
}

function drawBody(ctx) {
    const body = ellipse(BODY.x, BODY.y, BODY.radiusX, BODY.radiusY, BODY.tilt);
    drawSilhouette(ctx, BODY_COLOR, [body]);

    ctx.save();
    ctx.beginPath();
    body(ctx);
    ctx.clip();

    // Black stripes, leaning back a little like the original's.
    ctx.fillStyle = STRIPE_COLOR.toString();
    for (const x of [-0.5, -0.1, 0.3]) {
        ctx.save();
        ctx.translate(x, BODY.y);
        ctx.rotate(0.22);
        ctx.fillRect(-0.09, -1, 0.18, 2);
        ctx.restore();
    }

    // A soft highlight along the top of the body.
    ctx.beginPath();
    ellipse(BODY.x - 0.05, BODY.y + 0.3, 0.42, 0.1, BODY.tilt)(ctx);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fill();
    ctx.restore();

    // Outline again on top, so the stripes don't cover it.
    ctx.save();
    ctx.beginPath();
    body(ctx);
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = OUTLINE_WIDTH;
    ctx.stroke();
    ctx.restore();
}

function drawHead(ctx, eyesClosed) {

    drawAntennae(ctx);
    drawSilhouette(ctx, BODY_COLOR, [ellipse(HEAD.x, HEAD.y, HEAD.radius, HEAD.radius)]);

    // Rosy cheek.
    ctx.save();
    ctx.beginPath();
    ellipse(0.72, 0.02, 0.09, 0.06)(ctx);
    ctx.fillStyle = 'rgba(240, 120, 90, 0.45)';
    ctx.fill();

    // Smile.
    ctx.beginPath();
    ctx.moveTo(0.64, 0.05);
    ctx.quadraticCurveTo(0.78, -0.08, 0.92, 0.04);
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = OUTLINE_WIDTH;
    ctx.stroke();
    ctx.restore();

    // The far eye is smaller and sits at the edge of the head; the near one is big.
    drawEye(ctx, 0.95, 0.3, 0.09, 0.14, eyesClosed);
    drawEye(ctx, 0.74, 0.3, 0.13, 0.17, eyesClosed);
}

function drawAntennae(ctx) {
    ctx.save();
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = OUTLINE_WIDTH * 1.2;
    for (const [baseX, tipX] of [[0.46, 0.56], [0.66, 0.82]]) {
        // Up from the head, curling forward at the tip.
        ctx.beginPath();
        ctx.moveTo(baseX, 0.55);
        ctx.quadraticCurveTo(baseX - 0.06, 0.92, tipX, 0.98);
        ctx.quadraticCurveTo(tipX + 0.1, 0.98, tipX + 0.08, 0.9);
        ctx.stroke();
    }
    ctx.restore();
}

function drawEye(ctx, x, y, radiusX, radiusY, closed) {
    const eye = ellipse(x, y, radiusX, radiusY);

    ctx.save();
    ctx.beginPath();
    eye(ctx);
    ctx.fillStyle = closed ? shade(BODY_COLOR, -0.15).toString() : '#fff';
    ctx.fill();

    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = OUTLINE_WIDTH;
    if (closed) {
        // A lid over the eye with a curved lash line.
        ctx.beginPath();
        ctx.moveTo(x - radiusX * 0.9, y);
        ctx.quadraticCurveTo(x, y - radiusY * 0.8, x + radiusX * 0.9, y);
        ctx.stroke();
    } else {
        // Pupil looking ahead, with a shine.
        ctx.clip();
        const pupilRadius = radiusX * 0.55;
        ctx.beginPath();
        ctx.arc(x + radiusX * 0.35, y - radiusY * 0.1, pupilRadius, 0, 2 * Math.PI);
        ctx.fillStyle = '#111';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(x + radiusX * 0.5, y + radiusY * 0.12, pupilRadius * 0.35, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }
    ctx.restore();

    ctx.save();
    ctx.beginPath();
    eye(ctx);
    ctx.strokeStyle = OUTLINE_COLOR;
    ctx.lineWidth = OUTLINE_WIDTH;
    ctx.stroke();
    ctx.restore();
}

/**
 * A see-through wing, with a faint copy on either side of it so the fast buzz reads as a blur.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Vector2} root Where the wing joins the body.
 * @param {number} angle Direction the wing points, in radians (0 is forward, PI is back).
 * @param {number} scale
 */
function drawWing(ctx, root, angle, scale) {
    for (const [offset, alpha] of [[-0.3, 0.18], [0.3, 0.18], [0, 1]]) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.translate(root.x, root.y);
        ctx.rotate(angle + offset);
        ctx.scale(scale, scale);

        ctx.beginPath();
        ellipse(0.46, 0, 0.48, 0.25)(ctx);
        ctx.fillStyle = WING_COLOR;
        ctx.fill();
        ctx.strokeStyle = OUTLINE_COLOR;
        ctx.lineWidth = OUTLINE_WIDTH;
        ctx.stroke();

        if (alpha === 1) {
            // A vein down the middle.
            ctx.beginPath();
            ctx.moveTo(0.06, 0);
            ctx.quadraticCurveTo(0.45, 0.06, 0.8, 0.02);
            ctx.strokeStyle = 'rgba(80, 130, 160, 0.5)';
            ctx.lineWidth = OUTLINE_WIDTH * 0.7;
            ctx.stroke();
        }
        ctx.restore();
    }
}

/** The bee drawn into a sprite sheet: one row of buzz frames with eyes open, one with eyes closed. */
export class BeeSprites extends FrameSheet {
    constructor() {
        super(BEE_FRAME_SIZE, PIXELS_PER_UNIT, BEE_BUZZ_FRAME_COUNT, drawBee);
    }
}

/** Tracks the bee's wing buzz and blinks. */
export class BeeAnimation extends FlapBlinkAnimation {

    /**
     * @param {number} startTime The current time, in seconds.
     */
    constructor(startTime) {
        super(BEE_BUZZ_FRAME_COUNT, BEE_BUZZ_FRAMES_PER_SECOND, startTime);
    }
}

/** @type {BeeSprites | undefined} */
let beeSprites;

/**
 * The bee's sprite sheet, drawing it the first time it's asked for. initBeeArt() asks for it at
 * startup, so drawing doesn't happen mid-level.
 * @returns {BeeSprites}
 */
export function getBeeSprites() {
    beeSprites ??= new BeeSprites();
    return beeSprites;
}

/**
 * Draws the bee's current frame at a world position, the same way in game and in dev tools.
 * @param {Vector2} pos
 * @param {BeeAnimation} animation
 */
export function drawBeeFrame(pos, animation) {
    const { flapFrame, eyesClosed } = animation.getFrame(time);
    drawTile(pos, vec2(BEE_FRAME_SIZE.x, BEE_FRAME_SIZE.y), getBeeSprites().getTile(flapFrame, eyesClosed));
}

/** Draws the bee's sprite sheet. Call once at startup, once the engine is running. */
export function initBeeArt() {
    getBeeSprites();
}
