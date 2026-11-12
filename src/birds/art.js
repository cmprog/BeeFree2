// Bird art drawn in code. Each bird style is drawn once at startup into a sprite sheet (a canvas
// turned into an engine texture), with a frame for every wing position, eyes open and closed.
// In game a bird is then drawn like any other sprite.
//
// The drawing works in the bird's own world units: the bird faces left (-x), +y is up, and (0, 0)
// is the bird's position. The head is kept where the old art had it, so hats still fit
// (the BIRD anchor in hats/adjustments.js).

/** Number of wing positions in one flap. */
export const BIRD_FLAP_FRAME_COUNT = 6;

/** Area each frame covers, in world units, centered on the bird's position. */
export const BIRD_FRAME_SIZE = Object.freeze({ x: 3.8, y: 3.0 });

/** Sprite sheet pixels per world unit. About 2.5x what the game shows, so it stays sharp on phones. */
const PIXELS_PER_UNIT = 80;

const OUTLINE_COLOR = '#222';
const OUTLINE_WIDTH = 0.05;

/**
 * The colors of a bird. Only `body` is required; every other part defaults to a shade of the body
 * (or of the head, for the eyelid), so a style can set as few or as many colors as it likes.
 *
 * @typedef {object} BirdColors
 * @property {Color} body
 * @property {Color} [head] Defaults to the body color.
 * @property {Color} [belly] Defaults to a lighter body color.
 * @property {Color} [wing] Defaults to a darker body color.
 * @property {Color} [tail] Defaults to the wing color.
 * @property {Color} [beak]
 * @property {Color} [legs]
 * @property {Color} [eyelid] Defaults to a darker head color.
 */

export class BirdStyle {

    /**
     * @param {BirdColors} colors
     */
    constructor(colors) {
        const body = colors.body;
        const head = colors.head ?? body;
        const wing = colors.wing ?? shade(body, -0.25);

        /** @type {Color} */ this.body = body;
        /** @type {Color} */ this.head = head;
        /** @type {Color} */ this.belly = colors.belly ?? shade(body, 0.45);
        /** @type {Color} */ this.wing = wing;
        /** @type {Color} */ this.tail = colors.tail ?? wing;
        /** @type {Color} */ this.beak = colors.beak ?? rgb(0.98, 0.68, 0.12);
        /** @type {Color} */ this.legs = colors.legs ?? rgb(0.88, 0.6, 0.12);
        /** @type {Color} */ this.eyelid = colors.eyelid ?? shade(head, -0.15);
    }

    /**
     * A key that's the same for styles with the same colors, so they can share a sprite sheet.
     * @returns {string}
     */
    key() {
        return [this.body, this.head, this.belly, this.wing, this.tail, this.beak, this.legs, this.eyelid]
            .map(color => color.toString()).join(',');
    }
}

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
 * How far up the wings are for a frame of the flap: 1 is fully up, -1 fully down. The wings flip
 * from up to down by squashing through the middle, the classic flat-art flap.
 * @param {number} frame 0 to BIRD_FLAP_FRAME_COUNT - 1.
 * @returns {number}
 */
export function wingLiftForFrame(frame) {
    return Math.cos(2 * Math.PI * frame / BIRD_FLAP_FRAME_COUNT);
}

/**
 * Draws one bird into a 2D context whose transform is already set up in bird units
 * (see drawBirdFrame). Facing left, +y up.
 * @param {CanvasRenderingContext2D} ctx
 * @param {BirdStyle} style
 * @param {number} wingLift 1 (up) to -1 (down); see wingLiftForFrame.
 * @param {boolean} eyesClosed
 */
export function drawBird(ctx, style, wingLift, eyesClosed) {

    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.lineWidth = OUTLINE_WIDTH;
    ctx.strokeStyle = OUTLINE_COLOR;

    // Back to front.
    drawTail(ctx, style);
    drawWing(ctx, shade(style.wing, -0.2), vec2(0.3, 0.3), wingLift * 0.9, 0.45);
    drawLegs(ctx, style);
    drawBody(ctx, style);
    drawHead(ctx, style, eyesClosed);
    drawWing(ctx, style.wing, vec2(0.05, 0.25), wingLift, 0.3);
}

