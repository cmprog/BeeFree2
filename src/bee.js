import { EntityType, ProgressBar } from './entities.js';
import { MultiBulletShooting, SingleBulletShooting } from "./shooting.js";
import { spriteAtlas } from "./sprites.js";
import { currentLevel } from "./levels.js";
import { BeeBulletFactory } from './bullet.js';
import { logDebug } from './logging.js';
import { AttributeSet } from './attributes.js';

export class Bee extends EngineObject {

    /**
     * 
     * @param {AttributeSet} attributes 
     */
    constructor(attributes) {

        super(vec2(0, 0), vec2(2, 2)); 
        this.entityType = EntityType.BEE;

        this.healthBar = new ProgressBar();
        this.addChild(this.healthBar, vec2(0, 1));

        this.renderOrder = 400;

        this.setCollision();

        // Copy the set of attributes so we can 'own' them
        this.attributes = attributes.copy();

        this.health = attributes.maxHealth;

        if (attributes.shotCount > 1) {
            this.shooting = new MultiBulletShooting({                
                bulletFactory: new BeeBulletFactory(this.attributes),
                count: attributes.shotCount,
                spread: Math.PI / 6,
                direction: vec2(1, 0),
                rate: 1.0 / attributes.fireRate,
            });
        } else {
            this.shooting = new SingleBulletShooting({
                bulletFactory: new BeeBulletFactory(this.attributes),
                direction: vec2(1, 0),
                rate: 1.0 / attributes.fireRate,
            });
        }
        
        this.healthRegenTimer = new Timer(1);
    } 
    
    update() {
        super.update();

        if (this.healthRegenTimer.elapsed()) {
            this.health = min(this.attributes.maxHealth, this.health + this.attributes.healthRegen);
            this.healthRegenTimer.set(1);
        }

        this.healthBar.value = this.health / this.attributes.maxHealth;
        
        let direction;
        let holdingFire = false;

        if (isUsingGamepad) {

            direction = gamepadStick(0);            
            holdingFire = gamepadIsDown(0) || gamepadIsDown(0);
            
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
            this.shooting.fire(this);
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

        if ((amount > 0) && currentLevel) {
            currentLevel.onBeeDamageTaken();
        }

        const targetHealth = Math.max(0, this.health - amount);

        logDebug(`Bee taking ${amount} damange (${this.health.toFixed(1)} -> ${targetHealth.toFixed(1)})`);

        this.health = targetHealth;

        if (!this.health) {            
            this.destroy();

            if (currentLevel) {
                currentLevel.onBeeDestroyed();
            }
        }
    }

    getDamage() {
        
        let damage = this.attributes.damage;
        if (rand(0, 1) >= this.attributes.critChance) {
            damage = damage * this.attributes.critMultiplier;
        }

        return damage;
    }

    collideWithObject(o) {

        if (o.entityType == EntityType.HONEYCOMB) {
            currentLevel.onHoneycombCollected(o.value);
            o.destroy();            
        }

        return false;
    }
}