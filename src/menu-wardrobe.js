import { appendChildHtml, queryElement } from './html.js';
import { HAT_ATLAS_COLUMNS, HAT_ATLAS_TILE_SIZE, HATS, HatTier, HatWearer, computeHatPlacement, getHat, getHatAtlasCell } from './hats.js';
import { Menu } from './menu.js';
import { currentPlayer } from './player.js';
import { registerClick, Util } from './util.js';

// These match how the bee is drawn in game (spriteAtlas.bee and the Bee entity size),
// so the preview shows the hat exactly as it will look while playing.
const BEE_FRAME_WIDTH = 75;
const BEE_FRAME_HEIGHT = 59;
const BEE_FRAME_COUNT = 4;
const BEE_WORLD_SIZE = 2;

/** How many world units fit across the preview canvas. */
const PREVIEW_WORLD_WIDTH = 4;

const PURCHASE_CONFIRM_DURATION_MS = 2000;

/**
 * Lets the player buy hats with honeycomb and choose which one the bee wears.
 *
 * Tapping a hat selects it and shows it on the bee in the preview, which works the same
 * for mouse and touch. With a mouse, hovering over a hat also previews it temporarily.
 */
export class WardrobeMenu extends Menu {

    constructor() {
        super('#menu-wardrobe');

        /** @type {HTMLCanvasElement} */
        this.previewCanvas = queryElement(this.element, '.preview-canvas', HTMLCanvasElement);
        this.previewContext = this.previewCanvas.getContext('2d');
        this.previewNameEl = queryElement(this.element, '.preview-name');
        this.previewDetailEl = queryElement(this.element, '.preview-detail');
        this.actionButton = queryElement(this.element, '.preview-action', HTMLButtonElement);
        this.availableHoneycombEl = queryElement(this.element, '.available-honeycomb');

        this.beeImage = new Image();
        this.beeImage.src = 'img/bee.png';
        this.hatsImage = new Image();
        this.hatsImage.src = 'img/hats.png';

        /**
         * The hat the player tapped on, or null for "no hat".
         * @type {string | null}
         */
        this.selectedHatId = null;

        /**
         * The hat under the mouse, null for "no hat", or undefined when not hovering.
         * @type {string | null | undefined}
         */
        this.hoveredHatId = undefined;

        /** Set while waiting for the second tap that confirms a purchase. */
        this.purchaseConfirmTimeout = undefined;

        this.animationFrameRequest = undefined;

        /**
         * Hat tile elements keyed by hat id ('' for the "no hat" tile).
         * @type {Map<string, HTMLElement>}
         */
        this.hatTileElements = new Map();

        this.buildHatList();

        registerClick(this.actionButton, this.onActionClicked.bind(this));
    }

    buildHatList() {

        const hatsEl = queryElement(this.element, '.wardrobe-hats');

        const noHatListEl = appendChildHtml(hatsEl, `<ol class="hat-list"></ol>`);
        this.createHatTile(noHatListEl, null);

        for (const tier of Object.values(HatTier)) {

            const sectionEl = appendChildHtml(hatsEl, `
                <div class="section">
                    <div class="section-header">${tier.name} &middot; ${tier.price} honeycomb</div>
                    <ol class="hat-list"></ol>
                </div>
            `);

            const listEl = queryElement(sectionEl, '.hat-list');
            for (const hat of HATS.filter(x => x.tier == tier)) {
                this.createHatTile(listEl, hat);
            }
        }
    }

