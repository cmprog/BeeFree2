import { BIRD_TEMPLATES, Bird, BirdTemplate } from './birds.js';
import { DoubleClickButton } from './button.js';
import { attachHat } from './hat-attachment.js';
import {
    HATS, HatWearer, clearDevHatTuning, getHatAdjustment, getHatWearerAnchor, resetHatAdjustment,
    resetHatWearerAnchor, saveDevHatTuning, serializeHatAdjustmentsFile,
} from './hats.js';
import { appendChildHtml, queryElement } from './html.js';
import { logInfo } from './logging.js';
import { Menu } from './menu.js';
import { MENUS } from './menu-registry.js';
import { Owl } from './owl.js';
import { spriteAtlas } from './sprites.js';
import { registerClick } from './util.js';

// The camera zooms in on the models while tuning, and is restored afterwards.
const TUNING_CAMERA_SCALE = 80;
const TUNING_CAMERA_POS = vec2(0, 0);

const GUIDE_COLOR = rgb(1, 0, 1);

/**
 * A static bee, bird and Sammy all wearing the same hat, drawn with the real game
 * rendering so what you see while tuning is exactly what shows up in game.
 */
class HatTuningScene extends EngineObject {

    /**
     * @param {string} hatId
     */
    constructor(hatId) {

        super();
        this.renderOrder = 5000;
        this.showGuides = true;

        // A plain object rather than a Bee, which would chase the mouse and shoot.
        this.bee = new EngineObject(vec2(-5, 0), vec2(2), spriteAtlas.bee);
        this.bee.renderOrder = 400;
        const beeHat = attachHat(this.bee, HatWearer.BEE, hatId, 410);

        // Default templates neither move nor shoot.
        const birdTemplate = new BirdTemplate('Hat Model', '')
            .withColors(BIRD_TEMPLATES.fred.bodyColor, BIRD_TEMPLATES.fred.headColor);
        this.bird = new Bird(vec2(-1.5, 0), birdTemplate);
        this.bird.wearHat(hatId);

        this.owl = new Owl(vec2(2, 0));
        this.owl.wearHat(hatId);

        /** @type {Array<import('./hat-attachment.js').HatAttachment>} */
        this.hats = [beeHat, this.bird.hat, this.owl.hat];
    }

    /**
     * @param {string} hatId
     */
    setHat(hatId) {
        for (const hat of this.hats) {
            hat.setHat(hatId);
        }
    }

    update() {
        // Purposefully not calling super, the scene doesn't move.
    }

    render() {

        if (!this.showGuides) return;

        for (const hat of this.hats) {

            const wearer = hat.parent;
            if (!wearer) continue;

            // The wearer's anchor: where an unadjusted hat is centered.
            const anchor = getHatWearerAnchor(hat.wearerType);
            const anchorPos = vec2(anchor.x, anchor.y).rotate(wearer.angle).add(wearer.pos);
            const crossSize = 0.15;
            drawLine(anchorPos.add(vec2(-crossSize, 0)), anchorPos.add(vec2(crossSize, 0)), 0.03, GUIDE_COLOR);
            drawLine(anchorPos.add(vec2(0, -crossSize)), anchorPos.add(vec2(0, crossSize)), 0.03, GUIDE_COLOR);

            // The hat tile's bounds.
            const half = hat.size.scale(0.5);
            const corners = [vec2(-half.x, -half.y), vec2(half.x, -half.y), vec2(half.x, half.y), vec2(-half.x, half.y)]
                .map(corner => corner.rotate(hat.angle).add(hat.pos));
            for (let i = 0; i < corners.length; i++) {
                drawLine(corners[i], corners[(i + 1) % corners.length], 0.02, GUIDE_COLOR);
            }
        }
    }

    destroy() {
        super.destroy();
        this.bee.destroy();
        this.bird.destroy();
        this.owl.destroy();
    }
}

/**
 * Dev-only view for positioning hats. Adjust the sliders while looking at the bee, a bird and
 * Sammy wearing the hat, then copy the generated hat-adjustments.js. Tuning is kept in local
 * storage between reloads until it is discarded.
 */
