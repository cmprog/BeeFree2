import { AttributeSet } from './attributes.js';
import { EntityType } from './entities.js';
import { currentPlayer } from './player.js';
import { DEFAULT_BIRD_ATTRIBUTES } from './settings.js';
import { spriteAtlas } from "./sprites.js";
import { isWellOutsideWorldBoundary, scaleTileSizeHeight } from "./util.js";

export class BulletFactory {

}

export class BeeBulletFactory extends BulletFactory {
    /**
     * 
     * @param {AttributeSet} attributes
     */
    constructor(attributes) {

        super();

        this.attributes = attributes;
    }

    createBullet(entity, direction) {
        return new BeeBullet(entity, direction.normalize(this.attributes.bulletSpeed));
    }
}

export class BirdBulletFactory extends BulletFactory {
    constructor(opts) {

        super();

        opts = opts || {};

        this.speed = opts.speed || DEFAULT_BIRD_ATTRIBUTES.BULLET_SPEED;
        this.movement = opts.movement;
    }

    createBullet(entity, direction) {
        return new BirdBullet(entity, direction.normalize(this.speed), this.movement);
    }
}

export class Bullet extends EngineObject {

    constructor(spawningEntity, velocity, tileInfo) {
        super(spawningEntity.pos, vec2(1), tileInfo);

        this.spawningEntity = spawningEntity;
        this.velocity = velocity;

        this.setCollision();
        
        this.size = scaleTileSizeHeight(this.tileInfo, 0.5);
    }

    update() {
        super.update();
        
        if (isWellOutsideWorldBoundary(this)) {            
            this.destroy();
        }
    }

    isValidTarget(o) {
        return false;
    }

    /**
     * Just a hook for when the bullet hits a valid target.
     * @param {number} damage The amount of damange done.
     */
    onHit(damage) {

    }

    collideWithObject(o) {

        if (this.isValidTarget(o)) {

            this.destroy();

            const damage = this.spawningEntity.getDamage();
            o.applyDamage(damage);

            this.onHit(damage);
        }

        return false;
    }
}

export class BeeBullet extends Bullet {
    constructor(spawningEntity, velocity) {
        super(spawningEntity, velocity, spriteAtlas.ammo.bee);

        this.entityType = EntityType.BEE_BULLET;
    }

    isValidTarget(o) {
        return o.entityType == EntityType.BIRD;
    }

    onHit(damage) {
        if (currentPlayer) {
            currentPlayer.onHit(damage);
        }
    }
}

export class BirdBullet extends Bullet {

    constructor(spawningEntity, velocity, movement) {
        super(spawningEntity, velocity, spriteAtlas.ammo.bird);
        this.entityType = EntityType.BIRD_BULLET;
        this.movement = movement;
    }  

    update() {
        super.update();

        if (this.movement) {
            this.movement.update(this);
        }
    }

    isValidTarget(o) {
        return o.entityType == EntityType.BEE;
    }
}