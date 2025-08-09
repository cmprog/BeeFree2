import { logDebug } from "./logging.js";
import { EntityType } from './entities.js';
import { FixedVelocityMovement, StaticMovement } from "./movement.js";
import { PassiveShooting, SingleBulletShooting } from "./shooting.js";
import { spriteAtlas } from "./sprites.js";

class BirdTemplate {
    constructor(name, description, health, touchDamange) {
        this.name = name;
        this.description = description;
        this.health = health;
        this.touchDamange = touchDamange;
        this.shooting = new PassiveShooting();
        this.movement = new FixedVelocityMovement(-0.5);
        this.bodyColor = WHITE;
        this.headColor = WHITE;
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

    create(pos) {
        const bird = new Bird(pos, this);
        return bird;
    }
}

export const BIRD_TEMPLATES = {

    test: new BirdTemplate('Test', 'A test bird. Does not do anything.', 1, 1)
        .withMovement(new StaticMovement())
        .withShooting(new PassiveShooting())
        .withColors(RED, RED),

    fred: new BirdTemplate('Fred', 'A simple bird, simple movement and no shooting.', 1, 1)
        .withMovement(new FixedVelocityMovement(vec2(-0.25, 0)))
        .withShooting(new PassiveShooting())
        .withColors(RED, RED),

    bill: new BirdTemplate('Bill', '', 2, 2)
        .withMovement(new FixedVelocityMovement(vec2(-0.25, 0)))
        .withShooting(new SingleBulletShooting())
        .withColors(BLUE, BLUE),
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

        this.face = new BirdFace(pos, this);
        this.eyelids = new BirdEyelids(pos, this);
        this.legs = new BirdLegs(pos, this);
        this.body = new BirdBody(pos, this, template.bodyColor);
        this.head = new BirdHead(pos, this, template.headColor);
        
        this.maxHealth = template.health;
        this.health = this.maxHealth;        

        this.touchDamange = template.touchDamange;
        this.shooting = template.shooting;
        this.movement = template.movement    
    }
    
    update() {
        this.shooting.update(this);
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