export class HatTuningMenu extends Menu {

    constructor() {
        super('#menu-hat-tuning');

        this.contentEl = queryElement(this.element, '.content');

        this.hatIndex = 0;
        this.wearer = HatWearer.BEE;

        /** @type {HatTuningScene | undefined} */
        this.scene = undefined;

        /** Callbacks that update each control from the current values. */
        this.refreshCallbacks = [];

        this.buildControls();

        registerClick(queryElement(this.element, '.hat-tuning-done'), () => {
            this.close();
            MENUS.SETTINGS.open();
        });
    }

    get hat() {
        return HATS[this.hatIndex];
    }

    buildControls() {

        // ---- Hat selection ----------------------------------------------------
        const hatSection = this.appendSection('Hat');

        const hatSelect = appendChildHtml(hatSection, `<select class="hat-select"></select>`, HTMLSelectElement);
        HATS.forEach((hat, index) => {
            const option = document.createElement('option');
            option.value = index.toString();
            option.innerText = `${hat.name} (${hat.id})`;
            hatSelect.appendChild(option);
        });
        hatSelect.addEventListener('change', () => this.setHatIndex(Number(hatSelect.value)));
        this.refreshCallbacks.push(() => hatSelect.value = this.hatIndex.toString());

        const hatNav = appendChildHtml(hatSection, `
            <div class="row">
                <button type="button" class="prev">&larr; Prev</button>
                <button type="button" class="next">Next &rarr;</button>
            </div>`);
        registerClick(queryElement(hatNav, '.prev'), () => this.setHatIndex((this.hatIndex + HATS.length - 1) % HATS.length));
        registerClick(queryElement(hatNav, '.next'), () => this.setHatIndex((this.hatIndex + 1) % HATS.length));

        // ---- Per-hat adjustments ------------------------------------------------
        const adjustmentSection = this.appendSection('Hat adjustment (shared by all wearers)');
        const adjustment = () => getHatAdjustment(this.hat.id);
        this.appendSlider(adjustmentSection, 'x (forward)', -1.5, 1.5, 0.01, () => adjustment().x, v => adjustment().x = v);
        this.appendSlider(adjustmentSection, 'y (up)', -1.5, 1.5, 0.01, () => adjustment().y, v => adjustment().y = v);
        this.appendSlider(adjustmentSection, 'scale', 0.2, 3, 0.01, () => adjustment().scale, v => adjustment().scale = v);
        this.appendSlider(adjustmentSection, 'angle (deg)', -90, 90, 1, () => adjustment().angle, v => adjustment().angle = v);

        const resetHat = appendChildHtml(adjustmentSection, `<button type="button">Reset this hat</button>`);
        registerClick(resetHat, () => {
            resetHatAdjustment(this.hat.id);
            this.onValuesChanged();
        });

        // ---- Wearer anchors -----------------------------------------------------
        const wearerSection = this.appendSection('Wearer anchor (shared by all hats)');

        const wearerSelect = appendChildHtml(wearerSection, `<select></select>`, HTMLSelectElement);
        for (const wearer of Object.values(HatWearer)) {
            const option = document.createElement('option');
            option.value = wearer.key;
            option.innerText = wearer.name;
            wearerSelect.appendChild(option);
        }
        wearerSelect.addEventListener('change', () => {
            this.wearer = HatWearer[wearerSelect.value];
            this.refreshControls();
        });
        this.refreshCallbacks.push(() => wearerSelect.value = this.wearer.key);

        const anchor = () => getHatWearerAnchor(this.wearer);
        this.appendSlider(wearerSection, 'x', -2, 2, 0.01, () => anchor().x, v => anchor().x = v);
        this.appendSlider(wearerSection, 'y', -2, 2, 0.01, () => anchor().y, v => anchor().y = v);
        this.appendSlider(wearerSection, 'size', 0.2, 2, 0.01, () => anchor().size, v => anchor().size = v);

        const resetWearer = appendChildHtml(wearerSection, `<button type="button">Reset this wearer</button>`);
        registerClick(resetWearer, () => {
            resetHatWearerAnchor(this.wearer);
            this.onValuesChanged();
        });

        // ---- Output -------------------------------------------------------------
        const outputSection = this.appendSection('Output');

        const guides = appendChildHtml(outputSection, `<label><input type="checkbox" checked> Show guides</label>`);
        const guidesCheckbox = queryElement(guides, 'input', HTMLInputElement);
        guidesCheckbox.addEventListener('change', () => {
            if (this.scene) this.scene.showGuides = guidesCheckbox.checked;
        });

        const copyButton = appendChildHtml(outputSection, `<button type="button">Copy adjustments file</button>`);
        registerClick(copyButton, this.copyAdjustmentsFile.bind(this));

        const discardButton = appendChildHtml(outputSection, `<button type="button" data-confirmation-text="Discard all local tuning?">Discard local tuning</button>`);
        DoubleClickButton.create(discardButton, () => {
            clearDevHatTuning();
            window.location.reload();
        });

        this.statusEl = appendChildHtml(outputSection, `<div class="status">Tuning is saved in this browser until copied into src/hat-adjustments.js.</div>`);
    }