    /**
     * @param {HTMLElement} listEl
     * @param {import('./hats.js').Hat | null} hat Null for the "no hat" tile.
     */
    createHatTile(listEl, hat) {

        const tileEl = appendChildHtml(listEl, `
            <li class="hat-tile">
                <div class="hat-thumbnail"></div>
                <div class="hat-name"></div>
                <div class="hat-status"></div>
            </li>
        `);

        const thumbnailEl = queryElement(tileEl, '.hat-thumbnail');

        if (hat) {
            const rowCount = Math.ceil(HATS.length / HAT_ATLAS_COLUMNS);
            const { column, row } = getHatAtlasCell(hat);
            thumbnailEl.style.backgroundSize = `${HAT_ATLAS_COLUMNS * 100}% ${rowCount * 100}%`;
            thumbnailEl.style.backgroundPosition =
                `${(column / (HAT_ATLAS_COLUMNS - 1)) * 100}% ${(row / (rowCount - 1)) * 100}%`;
        } else {
            tileEl.classList.add('no-hat');
        }

        queryElement(tileEl, '.hat-name').innerText = hat ? hat.name : 'No Hat';

        const hatId = hat ? hat.id : null;

        registerClick(tileEl, () => this.selectHat(hatId));

        // Hover previews are only for mice. On touch devices a tap selects instead.
        tileEl.addEventListener('pointerenter', (ev) => {
            if (ev.pointerType != 'mouse') return;
            this.hoveredHatId = hatId;
            this.refreshPreviewText();
        });
        tileEl.addEventListener('pointerleave', (ev) => {
            if (ev.pointerType != 'mouse') return;
            this.hoveredHatId = undefined;
            this.refreshPreviewText();
        });

        this.hatTileElements.set(hatId ?? '', tileEl);
    }

    /**
     * The hat currently shown on the preview bee.
     * @returns {string | null}
     */
    getPreviewHatId() {
        return (this.hoveredHatId !== undefined) ? this.hoveredHatId : this.selectedHatId;
    }

    /**
     * @param {string | null} hatId
     */
    selectHat(hatId) {
        if (hatId != this.selectedHatId) {
            this.cancelPurchaseConfirmation();
        }
        this.selectedHatId = hatId;
        this.refresh();
    }

    onActionClicked() {

        const hatId = this.selectedHatId;

        if (!hatId) {
            currentPlayer.equipHat(null);

        } else if (currentPlayer.ownsHat(hatId)) {
            currentPlayer.equipHat(hatId);

        } else if (this.purchaseConfirmTimeout) {
            this.cancelPurchaseConfirmation();
            currentPlayer.purchaseHat(hatId);

        } else if (currentPlayer.availableHoneycomb >= getHat(hatId).tier.price) {
            this.purchaseConfirmTimeout = window.setTimeout(() => {
                this.purchaseConfirmTimeout = undefined;
                this.refresh();
            }, PURCHASE_CONFIRM_DURATION_MS);
        }

        this.refresh();
    }

    cancelPurchaseConfirmation() {
        if (this.purchaseConfirmTimeout) {
            window.clearTimeout(this.purchaseConfirmTimeout);
            this.purchaseConfirmTimeout = undefined;
        }
    }

    onOpening() {
        this.selectedHatId = currentPlayer.equippedHat;
        this.hoveredHatId = undefined;
        this.cancelPurchaseConfirmation();
        this.refresh();
        this.startPreviewAnimation();
    }

    closed() {
        this.cancelPurchaseConfirmation();
        this.stopPreviewAnimation();
    }

    refresh() {

        this.availableHoneycombEl.innerText = `${currentPlayer.availableHoneycomb.toFixed(1)} honeycomb available`;

        for (const [key, tileEl] of this.hatTileElements) {

            const hat = getHat(key);
            const hatId = hat ? hat.id : null;
            const isOwned = !hat || currentPlayer.ownsHat(hat.id);
            const isWorn = currentPlayer.equippedHat == hatId;

            Util.setClass(tileEl, 'selected', this.selectedHatId == hatId);
            Util.setClass(tileEl, 'worn', isWorn);
            Util.setClass(tileEl, 'owned', isOwned);
            Util.setClass(tileEl, 'unaffordable', !isOwned && currentPlayer.availableHoneycomb < hat.tier.price);

            let status;
            if (isWorn) {
                status = 'Wearing';
            } else if (!hat) {
                status = '';
            } else if (isOwned) {
                status = 'Owned';
            } else {
                status = `${hat.tier.price} honeycomb`;
            }
            queryElement(tileEl, '.hat-status').innerText = status;
        }

        this.refreshPreviewText();
        this.refreshActionButton();
    }

