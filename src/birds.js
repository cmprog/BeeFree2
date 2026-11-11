import { logDebug } from "./logging.js";
import { EntityType, ProgressBar } from './entities.js';
import { MovementBehavior, StaticMovement } from "./movement.js";
import { PassiveShooting, ShootingBehavior } from "./shooting.js";
import { spriteAtlas } from "./sprites.js";
import { Honeycomb } from "./honeycomb.js";
import { currentLevel } from "./levels.js";
import { DEFAULT_BIRD_ATTRIBUTES, SAMMY_PARTY_BIRD_HAT_CHANCE } from "./settings.js";
import { attachHat, computeHealthBarOffset } from "./hat-attachment.js";
import { HatWearer, pickRandomHat } from "./hats.js";
import { isWellOutsideWorldBoundary } from "./util.js";
import { AttributeSet } from "./attributes.js";
import { currentPlayer } from "./player.js";

/**
 * @callback ShootingBehaviorFactory
 * @param {AttributeSet} attributeSet
 * @returns {ShootingBehavior}
 */

/**
 * @callback MovementBehaviorFactory
 * @param {AttributeSet} attributeSet
 * @returns {MovementBehavior}
 */

export class BirdTemplate {
    constructor(name, description) {

        this.name = name;
        this.description = description;

        this.attributes = DEFAULT_BIRD_ATTRIBUTES.copy();

        /**
         * A numeric value representing the phase during which
         * this bird type is allowed to spawn during a time trial.
         * This allows tuning for progressive difficulty in the time trial.
         * @type {number}
         */
        this.timeTrialPhase = 0;

        /**
         * Creates an instance of the shooting behavior associated with the bird.
         * @type {ShootingBehaviorFactory} attributes 
         */
        this.createShootingBehavior = (attr) => {
            return new PassiveShooting();
        };

        /**
         * Creates an instance of the movement behavior associated with the bird.
         * @type {MovementBehaviorFactory} attributes 
         */
        this.createMovementBehavior = (attr) => {
            return new StaticMovement();
        };

        this.bodyColor = WHITE;
        this.headColor = WHITE;

        // Defines the valid spawn regions for the bird.        
        this.spawnRegions = [];
    }
    
    withSpawnRegion(region) {
        this.spawnRegions.push(region);
        return this;
    }

    /**
     * @param {ShootingBehaviorFactory} factory 
     * @returns {BirdTemplate}
     */
    withShooting(factory) {
        this.createShootingBehavior = factory;
        return this;
    }

    /**
     * @param {MovementBehaviorFactory} factory
     * @returns {BirdTemplate}
     */
    withMovement(factory) {
        this.createMovementBehavior = factory;
        return this;
    }

    /**
     * Sets the time trial phase for the bird.
     * @param {number} value 
     * @returns {BirdTemplate}
     */
    withTimeTrialPhase(value) {
        this.timeTrialPhase = value;
        return this;
    }

    withColors(bodyColor, headColor) {
        this.bodyColor = bodyColor;
        this.headColor = headColor;
        return this;
    }

    withDamage(value) {
        this.attributes.damage = value;
        return this;
    }

    withCritical(chance, multiplier) {
        this.attributes.critChance = chance;
        this.attributes.critMultiplier = multiplier;
        return this;
    }

    /**
     * @callback ConfigureAttributesCallback
     * @param {AttributeSet} attributeSet
     */

    /**
     * Used to generally configure any of the attributes of the bird.
     * @param {ConfigureAttributesCallback} callback 
     * @return {BirdTemplate}
     */
    configureAttributes(callback) {
        callback(this.attributes);
        return this;
    }

    create(pos) {
        const bird = new Bird(pos, this);
        return bird;
    }
}

// Where the health bar sits above the bird, unless a hat pushes it higher.
const HEALTH_BAR_OFFSET_Y = 1;

const BASE_BIRD_SIZE = 1.5

function normalizeBirdPartSize(sourceSprite) {
    const targetHeight = BASE_BIRD_SIZE * (sourceSprite.size.y / spriteAtlas.bird.body.size.y);    
    const sourceAspectRatio = sourceSprite.size.x / sourceSprite.size.y;
    const targetWidth = sourceAspectRatio * targetHeight;
    const targetSize = vec2(targetWidth, targetHeight);
    return targetSize;
}

class BirdPart extends EngineObject {
    constructor(pos, bird, localPos, tileInfo) {
        super(pos, normalizeBirdPartSize(tileInfo), tileInfo);
        bird.addChild(this, localPos.scale(BASE_BIRD_SIZE))
    }
}

class BirdFace extends BirdPart {
    constructor(pos, bird) {
        super(pos, bird, vec2(-0.90, 0), spriteAtlas.bird.face);   
        this.renderOrder = 30;     
    }
}

class BirdHead extends BirdPart {
    constructor(pos, bird, color) {
        super(pos, bird, vec2(-0.6, 0.0), spriteAtlas.bird.head);   
        this.renderOrder = 20;    
        this.color = color;
    }
}

class BirdBody extends BirdPart {
    constructor(pos, bird, color) {
        super(pos, bird, vec2(0, 0), spriteAtlas.bird.body);   
        this.renderOrder = 10;
        this.color = color;
    }
}

