import { logDebug } from "./logging.js";
import { EntityType, ProgressBar } from './entities.js';
import { BeeAttractiveMovementBehavior, FixedVelocityMovement, StaticMovement, WaveyMovement } from "./movement.js";
import { MultiBulletShooting, PassiveShooting, SingleBulletShooting } from "./shooting.js";
import { spriteAtlas } from "./sprites.js";
import { Honeycomb } from "./honeycomb.js";
import { currentLevel } from "./levels.js";
import { DEFAULT_BIRD_ATTRIBUTES } from "./settings.js";
import { BirdBulletFactory } from "./bullet.js";
import { rgb255 } from "./util.js";

export class BirdTemplate {
    constructor(name, description, health, touchDamange) {
        this.name = name;
        this.description = description;
        this.health = health;
        this.touchDamange = touchDamange;
        this.shooting = new PassiveShooting();
        this.movement = new FixedVelocityMovement(-0.5);
        this.bodyColor = WHITE;
        this.headColor = WHITE;
        this.damage = DEFAULT_BIRD_ATTRIBUTES.DAMAGE;
        this.critChance = DEFAULT_BIRD_ATTRIBUTES.CRIT_CHANCE;
        this.critMultiplier = DEFAULT_BIRD_ATTRIBUTES.CRIT_MULTIPLIER;

        // These values are used to help control dynamic spawning during
        // endless / time trial random spawning.        
        this.minSpawnX = undefined;
        this.minSpawnY = undefined;
        this.maxSpawnX = undefined;
        this.maxSpawnY = undefined;
    }

    withSpawnBounds(minX, minY, maxX, maxY) {
        this.minSpawnX = minX;
        this.minSpawnY = minY;
        this.maxSpawnX = maxX;
        this.maxSpawnY = maxY;
    }

    withShooting(shootingBehavior) {
        this.shooting = shootingBehavior;
        return this;
    }

    withMovement(movementBehavior) {
        this.movement = movementBehavior;
        return this;
    }

    withColors(bodyColor, headColor) {
        this.bodyColor = bodyColor;
        this.headColor = headColor;
        return this;
    }

    withDamange(value) {
        this.damage = value;
        return this;
    }

    withCritical(chance, multipler) {
        this.critChance = chance;
        this.multipler = multipler;
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

        test: new BirdTemplate('Test', 'A test bird. Does not do anything.', 1, 1)
            .withMovement(new StaticMovement())
            .withShooting(new PassiveShooting())
            .withColors(RED, RED),

        /** A simple bird, simple movement and no shooting. */
        fred: new BirdTemplate('Fred', 'A simple bird, simple movement and no shooting.', 1, 1)
            .withMovement(new FixedVelocityMovement(vec2(-1, 0).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new PassiveShooting())
            .withColors(RED, RED),

        /** The most basic aggressive bird. Simple movement and shots forward. */
        bill: new BirdTemplate('Bill', 'The most basic aggressive bird. Simple movement and shots forward.', 2, 2)
            .withMovement(new FixedVelocityMovement(vec2(-1, 0).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory(),
                direction: vec2(-1, 0),
                rate: 1,
            }))
            .withColors(BLUE, BLUE),

        /** Twin to Thing 2 - this bird moves up and to the left while shooting. */
        thing1: new BirdTemplate('Thing 1', 'Twin to Thing 2 - this bird moves up and to the left while shooting.', 3, 4)
            .withMovement(new FixedVelocityMovement(vec2(-1, 1).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory(),
                direction: vec2(-1, 0),
                rate: 1,
            }))
            .withColors(BLUE, RED),

