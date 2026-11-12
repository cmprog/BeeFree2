import { queryElement } from "../../core/html.js";
import { registerClick } from "../../core/util.js";
import { BIRD_FRAME_SIZE, BirdAnimation, getBirdSprites } from "../../birds/art.js";
import { BIRD_TEMPLATES } from "../../birds/templates.js";
import { Menu } from "../menu.js";
import { MENUS } from "../registry.js";

/** How large the big preview draws each bird, in CSS pixels per world unit. */
const LARGE_SCALE = 70;

/**
 * Dev-only view (Settings > Debug on localhost) showing every bird type's art, flapping and
 * blinking: large, and at the size it appears in game. It draws straight from the generated sprite
 * sheets onto its own canvas, without the engine.
 */
export class BirdPreviewMenu extends Menu {

    constructor() {
        super('#menu-bird-preview');

        this.canvas = queryElement(this.element, 'canvas', HTMLCanvasElement);
        this.gameSizeCheckbox = queryElement(this.element, '.bird-preview-game-size', HTMLInputElement);
        this.gameSizeCheckbox.addEventListener('change', () => this.layout());

        registerClick(queryElement(this.element, '.bird-preview-done'), () => {
            this.close();
            MENUS.SETTINGS.open();
        });

        /** @type {number | undefined} */
        this.frameRequest = undefined;
    }

    onOpening() {
        // One entry per distinct look; the Whitneys share one, for example.
        const seen = new Set();
        this.entries = [];
        for (const template of Object.values(BIRD_TEMPLATES)) {
            const key = template.style.key();
            if (seen.has(key)) continue;
            seen.add(key);
            this.entries.push({
                name: template.name,
                sprites: getBirdSprites(template.style),
                animation: new BirdAnimation(performance.now() / 1000),
            });
        }
    }

    onOpened() {
        this.layout(); // now that the menu is showing and has a width
        const tick = () => {
            this.draw();
            this.frameRequest = requestAnimationFrame(tick);
        };
        tick();
    }

    closed() {
        if (this.frameRequest !== undefined) {
            cancelAnimationFrame(this.frameRequest);
            this.frameRequest = undefined;
        }
    }

    /** Sizes the canvas for the current bird size, in a grid that fits the menu's width. */
    layout() {
        const scale = this.getScale();
        this.cellWidth = BIRD_FRAME_SIZE.x * scale;
        this.cellHeight = BIRD_FRAME_SIZE.y * scale + 24; // room for the name
        const width = Math.max(this.canvas.parentElement.clientWidth, this.cellWidth);
        this.columns = Math.max(1, Math.floor(width / this.cellWidth));
        const rows = Math.ceil(this.entries.length / this.columns);

        const pixelRatio = window.devicePixelRatio || 1;
        this.canvas.style.width = `${this.columns * this.cellWidth}px`;
        this.canvas.style.height = `${rows * this.cellHeight}px`;
        this.canvas.width = Math.ceil(this.columns * this.cellWidth * pixelRatio);
        this.canvas.height = Math.ceil(rows * this.cellHeight * pixelRatio);
    }

    /** @returns {number} CSS pixels per world unit. */
    getScale() {
        // In game, a world unit is cameraScale CSS pixels.
        return this.gameSizeCheckbox.checked ? cameraScale : LARGE_SCALE;
    }

    draw() {
        const ctx = this.canvas.getContext('2d');
        const pixelRatio = this.canvas.width / parseFloat(this.canvas.style.width);
        ctx.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        const now = performance.now() / 1000;
        const scale = this.getScale();
        const birdWidth = BIRD_FRAME_SIZE.x * scale;
        const birdHeight = BIRD_FRAME_SIZE.y * scale;

        ctx.font = '14px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillStyle = '#000';

        this.entries.forEach((entry, i) => {
            const x = (i % this.columns) * this.cellWidth;
            const y = Math.floor(i / this.columns) * this.cellHeight;
            const { flapFrame, eyesClosed } = entry.animation.getFrame(now);
            const tile = entry.sprites.getTile(flapFrame, eyesClosed);

            ctx.drawImage(entry.sprites.canvas,
                tile.pos.x, tile.pos.y, tile.size.x, tile.size.y,
                x, y, birdWidth, birdHeight);
            ctx.fillText(entry.name, x + this.cellWidth / 2, y + birdHeight + 16);
        });
    }
}