    refreshPreviewText() {

        const hat = getHat(this.getPreviewHatId());

        if (!hat) {
            this.previewNameEl.innerText = 'No Hat';
            this.previewDetailEl.innerText = 'Just a bee being a bee.';
            return;
        }

        this.previewNameEl.innerText = hat.name;
        this.previewDetailEl.innerText = currentPlayer.ownsHat(hat.id)
            ? hat.tier.name
            : `${hat.tier.name} · trying it on`;
    }

    refreshActionButton() {

        const hat = getHat(this.selectedHatId);

        let text;
        let enabled = true;

        if (!hat) {
            enabled = currentPlayer.equippedHat != null;
            text = enabled ? 'Take Off Hat' : 'No Hat On';

        } else if (currentPlayer.equippedHat == hat.id) {
            enabled = false;
            text = `Wearing ${hat.name}`;

        } else if (currentPlayer.ownsHat(hat.id)) {
            text = `Wear ${hat.name}`;

        } else if (this.purchaseConfirmTimeout) {
            text = 'Tap again to buy';

        } else if (currentPlayer.availableHoneycomb >= hat.tier.price) {
            text = `Buy ${hat.name} for ${hat.tier.price} honeycomb`;

        } else {
            enabled = false;
            const missing = Math.ceil(hat.tier.price - currentPlayer.availableHoneycomb);
            text = `Need ${missing} more honeycomb`;
        }

        this.actionButton.innerText = text;
        this.actionButton.disabled = !enabled;
        Util.setClass(this.actionButton, 'confirming', !!this.purchaseConfirmTimeout);
    }

    startPreviewAnimation() {
        this.stopPreviewAnimation();
        const step = () => {
            this.drawPreview();
            this.animationFrameRequest = window.requestAnimationFrame(step);
        };
        step();
    }

    stopPreviewAnimation() {
        if (this.animationFrameRequest) {
            window.cancelAnimationFrame(this.animationFrameRequest);
            this.animationFrameRequest = undefined;
        }
    }

    drawPreview() {

        const canvas = this.previewCanvas;
        const context = this.previewContext;

        context.clearRect(0, 0, canvas.width, canvas.height);

        // Pixels per world unit. The bee sits a little low and left so tall hats fit.
        const scale = canvas.width / PREVIEW_WORLD_WIDTH;
        const beeX = canvas.width * 0.45;
        const beeY = canvas.height * 0.6;

        if (this.beeImage.complete) {
            const frame = Math.floor(performance.now() / 250) % BEE_FRAME_COUNT;
            const beeSize = BEE_WORLD_SIZE * scale;
            context.drawImage(
                this.beeImage,
                frame * BEE_FRAME_WIDTH, 0, BEE_FRAME_WIDTH, BEE_FRAME_HEIGHT,
                beeX - (beeSize / 2), beeY - (beeSize / 2), beeSize, beeSize);
        }

        const hat = getHat(this.getPreviewHatId());
        if (hat && this.hatsImage.complete) {

            const placement = computeHatPlacement(hat.id, HatWearer.BEE);
            const { column, row } = getHatAtlasCell(hat);
            const size = placement.size * scale;

            context.save();
            // World space is y-up, the canvas is y-down.
            context.translate(beeX + (placement.x * scale), beeY - (placement.y * scale));
            // Both LittleJS and canvas rotate clockwise for positive angles.
            context.rotate(placement.angle);
            context.scale(placement.mirror ? -1 : 1, 1);
            context.drawImage(
                this.hatsImage,
                column * HAT_ATLAS_TILE_SIZE, row * HAT_ATLAS_TILE_SIZE, HAT_ATLAS_TILE_SIZE, HAT_ATLAS_TILE_SIZE,
                -size / 2, -size / 2, size, size);
            context.restore();
        }
    }
}
