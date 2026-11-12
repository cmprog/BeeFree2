import { EntityType, ProgressBar, Score } from './hud.js';
import { MultiBulletShooting, SingleBulletShooting } from "../birds/shooting.js";
import { spriteAtlas } from "../core/sprites.js";
import { currentLevel } from "../levels/levels.js";
import { BeeBulletFactory } from './bullet.js';
import { logDebug } from '../core/logging.js';
import { AttributeSet } from '../player/attributes.js';
import { currentPlayer } from '../player/player.js';
import { GAME_SETTINGS } from '../settings.js';
import { attachHat, computeHealthBarOffset } from '../hats/attachment.js';
import { HatWearer } from '../hats/hats.js';

// Where the health bar sits above the bee, unless a hat pushes it higher.
const HEALTH_BAR_OFFSET_Y = 1;

export class Bee extends EngineObject {

    /**
     * 
     * @param {AttributeSet} attributes 
     */
    constructor(attributes) {

        super(vec2(0, 0), vec2(2, 2)); 
        this.entityType = EntityType.BEE;

        /**
         * @type {ProgressBar}
         */
        this.healthBar = new ProgressBar();      
        this.addChild(this.healthBar, vec2(0, HEALTH_BAR_OFFSET_Y));

        this.renderOrder = 400;

        this.setCollision();
        
        /**
         * The base player attributes. We need to track the base attributes
         * so we can revert the current attributes after sammy party time.
         * @type {AttributeSet}
         */
        this.baseAttributes = attributes.copy();

        /**
         * The current attributes of the bee. These attributes can change
         * during sammy party time.
         * @type {AttributeSet}
         */
        this.attributes = attributes.copy();
        this.isSammyPartyTimeActive = false;

        this.refreshShootingBehavior();

        /**
         * The current health of the bee
         * @type {number}
         */
        this.health = attributes.maxHealth;
        this.previousPos = undefined;
        
        this.healthRegenTimer = new Timer(1);

        /**
         * The hat the player has chosen in the wardrobe, if any.
         */
        this.hat = attachHat(this, HatWearer.BEE, currentPlayer?.equippedHat, this.renderOrder + 10);
    } 

    /**
     * Refreshes the shooting behavior based on the current set of
     * attributes. This must be done whenever the attributes have changed
     * such as entering or existing Sammy party time.
     */
    refreshShootingBehavior() {

        if (this.attributes.shotCount > 1) {
            this.shooting = new MultiBulletShooting({                
                bulletFactory: new BeeBulletFactory(this.attributes),
                count: this.attributes.shotCount,
                spread: Math.PI / 6,
                direction: vec2(1, 0),
                rate: 1.0 / this.attributes.fireRate,
            });
        } else {
            this.shooting = new SingleBulletShooting({
                bulletFactory: new BeeBulletFactory(this.attributes),
                direction: vec2(1, 0),
                rate: 1.0 / this.attributes.fireRate,
            });
        }
    }

    /**
     * Sets up the logic which applies during sammy paarty time.
     */
    onOnSammyPartyTimeStarted() {        

        if (currentPlayer) {

            const previousMaxHealth = this.attributes.maxHealth;
            this.attributes = this.baseAttributes.scale(currentPlayer.sammyAttributeMultipliers);
            // Increase current health by the amount the max health increased
            this.health += this.attributes.maxHealth - previousMaxHealth;

        } else {
            this.attributes = this.baseAttributes.copy();
        }

        // Make sure the health isn't overflowing the max health
        this.health = Math.min(this.health, this.attributes.maxHealth);

        this.refreshShootingBehavior();

        this.isSammyPartyTimeActive = true;
    }

    /**
     * Performs the logic which clears out bonuses from sammy party time.
     */
    onSammyPartyTimeEnded() {

        this.attributes = this.baseAttributes.copy();

        // Make sure the health isn't overflowing the max health
        this.health = Math.min(this.health, this.attributes.maxHealth);

        this.isSammyPartyTimeActive = false;
    }
    
