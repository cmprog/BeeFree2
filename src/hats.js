import { HAT_ADJUSTMENTS, HAT_WEARER_ANCHORS } from './hat-adjustments.js';
import { GAME_SETTINGS, HAT_PRICE_BASIC, HAT_PRICE_FABULOUS, HAT_PRICE_FANCY } from './settings.js';

// NOTE: This module must not import player.js (the player validates hats on load)
// or sprites.js (the sprite atlas builds the hat tiles from HATS).

/**
 * @typedef {object} HatTier
 * @property {string} name
 * @property {number} price The honeycomb cost of each hat in the tier.
 */

/**
 * @typedef {object} Hat
 * @property {string} id Stable identifier, persisted in saves. Never rename.
 * @property {string} name User facing name.
 * @property {HatTier} tier
 * @property {number} atlasIndex Index of the hat in img/hats.png (row-major, 7 per row).
 */

/**
 * @typedef {object} HatWearerAnchor
 * @property {number} x
 * @property {number} y
 * @property {number} size
 */

/**
 * @typedef {object} HatAdjustment
 * @property {number} x
 * @property {number} y
 * @property {number} scale
 * @property {number} angle Degrees.
 */

export const HatTier = Object.freeze({
    /** @type {HatTier} */
    BASIC: { name: 'Everyday Hats', price: HAT_PRICE_BASIC },
    /** @type {HatTier} */
    FANCY: { name: 'Fancy Hats', price: HAT_PRICE_FANCY },
    /** @type {HatTier} */
    FABULOUS: { name: 'Fabulous Hats', price: HAT_PRICE_FABULOUS },
});

/**
 * The kinds of things that can wear a hat. Each has an anchor in HAT_WEARER_ANCHORS.
 */
export const HatWearer = Object.freeze({
    BEE: { key: 'BEE', name: 'Bee', facing: 1 },
    // Birds face left, so their hats are mirrored.
    BIRD: { key: 'BIRD', name: 'Bird', facing: -1 },
    SAMMY: { key: 'SAMMY', name: 'Sammy', facing: 1 },
});

/** The number of hats per row in img/hats.png. */
export const HAT_ATLAS_COLUMNS = 7;

/** The size, in pixels, of each hat in img/hats.png. */
export const HAT_ATLAS_TILE_SIZE = 128;

// Ordered to match img/hats.png, which is laid out alphabetically by the file names in img/hats/.
const HAT_DEFINITIONS = [
    ['fiftiesMilitary', '50s Military', HatTier.BASIC],
    ['fiftiesNurse', '50s Nurse', HatTier.BASIC],
    ['antlers', 'Antlers', HatTier.FANCY],
    ['army', 'Army Helmet', HatTier.BASIC],
    ['baseballCap', 'Baseball Cap', HatTier.BASIC],
    ['beanie', 'Beanie', HatTier.BASIC],
    ['beanieWithTassels', 'Pom-Pom Beanie', HatTier.BASIC],
    ['beret', 'Beret', HatTier.BASIC],
    ['bicorn', 'Pirate Bicorn', HatTier.FANCY],
    ['birthday', 'Party Hat', HatTier.FANCY],
    ['bowlerHat', 'Bowler Hat', HatTier.BASIC],
    ['bunny', 'Bunny Ears', HatTier.FANCY],
    ['captains', 'Captain\'s Hat', HatTier.BASIC],
    ['catEars', 'Cat Ears', HatTier.FANCY],
    ['classicFedora', 'Fedora', HatTier.BASIC],
    ['cowboy', 'Cowboy Hat', HatTier.BASIC],
    ['crown', 'Crown', HatTier.FABULOUS],
    ['fez', 'Fez', HatTier.BASIC],
    ['fireman', 'Fire Helmet', HatTier.BASIC],
    ['freakazoid', 'Wild Hair', HatTier.FANCY],
    ['graduation', 'Graduation Cap', HatTier.BASIC],
    ['hardHat', 'Hard Hat', HatTier.BASIC],
    ['horseHead', 'Horse Head', HatTier.FABULOUS],
    ['hotdog', 'Hot Dog', HatTier.FABULOUS],
    ['leprechaun', 'Leprechaun Hat', HatTier.FANCY],
    ['lumberjack', 'Trapper Hat', HatTier.BASIC],
    ['outback', 'Outback Hat', HatTier.BASIC],
    ['pinwheel', 'Propeller Cap', HatTier.FANCY],
    ['police', 'Police Cap', HatTier.BASIC],
    ['princess', 'Princess Hat', HatTier.FANCY],
    ['redBonnet', 'Red Bonnet', HatTier.BASIC],
    ['robinhood', 'Robin Hood Hat', HatTier.FANCY],
    ['shark', 'Shark', HatTier.FABULOUS],
    ['skeleton', 'Skull', HatTier.FABULOUS],
    ['spartan', 'Spartan Helmet', HatTier.FANCY],
    ['sunhat', 'Sun Hat', HatTier.BASIC],
    ['takuhatsugasa', 'Straw Hat', HatTier.BASIC],
    ['tiara', 'Tiara', HatTier.FABULOUS],
    ['tophat', 'Top Hat', HatTier.FABULOUS],
    ['umbrella', 'Umbrella Hat', HatTier.FANCY],
    ['viking', 'Viking Helmet', HatTier.FANCY],
    ['waldo', 'Striped Beanie', HatTier.FANCY],
    ['wig', 'Fancy Wig', HatTier.FABULOUS],
    ['ww1German', 'Spiked Helmet', HatTier.FANCY],
];