/**
 * Draws a list of shapes as one outlined silhouette: every shape is outlined first, then every
 * shape is filled, so the fills cover the outlines where the shapes overlap.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Color} color
 * @param {Array<(ctx: CanvasRenderingContext2D) => void>} shapes Each adds a path to the context.
 */
function drawSilhouette(ctx, color, shapes) {
    ctx.save();
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

/** @returns {(ctx: CanvasRenderingContext2D) => void} */
function ellipse(x, y, radiusX, radiusY, rotation = 0) {
    return ctx => ctx.ellipse(x, y, radiusX, radiusY, rotation, 0, 2 * Math.PI);
}

function drawTail(ctx, style) {
    // Three feathers fanning out behind the body.
    const shapes = [0.55, 0.15, -0.25].map(angle => {
        const length = 0.42;
        const x = 0.75 + Math.cos(angle) * length;
        const y = 0.12 + Math.sin(angle) * length;
        return ellipse(x, y, 0.36, 0.12, angle);
    });
    drawSilhouette(ctx, style.tail, shapes);
}

function drawLegs(ctx, style) {
    ctx.save();
    // Tucked up and trailing back under the body while flying, like the original art.
    for (const [hipX, footX, footY] of [[-0.35, 0.05, -1.02], [-0.05, 0.38, -0.95]]) {

        // Leg: an outlined thick line.
        ctx.beginPath();
        ctx.moveTo(hipX, -0.4);
        ctx.lineTo(footX, footY);
        ctx.lineWidth = 0.18;
        ctx.strokeStyle = OUTLINE_COLOR;
        ctx.stroke();
        ctx.lineWidth = 0.1;
        ctx.strokeStyle = style.legs.toString();
        ctx.stroke();

        // Three toes pointing back.
        for (const toeAngle of [-0.55, -0.1, 0.35]) {
            ctx.beginPath();
            ctx.moveTo(footX, footY);
            ctx.lineTo(footX + Math.cos(toeAngle) * 0.2, footY + Math.sin(toeAngle) * 0.2);
            ctx.lineWidth = 0.13;
            ctx.strokeStyle = OUTLINE_COLOR;
            ctx.stroke();
            ctx.lineWidth = 0.06;
            ctx.strokeStyle = style.legs.toString();
            ctx.stroke();
        }
    }
    ctx.restore();
}

function drawBody(ctx, style) {
    const body = ellipse(0.05, 0, 0.88, 0.62, -0.08);
    drawSilhouette(ctx, style.body, [body]);

    // The belly: a lighter patch on the lower front, kept inside the body.
    ctx.save();
    ctx.beginPath();
    body(ctx);
    ctx.clip();
    ctx.beginPath();
    ellipse(-0.35, -0.3, 0.62, 0.42, 0.2)(ctx);
    ctx.fillStyle = style.belly.toString();
    ctx.fill();
    ctx.restore();
}

function drawHead(ctx, style, eyesClosed) {
    drawSilhouette(ctx, style.head, [ellipse(-0.9, 0.15, 0.46, 0.44)]);

    // Beak: upper and lower halves, slightly open.
    ctx.save();
    ctx.lineWidth = OUTLINE_WIDTH;
    ctx.beginPath();
    ctx.moveTo(-1.22, -0.08);
    ctx.quadraticCurveTo(-1.5, -0.12, -1.66, -0.22);
    ctx.quadraticCurveTo(-1.45, -0.26, -1.2, -0.22);
    ctx.closePath();
    ctx.fillStyle = shade(style.beak, -0.2).toString();
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-1.2, 0.12);
    ctx.quadraticCurveTo(-1.55, 0.06, -1.76, -0.14);
    ctx.quadraticCurveTo(-1.45, -0.1, -1.22, -0.08);
    ctx.closePath();
    ctx.fillStyle = style.beak.toString();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Eye: big and white, with a heavy lid for the original's sleepy look.
    const eyeX = -1.08, eyeY = 0.3;
    const eye = ellipse(eyeX, eyeY, 0.19, 0.23);

    ctx.save();
    ctx.beginPath();
    eye(ctx);
    ctx.fillStyle = '#fff';
    ctx.fill();

    ctx.clip();
    if (!eyesClosed) {
        ctx.beginPath();
        ctx.arc(eyeX - 0.06, eyeY - 0.04, 0.1, 0, 2 * Math.PI);
        ctx.fillStyle = '#111';
        ctx.fill();
        ctx.beginPath();
        ctx.arc(eyeX - 0.09, eyeY, 0.035, 0, 2 * Math.PI);
        ctx.fillStyle = '#fff';
        ctx.fill();
    }

    // The lid covers the top of the eye, or all of it when blinking.
    const lidBottom = eyesClosed ? eyeY - 0.3 : eyeY + 0.06;
    ctx.beginPath();
    ctx.rect(eyeX - 0.3, lidBottom, 0.6, 0.6);
    ctx.fillStyle = style.eyelid.toString();
    ctx.fill();
    ctx.beginPath();
    if (eyesClosed) {
        // A curved lash line across the lower part of the closed eye.
        ctx.moveTo(eyeX - 0.18, eyeY - 0.04);
        ctx.quadraticCurveTo(eyeX, eyeY - 0.16, eyeX + 0.18, eyeY - 0.04);
    } else {
        ctx.moveTo(eyeX - 0.3, lidBottom);
        ctx.lineTo(eyeX + 0.3, lidBottom);
    }
    ctx.stroke();
    ctx.restore();

    ctx.beginPath();
    eye(ctx);
    ctx.stroke();
}

