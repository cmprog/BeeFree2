import { logDebug } from "./logging.js";
import { EntityType, ProgressBar } from './entities.js';
import { BeeAttractiveMovementBehavior, FixedVelocityMovement, MovementBehavior, StaticMovement, WaveyMovement } from "./movement.js";
import { PassiveShooting, ShootingBehavior, SingleBulletShooting } from "./shooting.js";
import { spriteAtlas } from "./sprites.js";
import { Honeycomb } from "./honeycomb.js";
import { currentLevel } from "./levels.js";
import { DEFAULT_BIRD_ATTRIBUTES } from "./settings.js";
import { BirdBulletFactory } from "./bullet.js";
import { isWellOutsideWorldBoundary, rgb255 } from "./util.js";
import { SPAWN_REGIONS } from "./spawning.js";
import { AttributeSet } from "./attributes.js";
import { currentPlayer } from "./player.js";

/**
 * @callback ShootingBehaviorFactory
 * @param {AttributeSet}
 * @returns {ShootingBehavior}
 */

/**
 * @callback MovementBehaviorFactory
 * @param {AttributeSet}
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

    withCritical(chance, multipler) {
        this.attributes.critChance = chance;
        this.attributes.multipler = multipler;
        return this;
    }

    /**
     * @callback ConfigureAttributesCallback
     * @param {AttributeSet}
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

export let BIRD_TEMPLATES;

export function initBirdTemplates() {
    
    BIRD_TEMPLATES = {

        /** A simple bird, simple movement and no shooting. */
        fred: new BirdTemplate('Fred', 'A simple bird, simple movement and no shooting.', 1, 1)
            .configureAttributes(attr => {
                attr.maxHealth = 1;
                attr.touchDamage = 1;
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(RED, RED),

        /** The most basic aggressive bird. Simple movement and shots forward. */
        bill: new BirdTemplate('Bill', 'The most basic aggressive bird. Simple movement and shots forward.')
            .configureAttributes(attr => {
                attr.maxHealth = 2;
                attr.touchDamage = 2;
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            })            
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(BLUE, BLUE),

        /** Twin to Thing 2 - this bird moves up and to the left while shooting. */
        thing1: new BirdTemplate('Thing 1', 'Twin to Thing 2 - this bird moves up and to the left while shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 4;
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 1).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            })
            .withTimeTrialPhase(1)     
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withSpawnRegion(SPAWN_REGIONS.BOTTOM_RIGHT)
            .withColors(BLUE, RED),

        /** The twin to Thing 1 - this bird moves down and to the left while shooting. */
        thing2: new BirdTemplate('Thing 2', 'The twin to Thing 1 - this bird moves down and to the left while shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 4;
                attr.damage = 4;
                attr.fireRate = (1.0 / 0.9);
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, -1).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            })     
            .withTimeTrialPhase(1)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.TOP_RIGHT)           
            .withColors(BLUE, RED),

        thing3: new BirdTemplate('Thing 3', 'The twin to Thing 4, this bird moves up and to the right while shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 4;
                attr.damage = 4;
                attr.fireRate = (1.0 / 0.9);
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(1, 1).normalize(attr.speed));
            })
            .withTimeTrialPhase(1)
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            })         
            .withSpawnRegion(SPAWN_REGIONS.BOTTOM_LEFT)
            .withSpawnRegion(SPAWN_REGIONS.LEFT_LOWER)      
            .withColors(BLUE, RED),

        thing4: new BirdTemplate('Thing 4', 'The twin to Thing 3, this bird moves down and to the right while shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 4;
                attr.damage = 4;
                attr.fireRate = (1.0 / 0.9);
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(1, -1).normalize(attr.speed));
            })
            .withTimeTrialPhase(1)
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .configureAttributes(attr => {
                attr.damage = 4;
                attr.fireRate = 1.0 / 0.9;
            })
            .withSpawnRegion(SPAWN_REGIONS.TOP_LEFT)
            .withSpawnRegion(SPAWN_REGIONS.LEFT_UPPER)          
            .withColors(BLUE, RED),

        greg: new BirdTemplate('Greg', 'Greg is a simple bird who is a little drunk.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 6;
            })
            .withMovement(attr => {
                return new WaveyMovement(vec2(-1, 0).normalize(attr.speed), vec2(1, 1), 1);
            })            
            .withTimeTrialPhase(2)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)        
            .withColors(GREEN, GREEN),

        frank: new BirdTemplate('Frank', 'Frank is Greg\'s friend but he flings poo.')
            .configureAttributes(attr => {
                attr.maxHealth = 4;
                attr.touchDamage = 7;
                attr.damage = 6;
                attr.fireRate = (1.0 / 0.8);
            })
            .withMovement(attr => {
                return new WaveyMovement(vec2(-1, 0).normalize(attr.speed), vec2(1, 1), 1);
            })
            .withTimeTrialPhase(3)
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(YELLOW, YELLOW),

        kathy: new BirdTemplate('Kathy', 'Kathy is a little extreme when it comes to stalking bee\'s.')
            .configureAttributes(attr => {
                attr.maxHealth = 6;
                attr.touchDamage = 8;
                attr.damage = 8;
            })
            .withMovement(attr => {
                return new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(attr.speed), 10, DEFAULT_BIRD_ATTRIBUTES.speed * 1.25);
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withTimeTrialPhase(4)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(GRAY, BLACK),

        whitney_left: new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!')  
            .configureAttributes(attr => {
                attr.maxHealth = 7;
                attr.touchDamage = 13;
                attr.damage = 7;
                attr.fireRate = (1.0 / 1.2);
            })          
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory({                        
                        movement: new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(attr.bulletSpeed), 5, attr.bulletSpeed * 1.5)
                    }),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withTimeTrialPhase(5)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152)),

        whitney_left_up: new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!')    
            .configureAttributes(attr => {
                attr.maxHealth = 7;
                attr.touchDamage = 13;
                attr.damage = 7;
                attr.fireRate = (1.0 / 1.2);
            })                  
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 2).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory({                        
                        movement: new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(attr.bulletSpeed), 5, attr.bulletSpeed * 1.5)
                    }),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withTimeTrialPhase(5)
            .withSpawnRegion(SPAWN_REGIONS.BOTTOM_RIGHT)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152)),

        whitney_down_up: new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!')   
            .configureAttributes(attr => {
                attr.maxHealth = 7;
                attr.touchDamage = 13;
                attr.damage = 7;
                attr.fireRate = (1.0 / 1.2);
            })                   
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, -2).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory({                        
                        movement: new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(attr.bulletSpeed), 5, attr.bulletSpeed * 1.5)
                    }),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withTimeTrialPhase(5)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.TOP_RIGHT)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152)),

        tom: new BirdTemplate('Tom', 'A more resiliant basic passive bird.')         
            .configureAttributes(attr => {
                attr.maxHealth = 25;
                attr.touchDamage = 15;
                attr.damage = 7;
            })             
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withTimeTrialPhase(6)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            // Darker red than fred
            .withColors(rgb255(139, 26, 26), rgb255(238, 44, 44)),
    }
}

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
        this.addChild(this.healthBar, vec2(0, 1));

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
    }
    
    update() {
        
        this.healthBar.value = this.health / this.attributes.maxHealth;
        this.healthBar.shouldRender = (this.health < this.attributes.maxHealth);

        if (currentLevel && currentLevel.isSammyPartyTime()) {
            this.angle = (-PI / 4) + wave(1, PI / 2, time - this.spawnTime);
            for (const child of this.children) {
                child.drawSize = child.size.scale(0.8 + wave(1, 0.4, time - this.spawnTime));
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

        if (o.entityType == EntityType.BEE) {            
            o.applyDamage(this.attributes.touchDamage);
            this.destroy();
        }

        return false;
    }
}