    /**
     * @param {string} title
     * @returns {HTMLElement}
     */
    appendSection(title) {
        const sectionEl = appendChildHtml(this.contentEl, `
            <div class="section">
                <div class="section-header"></div>
            </div>`);
        queryElement(sectionEl, '.section-header').innerText = title;
        return sectionEl;
    }

    /**
     * Adds a slider with a matching number box.
     * @param {HTMLElement} parentEl
     * @param {string} label
     * @param {number} min
     * @param {number} max
     * @param {number} step
     * @param {() => number} getValue
     * @param {(value: number) => void} setValue
     */
    appendSlider(parentEl, label, min, max, step, getValue, setValue) {

        const rowEl = appendChildHtml(parentEl, `
            <div class="slider">
                <span class="label"></span>
                <input type="range" min="${min}" max="${max}" step="${step}">
                <input type="number" min="${min}" max="${max}" step="${step}">
            </div>`);
        queryElement(rowEl, '.label').innerText = label;

        const rangeEl = queryElement(rowEl, 'input[type=range]', HTMLInputElement);
        const numberEl = queryElement(rowEl, 'input[type=number]', HTMLInputElement);

        const onInput = (ev) => {
            const value = Number(ev.target.value);
            if (Number.isNaN(value)) return;
            setValue(value);
            this.onValuesChanged();
        };
        rangeEl.addEventListener('input', onInput);
        numberEl.addEventListener('change', onInput);

        this.refreshCallbacks.push(() => {
            const value = getValue();
            rangeEl.value = value.toString();
            if (document.activeElement != numberEl) {
                numberEl.value = (Math.round(value * 1000) / 1000).toString();
            }
        });
    }

    /**
     * @param {number} index
     */
    setHatIndex(index) {
        this.hatIndex = index;
        if (this.scene) this.scene.setHat(this.hat.id);
        this.refreshControls();
    }

    onValuesChanged() {
        saveDevHatTuning();
        this.refreshControls();
    }

    refreshControls() {
        for (const refresh of this.refreshCallbacks) {
            refresh();
        }
    }

    copyAdjustmentsFile() {

        const text = serializeHatAdjustmentsFile();
        logInfo(`Hat adjustments file:\n${text}`);

        navigator.clipboard.writeText(text)
            .then(() => this.statusEl.innerText = 'Copied! Paste it over src/hat-adjustments.js.')
            .catch(() => this.statusEl.innerText = 'Copy failed. The file contents were written to the console log instead.');
    }

    onOpening() {

        this.previousCameraScale = cameraScale;
        this.previousCameraPos = cameraPos.copy();
        setCameraScale(TUNING_CAMERA_SCALE);
        setCameraPos(TUNING_CAMERA_POS);

        this.scene = new HatTuningScene(this.hat.id);
        this.refreshControls();
    }

    closed() {

        if (this.scene) {
            this.scene.destroy();
            this.scene = undefined;
        }

        setCameraScale(this.previousCameraScale);
        setCameraPos(this.previousCameraPos);
    }
}