    update() {

        super.update();

        if (currentLevel && currentLevel.isSammyPartyTime()) {
            if (!this.isSammyPartyTimeActive) {
                this.onOnSammyPartyTimeStarted();
            }
        } else {
            if (this.isSammyPartyTimeActive) {
                // No more party time ::sad-face::
                this.onSammyPartyTimeEnded();
            }
        }

        if (this.healthRegenTimer.elapsed()) {
            this.health = min(this.attributes.maxHealth, this.health + this.attributes.healthRegen);
            this.healthRegenTimer.set(1);
        }

        if (this.previousPos && currentPlayer) {
            const distance = this.pos.subtract(this.previousPos).length();
            currentPlayer.onDistanceTraveled(distance);
        }

        this.previousPos = this.pos.copy();

        this.healthBar.value = this.health / this.attributes.maxHealth;
        this.healthBar.localPos = computeHealthBarOffset(this.hat, HEALTH_BAR_OFFSET_Y);
        
        let direction;
        let holdingFire = false;

        // On a touch device the touch gamepad is the only control during a level. Don't fall back
        // to chasing the mouse: the tap that started the level can leave the engine's mouse button
        // stuck down (the level starts on touchend, which turns the gamepad on before the engine
        // sees that touchend), and the bee would fly to where that tap was.
        const useGamepad = isUsingGamepad || (isTouchDevice && touchGamepadEnable);

        if (useGamepad) {

            direction = gamepadStick(0);            
            holdingFire = gamepadIsDown(0);
            
        } else {
            
            // Chase the mouse cursor, put some threshold around the length to prevent
            // twitchiness around this object's center
            direction = mousePos.subtract(this.pos)
            if (direction.length() < this.size.scale(0.4).length()) {
                direction = vec2(0);
            }

            holdingFire = keyIsDown('KeySpace') || mouseIsDown(0) || gamepadIsDown(0);
        }

        if (direction.length()) {
            this.velocity = direction.normalize(this.attributes.speed);
        } else {
            this.velocity = vec2(0);
        }      

        if (holdingFire) {
            const bulletsFired = this.shooting.fire(this);

            if (bulletsFired && currentPlayer) {
                currentPlayer.onShotFired(bulletsFired);
            }
        }

        // Bottom right position tells us the pos x half-width and neg y half-height of the world size
        const worldBottomRight = screenToWorld(mainCanvasSize);
        this.pos.x = clamp(this.pos.x, -worldBottomRight.x, worldBottomRight.x);
        this.pos.y = clamp(this.pos.y, worldBottomRight.y, -worldBottomRight.y);
    }

    render() {        
        const frame = (time * 4) % 4 | 0;
        this.tileInfo = spriteAtlas.bee.frame(frame)
        super.render();
    }

    applyDamage(amount) {

        if (GAME_SETTINGS.BEE_DAMAGE_DISABLED) {
            return;
        }

        if ((amount > 0) && currentLevel) {
            currentLevel.onBeeDamageTaken();
        }

        const actualAmount = Math.min(this.health, amount);
        const targetHealth = Math.max(0, this.health - actualAmount);

        if (currentPlayer) {
            currentPlayer.onDamageTaken(actualAmount);
        }

        logDebug(`Bee taking ${amount} damage (${this.health.toFixed(1)} -> ${targetHealth.toFixed(1)})`);

        this.health = targetHealth;

        if (!this.health) {            
            this.destroy();

            if (currentLevel) {
                currentLevel.onBeeDeath();
            }

            if (currentPlayer) {
                currentPlayer.onBeeDeath();
            }
        }
    }

    getDamage() {
        
        let damage = this.attributes.damage;
        if (rand(0, 1) < this.attributes.critChance) {
            damage = damage * this.attributes.critMultiplier;

            if (currentPlayer) {
                currentPlayer.onCriticalHit();
            }

        }

        return damage;
    }

    /**
     * @param {EngineObject & { entityType?: object }} o
     * @returns {boolean}
     */
    collideWithObject(o) {

        if (o.entityType == EntityType.HONEYCOMB) {

            const honeycomb = /** @type {import('./honeycomb.js').Honeycomb} */ (o);
            if (currentLevel) {
                currentLevel.onHoneycombCollected(honeycomb.value);
                currentLevel.trackObj(new Score(honeycomb.pos, honeycomb.value));
            }

            // Don't signal to the player. Honeycomb isn't truely
            // collected until the end of the level.

            o.destroy();            



        } else if (o.entityType == EntityType.SAMMY) {

            if (currentLevel) {
                currentLevel.onSammyCollected();
            }

            if (currentPlayer) {
                currentPlayer.onSammyCollected();
            }

            o.destroy();
        }

        return false;
    }
}