/**
 * A wing: a rounded base with three long feathers, like the original's raised "hand" wings.
 * @param {CanvasRenderingContext2D} ctx
 * @param {Color} color
 * @param {Vector2} shoulder Where the wing joins the body.
 * @param {number} lift 1 points the wing up, -1 down, in between squashes it.
 * @param {number} sweep How far the wing leans back, in radians.
 */
function drawWing(ctx, color, shoulder, lift, sweep) {
    ctx.save();
    ctx.translate(shoulder.x, shoulder.y);
    ctx.rotate(-sweep * Math.sign(lift)); // lean back (towards +x) whether up or down
    ctx.scale(1, lift);

    const shapes = [
        ellipse(0.02, 0.26, 0.28, 0.32),
        ...[-0.4, 0, 0.4].map(spread => {
            const x = Math.sin(spread) * 0.5 + 0.04;
            const y = Math.cos(spread) * 0.5 + 0.2;
            return ellipse(x, y, 0.13, 0.42, -spread);
        }),
    ];
    drawSilhouette(ctx, color, shapes);
    ctx.restore();
}

/**
 * Draws one frame of a bird into a canvas cell, setting up the bird-unit transform.
 * @param {CanvasRenderingContext2D} ctx
 * @param {BirdStyle} style
 * @param {number} cellX Left edge of the cell, in pixels.
 * @param {number} cellY Top edge of the cell, in pixels.
 * @param {number} pixelsPerUnit
 * @param {number} flapFrame
 * @param {boolean} eyesClosed
 */
export function drawBirdFrame(ctx, style, cellX, cellY, pixelsPerUnit, flapFrame, eyesClosed) {
    ctx.save();
    ctx.translate(cellX + BIRD_FRAME_SIZE.x * pixelsPerUnit / 2, cellY + BIRD_FRAME_SIZE.y * pixelsPerUnit / 2);
    ctx.scale(pixelsPerUnit, -pixelsPerUnit); // +y up, like the game world
    drawBird(ctx, style, wingLiftForFrame(flapFrame), eyesClosed);
    ctx.restore();
}

/**
 * A style drawn into a sprite sheet: one row of flap frames with eyes open, one with eyes closed.
 */