        /** The twin to Thing 1 - this bird moves down and to the left while shooting. */
        thing2: new BirdTemplate('Thing 2', 'The twin to Thing 1 - this bird moves down and to the left while shooting.', 3, 4)
            .withMovement(new FixedVelocityMovement(vec2(-1, -1).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory({
                    damage: 4,
                }),
                direction: vec2(-1, 0),
                rate: (1.0 / 0.9),
            }))            
            .withColors(BLUE, RED),

        thing3: new BirdTemplate('Thing 3', 'The twin to Thing 4, this bird moves up and to the right while shooting.', 3, 4)
            .withMovement(new FixedVelocityMovement(vec2(1, 1).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory({
                    damage: 4,
                }),
                direction: vec2(-1, 0),
                rate: (1.0 / 0.9),
            }))            
            .withColors(BLUE, RED),

        thing4: new BirdTemplate('Thing 4', 'The twin to Thing 3, this bird moves down and to the right while shooting.', 3, 4)
            .withMovement(new FixedVelocityMovement(vec2(1, -1).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory({
                    damage: 4,
                }),
                direction: vec2(-1, 0),
                rate: (1.0 / 0.9),
            }))            
            .withColors(BLUE, RED),

        greg: new BirdTemplate('Greg', 'Greg is a simple bird who is a little drunk.', 3, 6)
            .withMovement(new WaveyMovement(vec2(-1, 0).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED), vec2(1, 1), 1))
            .withShooting(new PassiveShooting())          
            .withColors(GREEN, GREEN),

        frank: new BirdTemplate('Frank', 'Frank is Greg\'s friend but he flings poo.', 4, 7)
            .withMovement(new WaveyMovement(vec2(-1, 0).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED), vec2(1, 1), 1))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory(),
                direction: vec2(-1, 0),
                rate: (1.0 / 0.8),
            }))
            .withDamange(6)
            .withColors(YELLOW, YELLOW),

        kathy: new BirdTemplate('Kathy', 'Kathy is a little etreme when it comes to stalking bee\'s.', 6, 8)
            .withMovement(new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED), 6, DEFAULT_BIRD_ATTRIBUTES.SPEED * 1.5))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory(),
                direction: vec2(-1, 0),
                rate: (1.0 / 1.0),
            }))
            .withDamange(8)
            .withColors(GRAY, BLACK),

        whitney_left: new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!', 7, 13)            
            .withMovement(new FixedVelocityMovement(vec2(-1, 0).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory({
                    movement: new BeeAttractiveMovementBehavior(vec2(-1, 0), 5, DEFAULT_BIRD_ATTRIBUTES.BULLET_SPEED * 1.5)
                }),
                direction: vec2(-1, 0),
                rate: (1.0 / 1.2),
            }))
            .withDamange(7)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152)),

        whitney_left_up: new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!', 7, 13)            
            .withMovement(new FixedVelocityMovement(vec2(-1, 2).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory({
                    movement: new BeeAttractiveMovementBehavior(vec2(-1, 0), 5, DEFAULT_BIRD_ATTRIBUTES.BULLET_SPEED * 1.5)
                }),
                direction: vec2(-1, 0),
                rate: (1.0 / 1.2),
            }))
            .withDamange(7)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152)),

        whitney_down_up: new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!', 7, 13)            
            .withMovement(new FixedVelocityMovement(vec2(-1, -2).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new SingleBulletShooting({
                bulletFactory: new BirdBulletFactory({
                    movement: new BeeAttractiveMovementBehavior(vec2(-1, 0), 5, DEFAULT_BIRD_ATTRIBUTES.BULLET_SPEED * 1.5)
                }),
                direction: vec2(-1, 0),
                rate: (1.0 / 1.2),
            }))
            .withDamange(7)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152)),

        whitney_down_up: new BirdTemplate('Tom', 'A more resiliant basic passive bird.', 25, 15)            
            .withMovement(new FixedVelocityMovement(vec2(-1, -2).normalize(DEFAULT_BIRD_ATTRIBUTES.SPEED)))
            .withShooting(new PassiveShooting())
            .withDamange(7)
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
    constructor(pos, template)
    {
        super(pos, vec2(1, 1));

        this.entityType = EntityType.BIRD;

        this.setCollision();

        this.healthBar = new ProgressBar();
        this.addChild(this.healthBar, vec2(0, 1));

        this.face = new BirdFace(pos, this);
        this.eyelids = new BirdEyelids(pos, this);
        this.legs = new BirdLegs(pos, this);
        this.body = new BirdBody(pos, this, template.bodyColor);
        this.head = new BirdHead(pos, this, template.headColor);
        
        this.maxHealth = template.health;
        this.health = this.maxHealth;        

        this.damage = template.critChance;
        this.critChance = template.critChance;
        this.critMultiplier = template.critMultiplier;
        this.touchDamange = template.touchDamange;
        this.shooting = template.shooting.copy();
        this.movement = template.movement.copy(); 
    }
    
    update() {
        
        this.healthBar.value = this.health / this.maxHealth;
        this.healthBar.shouldRender = (this.health < this.maxHealth);

        // Birds always try shooting, the shooting behavior will
        // rate limit based on the fire rate of the bird.
        this.shooting.fire(this);
        this.movement.update(this);

        super.update();
    }

    render() {
        // Disables the default rendering
    }

    applyDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (!this.health) {
            this.destroy();

            const honeycomb = new Honeycomb(this.pos, 1);
            // Give it some velocity in the same direction of the bird - but not nearly as fast
            honeycomb.velocity = this.velocity.normalize(rand(0, this.velocity.length() * 0.7));

            if (currentLevel) {
                currentLevel.trackObj(honeycomb);
                currentLevel.onBirdKilled();
            }
        }
    }

    getDamage() {        
        let damage = this.damange;
        if (rand(0, 1) >= this.critChance) {
            damage = damage * this.critMultiplier;
        }
    }

    collideWithObject(o) {

        if (o.entityType == EntityType.BEE) {            
            o.applyDamage(this.touchDamange);
            this.destroy();
        }

        return false;
    }
}