/**
 * All hats, in atlas order.
 * @type {ReadonlyArray<Hat>}
 */
export const HATS = Object.freeze(HAT_DEFINITIONS.map(([id, name, tier], atlasIndex) =>
    Object.freeze({ id, name, tier, atlasIndex })));

/** @type {ReadonlyMap<string, Hat>} */
const HATS_BY_ID = new Map(HATS.map(hat => [hat.id, hat]));

/**
 * @param {string} id
 * @returns {Hat | undefined}
 */
export function getHat(id) {
    return HATS_BY_ID.get(id);
}

/**
 * Picks a random hat from every hat in the game, regardless of what the player owns.
 * @returns {Hat}
 */
export function pickRandomHat() {
    return HATS[randInt(0, HATS.length)];
}

/**
 * @param {Hat} hat
 * @returns {{ column: number, row: number }}
 */
export function getHatAtlasCell(hat) {
    return {
        column: hat.atlasIndex % HAT_ATLAS_COLUMNS,
        row: Math.floor(hat.atlasIndex / HAT_ATLAS_COLUMNS),
    };
}

const DEFAULT_ADJUSTMENT = Object.freeze({ x: 0, y: 0, scale: 1, angle: 0 });

/**
 * Gets the live (and, in dev, mutable) adjustment for a hat.
 * @param {string} hatId
 * @returns {HatAdjustment}
 */
export function getHatAdjustment(hatId) {
    if (!(hatId in HAT_ADJUSTMENTS)) {
        HAT_ADJUSTMENTS[hatId] = { ...DEFAULT_ADJUSTMENT };
    }
    return HAT_ADJUSTMENTS[hatId];
}

/**
 * Gets the live (and, in dev, mutable) anchor for a wearer.
 * @param {{ key: string }} wearer One of {@link HatWearer}.
 * @returns {HatWearerAnchor}
 */
export function getHatWearerAnchor(wearer) {
    return HAT_WEARER_ANCHORS[wearer.key];
}

/**
 * @typedef {object} HatPlacement
 * @property {number} x Center of the hat in the wearer's local space.
 * @property {number} y
 * @property {number} size Width and height of the hat.
 * @property {number} angle Radians, clockwise, matching LittleJS.
 * @property {boolean} mirror
 */

/**
 * Computes where a hat goes on a wearer, in the wearer's local world units. This is shared by the
 * in-game rendering and the wardrobe preview so they always match.
 * @param {string} hatId
 * @param {{ key: string, facing: number }} wearer One of {@link HatWearer}.
 * @returns {HatPlacement}
 */
export function computeHatPlacement(hatId, wearer) {
    const anchor = getHatWearerAnchor(wearer);
    const adjustment = getHatAdjustment(hatId);
    return {
        x: anchor.x + (wearer.facing * adjustment.x * anchor.size),
        y: anchor.y + (adjustment.y * anchor.size),
        size: anchor.size * adjustment.scale,
        angle: wearer.facing * adjustment.angle * (Math.PI / 180),
        mirror: wearer.facing < 0,
    };
}

// =============================================================================
// Dev-only tuning persistence
// =============================================================================

const DEV_TUNING_STORAGE_KEY = 'dev_hat_tuning';