export class BirdSprites {

    /**
     * @param {BirdStyle} style
     */
    constructor(style) {
        const cellWidth = Math.ceil(BIRD_FRAME_SIZE.x * PIXELS_PER_UNIT);
        const cellHeight = Math.ceil(BIRD_FRAME_SIZE.y * PIXELS_PER_UNIT);

        /** @type {BirdStyle} */
        this.style = style;

        /** The drawn sheet, also handy for previews outside the engine. */
        this.canvas = document.createElement('canvas');
        this.canvas.width = cellWidth * BIRD_FLAP_FRAME_COUNT;
        this.canvas.height = cellHeight * 2;

        const ctx = this.canvas.getContext('2d');
        for (let row = 0; row < 2; row++) {
            for (let frame = 0; frame < BIRD_FLAP_FRAME_COUNT; frame++) {
                drawBirdFrame(ctx, style, frame * cellWidth, row * cellHeight, PIXELS_PER_UNIT, frame, row === 1);
            }
        }

        // Smooth, not pixelated: the art is drawn at a higher resolution than it's shown.
        const texture = new TextureInfo(this.canvas, true, false, false);

        /**
         * Tiles by [eyesClosed ? 1 : 0][flapFrame].
         * @type {TileInfo[][]}
         */
        this.tiles = [0, 1].map(row =>
            Array.from({ length: BIRD_FLAP_FRAME_COUNT }, (_, frame) =>
                new TileInfo(vec2(frame * cellWidth, row * cellHeight), vec2(cellWidth, cellHeight), texture, 0)));

        /** Cell size in pixels. */
        this.cellSize = vec2(cellWidth, cellHeight);
    }

    /**
     * @param {number} flapFrame
     * @param {boolean} eyesClosed
     * @returns {TileInfo}
     */
    getTile(flapFrame, eyesClosed) {
        return this.tiles[eyesClosed ? 1 : 0][flapFrame];
    }
}

/** Wing frames shown per second while flapping. */
export const BIRD_FLAPS_FRAMES_PER_SECOND = 12;

/** Seconds between blinks, picked at random in this range for each blink. */
const BLINK_INTERVAL = Object.freeze({ min: 2, max: 6 });

/** Seconds the eyes stay closed for a blink. */
const BLINK_DURATION = 0.15;

/**
 * Tracks one bird's flap and blinks. Each bird starts at a random point in the flap and blinks
 * on its own schedule, so a flock doesn't move in lockstep.
 */
export class BirdAnimation {

    /**
     * @param {number} startTime The current time, in seconds.
     */
    constructor(startTime) {
        this.flapOffset = Math.random() * BIRD_FLAP_FRAME_COUNT;
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
            flapFrame: Math.floor(currentTime * BIRD_FLAPS_FRAMES_PER_SECOND + this.flapOffset) % BIRD_FLAP_FRAME_COUNT,
            eyesClosed: currentTime >= this.nextBlinkTime,
        };
    }
}

function randomBlinkInterval() {
    return BLINK_INTERVAL.min + Math.random() * (BLINK_INTERVAL.max - BLINK_INTERVAL.min);
}

/** Sheets by style key, so birds with the same colors share one. */
const spritesByStyle = new Map();

/**
 * The sprite sheet for a style, drawing it the first time it's asked for. initBirdArt() asks for
 * every bird type's style at startup, so drawing doesn't happen mid-level.
 * @param {BirdStyle} style
 * @returns {BirdSprites}
 */
export function getBirdSprites(style) {
    const key = style.key();
    let sprites = spritesByStyle.get(key);
    if (!sprites) {
        sprites = new BirdSprites(style);
        spritesByStyle.set(key, sprites);
    }
    return sprites;
}

/**
 * Draws the sprite sheet of every bird type. Call once at startup, after initBirdTemplates().
 * @param {Iterable<{ style: BirdStyle }>} templates
 */
export function initBirdArt(templates) {
    for (const template of templates) {
        getBirdSprites(template.style);
    }
}