class BirdEyelids extends BirdPart {
    constructor(pos, bird) {
        super(pos, bird, vec2(-0.85, 0.15), spriteAtlas.bird.eyelids);  
        this.renderOrder = 40;    
    }
}

class BirdLegs extends BirdPart {
    constructor(pos, bird) {
        super(pos, bird, vec2(-0.1, -0.60), spriteAtlas.bird.legs); 
        this.renderOrder = 0;     
    }
}

export class Bird extends EngineObject
{
    /**
     * 
     * @param {Vector2} pos 
     * @param {BirdTemplate} template 
     */
    constructor(pos, template)
    {
        super(pos, vec2(2, 2));
        
        this.entityType = EntityType.BIRD;

        this.setCollision();

        this.healthBar = new ProgressBar();
        this.addChild(this.healthBar, vec2(0, HEALTH_BAR_OFFSET_Y));

        this.face = new BirdFace(pos, this);
        this.eyelids = new BirdEyelids(pos, this);
        this.legs = new BirdLegs(pos, this);
        this.body = new BirdBody(pos, this, template.bodyColor);
        this.head = new BirdHead(pos, this, template.headColor);

        this.name = template.name;

        this.attributes = template.attributes.copy();

        this.health = this.attributes.maxHealth;        

        this.shooting = template.createShootingBehavior(this.attributes);
        this.movement = template.createMovementBehavior(this.attributes);

        // Birds which show up to a Sammy party sometimes dress up for it.
        if (currentLevel && currentLevel.isSammyPartyTime() && (rand() < SAMMY_PARTY_BIRD_HAT_CHANCE)) {
            this.wearHat(pickRandomHat().id);
        }
    }

    /**
     * Puts a hat on the bird, replacing any current hat.
     * @param {string} hatId
     */
    wearHat(hatId) {
        if (this.hat) {
            this.hat.setHat(hatId);
        } else {
            // Just above the eyelids, the top-most bird part.
            this.hat = attachHat(this, HatWearer.BIRD, hatId, 50);
        }
    }
    
    update() {
        
        this.healthBar.value = this.health / this.attributes.maxHealth;
        this.healthBar.shouldRender = (this.health < this.attributes.maxHealth);
        this.healthBar.localPos = computeHealthBarOffset(this.hat, HEALTH_BAR_OFFSET_Y);

        if (currentLevel && currentLevel.isSammyPartyTime()) {
            this.angle = (-PI / 4) + oscillate(1, PI / 2, time - this.spawnTime);
            for (const child of this.children) {
                child.drawSize = child.size.scale(0.8 + oscillate(1, 0.4, time - this.spawnTime));
            }
            
        } else {
            this.angle = 0;
            for (const child of this.children) {
                child.drawSize = undefined;
            }
        }

        // Birds always try shooting, the shooting behavior will
        // rate limit based on the fire rate of the bird.
        this.shooting.fire(this);
        this.movement.update(this);

        if (isWellOutsideWorldBoundary(this)) {            
            this.destroy();
        }

        super.update();
    }

    render() {
        // Disables the default rendering
    }

    applyDamage(amount) {

        const actualAmount = Math.min(this.health, amount);
        this.health = Math.max(0, this.health - actualAmount);
        
        if (currentPlayer) {
            currentPlayer.onHit(actualAmount);
        }

        // Due to multi-shot, it is pretty common for two bullets
        // on the same frame to hit the bird, so we need to check to ensure
        // the bird hasn't already been destroed this frame.
        
        if (!this.health && !this.destroyed) {

            this.destroy();

            if (currentLevel) {

                const honeycomb = currentLevel.trackObj(new Honeycomb(this.pos, 1));

                // Give it some velocity in the same direction of the bird - but not nearly as fast
                honeycomb.velocity = this.velocity.normalize(rand(0, this.velocity.length() * 0.7));

                currentLevel.onBirdKilled();
            }

            if (currentPlayer) {
                currentPlayer.onBirdKilled();

                if (currentPlayer.birdsExplodeOnKill) {
                    const hue = rand();
                    const particleEmitter = new ParticleEmitter(
                        this.pos, 0,                // emitPos, emitAngle
                        0, 0.1, 500, PI,            // emitSize, emitTime, emitRate, emitCone
                        tile(0, 16),                // tileIndex, tileSize
                        hsl(hue,1,.5),   hsl(hue,1,1),   // colorStartA, colorStartB
                        hsl(hue,1,.5,0), hsl(hue,1,1,0), // colorEndA, colorEndB
                        2, .2, .2, .2, .05,         // time, sizeStart, sizeEnd, speed, angleSpeed
                        .99, 1, 1, PI,              // damping, angleDamping, gravityScale, cone
                        .05, .8, true, false        // fadeRate, randomness, collide, additive
                    );
                    particleEmitter.restitution = .5; // bounce when it collides
                    particleEmitter.trailScale = 2;  // stretch in direction of motion
                }
            }
        }
    }

    getDamage() {        
        let damage = this.attributes.damage;
        if (rand(0, 1) < this.attributes.critChance) {
            damage = damage * this.attributes.critMultiplier;
        }
        return damage;
    }

    collideWithObject(o) {

        if (o.entityType == EntityType.BEE) {            
            o.applyDamage(this.attributes.touchDamage);
            this.destroy();
        }

        return false;
    }
}