import { AttributeSet, LevelAttributeSet } from "./attributes.js";

class GeneralGameSettings {
    constructor() {

        /**
         * Whether the game is being served from localhost. Enables dev-only behavior such as the
         * on-screen log panel and the Debug settings. False outside a browser (in tests).
         * @type {boolean}
         */
        this.IS_LOCAL_DEV_ENVIRONMENT = globalThis.location?.href.includes('localhost') ?? false;
        
        /**
         * Whether the bee ignores all damage. A dev-only testing aid, toggled with
         * Settings > Debug > Bee Damage on localhost. Not saved; resets on reload.
         * @type {boolean}
         */
        this.BEE_DAMAGE_DISABLED = false;
    }
}

export const GAME_SETTINGS = new GeneralGameSettings();

export const STANDARD_LEVEL_FAILURE_EARN_RATE = 0.5;
export const BASE_SAMMY_CHANCE = 5000;

export const NO_DAMAGE_TOKEN_LEVEL_BONUS = 0.1;
export const NO_SURVIVORS_LEVEL_BONUS = 0.1;
export const PERFECT_LEVEL_BONUS = 0.3;

export const PRESTIGE_BONUS_RATE = 1 / 200;

/**
 * Honeycomb prices for each hat tier in the wardrobe. See HatTier in hats.js.
 */
export const HAT_PRICE_BASIC = 250;
export const HAT_PRICE_FANCY = 1000;
export const HAT_PRICE_FABULOUS = 3000;

/**
 * The chance (0 to 1) that a bird spawned during a Sammy party is wearing a random hat.
 */
export const SAMMY_PARTY_BIRD_HAT_CHANCE = 0.1;

/**
 * The chance (0 to 1) that a Sammy spawned during a Sammy party is wearing a random hat.
 */
export const SAMMY_PARTY_SAMMY_HAT_CHANCE = 0.5;

/**
 * The duration, in seconds, for each phase of the time trial.
 */
export const TIME_TRIAL_PHASE_DURATION = 10;

/**
 * The base value of the exponental decay used to calculate level earnings for standard levels.
 */
export const STANDARD_LEVEL_EARNING_DECAY_BASE = (2 / 3);

/**
 * The base value of the exponential decay used to calculate level earnings for time trial levels.
 */
export const TIME_TRIAL_LEVEL_EARNING_DECAY_BASE = (2 / 3);

export const DEFAULT_BEE_ATTRIBUTES = new AttributeSet();
DEFAULT_BEE_ATTRIBUTES.speed = 0.1;
DEFAULT_BEE_ATTRIBUTES.maxHealth = 5;
DEFAULT_BEE_ATTRIBUTES.healthRegen = 0;
DEFAULT_BEE_ATTRIBUTES.fireRate = 1;
DEFAULT_BEE_ATTRIBUTES.damage = 1;
DEFAULT_BEE_ATTRIBUTES.shotCount = 1;
DEFAULT_BEE_ATTRIBUTES.honeycombAttraction = 0;
DEFAULT_BEE_ATTRIBUTES.honeycombAttractionDistance = 1;
DEFAULT_BEE_ATTRIBUTES.bulletSpeed = 0.3;
DEFAULT_BEE_ATTRIBUTES.critChance = 0;
DEFAULT_BEE_ATTRIBUTES.critMultiplier = 1.1;

export const DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS = new AttributeSet();
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.speed = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.maxHealth = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.healthRegen = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.fireRate = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.damage = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.shotCount = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.honeycombAttraction = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.honeycombAttractionDistance = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.bulletSpeed = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.critChance = 1.1;
DEFAULT_SAMMY_ATTRIBUTE_MULTIPLIERS.critMultiplier = 1.1;

export const DEFAULT_BIRD_ATTRIBUTES = new AttributeSet();
DEFAULT_BIRD_ATTRIBUTES.speed = 0.15;
DEFAULT_BIRD_ATTRIBUTES.maxHealth = 5;
DEFAULT_BIRD_ATTRIBUTES.healthRegen = 0;
DEFAULT_BIRD_ATTRIBUTES.fireRate = 1;
DEFAULT_BIRD_ATTRIBUTES.damage = 1;
DEFAULT_BIRD_ATTRIBUTES.shotCount = 1;
DEFAULT_BIRD_ATTRIBUTES.honeycombAttraction = 0;
DEFAULT_BIRD_ATTRIBUTES.honeycombAttractionDistance = 1;
DEFAULT_BIRD_ATTRIBUTES.bulletSpeed = 0.30;
DEFAULT_BIRD_ATTRIBUTES.critChance = 0;
DEFAULT_BIRD_ATTRIBUTES.critMultiplier = 1.1;

export const DEFAULT_LEVEL_ATTRIBUTES = new LevelAttributeSet();
DEFAULT_LEVEL_ATTRIBUTES.sammyChance = 1;
DEFAULT_LEVEL_ATTRIBUTES.sammyDuration = 3;
DEFAULT_LEVEL_ATTRIBUTES.sammySpeed = 0.1;