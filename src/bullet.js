import { EntityType } from './entities.js';
import { DEFAULT_BIRD_ATTRIBUTES } from './settings.js';
import { spriteAtlas } from "./sprites.js";
import { scaleTileSizeHeight } from "./util.js";

export class BulletFactory {

}

export class BeeBulletFactory extends BulletFactory {
    constructor(bee) {

        super();

        this.speed = bee.bulletSpeed;
    }

    createBullet(entity, direction) {
        return new BeeBullet(entity, direction.normalize(this.speed));
    }
}

export class BirdBulletFactory extends BulletFactory {
    constructor(opts) {

        super();

        this.speed = opts.speed || DEFAULT_BIRD_ATTRIBUTES.BULLET_SPEED;
    }

    createBullet(entity, direction) {
        return new BirdBullet(entity, direction.normalize(this.speed));
    }
}

export class Bullet extends EngineObject {

    constructor(spawningEntity, velocity, tileInfo) {
        super(spawningEntity.pos, vec2(1), tileInfo);

        this.spawningEntity = spawningEntity;
        this.velocity = velocity;

        this.setCollision();
        
        this.size = scaleTileSizeHeight(this.tileInfo, 0.5);

        // Just a means to ensure it gets auto-cleaned up
        this.lifeTimer = new Timer(10);
    }

    update() {
        super.update();

        if (this.lifeTimer.elapsed()) {
            this.destroy();
        }
    }

    isValidTarget(o) {
        return false;
    }

    collideWithObject(o) {

        if (this.isValidTarget(o)) {

            this.destroy();

            const damage = this.spawningEntity.getDamage();
            o.applyDamage(damage);
        }

        return true;
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
}

export class BirdBullet extends Bullet {

    constructor(spawningEntity, velocity) {
        super(spawningEntity, velocity, spriteAtlas.ammo.bird);
        this.entityType = EntityType.BIRD_BULLET;
    }  

    isValidTarget(o) {
        return o.entityType == EntityType.BEE;
    }
}