// Snapshots of the values from hat-adjustments.js, taken before any local tuning is applied,
// so the tuning view can reset back to them.
const SOURCE_WEARER_ANCHORS = JSON.parse(JSON.stringify(HAT_WEARER_ANCHORS));
const SOURCE_HAT_ADJUSTMENTS = JSON.parse(JSON.stringify(HAT_ADJUSTMENTS));

/**
 * Resets a hat's adjustment to the value in hat-adjustments.js.
 * @param {string} hatId
 */
export function resetHatAdjustment(hatId) {
    Object.assign(getHatAdjustment(hatId), SOURCE_HAT_ADJUSTMENTS[hatId] ?? DEFAULT_ADJUSTMENT);
}

/**
 * Resets a wearer's anchor to the value in hat-adjustments.js.
 * @param {{ key: string }} wearer One of {@link HatWearer}.
 */
export function resetHatWearerAnchor(wearer) {
    Object.assign(getHatWearerAnchor(wearer), SOURCE_WEARER_ANCHORS[wearer.key]);
}

/**
 * Saves the current adjustments to local storage so tuning survives a reload.
 * Only used by the dev tuning view.
 */
export function saveDevHatTuning() {
    localStorage.setItem(DEV_TUNING_STORAGE_KEY, JSON.stringify({
        anchors: HAT_WEARER_ANCHORS,
        adjustments: HAT_ADJUSTMENTS,
    }));
}

/**
 * Removes any locally saved tuning. Takes effect on the next reload.
 */
export function clearDevHatTuning() {
    localStorage.removeItem(DEV_TUNING_STORAGE_KEY);
}

/**
 * @returns {boolean} Whether there is locally saved tuning.
 */
export function hasDevHatTuning() {
    return localStorage.getItem(DEV_TUNING_STORAGE_KEY) != null;
}

function loadDevHatTuning() {
    const text = localStorage.getItem(DEV_TUNING_STORAGE_KEY);
    if (!text) return;

    const saved = JSON.parse(text);
    for (const [key, anchor] of Object.entries(saved.anchors ?? {})) {
        if (key in HAT_WEARER_ANCHORS) Object.assign(HAT_WEARER_ANCHORS[key], anchor);
    }
    for (const [id, adjustment] of Object.entries(saved.adjustments ?? {})) {
        if (HATS_BY_ID.has(id)) Object.assign(getHatAdjustment(id), adjustment);
    }
}

/**
 * Produces the full contents of hat-adjustments.js using the current values.
 * @returns {string}
 */
export function serializeHatAdjustmentsFile() {

    const round = (value) => Math.round(value * 1000) / 1000;
    const format = (obj) => `{ ${Object.entries(obj).map(([k, v]) => `${k}: ${round(v)}`).join(', ')} }`;

    const anchorLines = Object.values(HatWearer)
        .map(wearer => `    ${wearer.key}: ${format(HAT_WEARER_ANCHORS[wearer.key])},`);

    const adjustmentLines = HATS
        .map(hat => {
            const { x, y, scale, angle } = getHatAdjustment(hat.id);
            return `    ${hat.id}: ${format({ x, y, scale, angle })},`;
        });

    return `// This file is generated by the hat tuning view (Settings > Debug > Hat Tuning, localhost only).
// Tune the values there and use "Copy adjustments file" to replace this file, rather than
// editing it by hand.

/**
 * Where hats sit on each kind of wearer, in the wearer's local world units.
 * \`x\`/\`y\` is the point the center of an unadjusted hat is placed at, \`size\` is the
 * width/height of an unadjusted hat.
 * @type {Object.<string, import('./hats.js').HatWearerAnchor>}
 */
export const HAT_WEARER_ANCHORS = {
${anchorLines.join('\n')}
};

/**
 * Per-hat placement tweaks relative to the wearer's anchor. \`x\`/\`y\` are in units of the
 * anchor size (positive \`x\` is towards the direction the wearer faces), \`scale\` multiplies
 * the anchor size, and \`angle\` is in degrees (positive tilts the hat forward).
 * @type {Object.<string, import('./hats.js').HatAdjustment>}
 */
export const HAT_ADJUSTMENTS = {
${adjustmentLines.join('\n')}
};
`;
}

if (GAME_SETTINGS.IS_LOCAL_DEV_ENVIRONMENT) {
    try {
        loadDevHatTuning();
    } catch (error) {
        console.warn(`Failed to load dev hat tuning: ${error}`);
    }
}
