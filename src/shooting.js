import { Bee } from "./bee.js";
import { BeeBullet, BirdBullet } from "./bullet.js";
import { EntityType } from "./entities.js";
import { currentLevel } from "./levels.js";

export class ShootingBehavior {

    fire() {
        
    }
}

export class PassiveShooting extends ShootingBehavior {    
}

export class SingleBulletShooting extends ShootingBehavior {
    constructor(damage, velocity, rate) {
        super();

        this.damage = damage;
        this.velocity = velocity;
        this.rate = rate;

        this.cooldownTimer = new Timer();
    }

    fire(shooter) {
        if (!this.cooldownTimer.isSet() || this.cooldownTimer.elapsed()) {

            if (shooter.entityType == EntityType.BEE) {                
                const bullet = new BeeBullet(shooter.pos, this.velocity);
                currentLevel.trackObj(bullet);
            } else if (shooter.entityType == EntityType.BIRD) {
                const bullet = new BirdBullet(shooter.pos, this.velocity);
                currentLevel.trackObj(bullet);
            }

            this.cooldownTimer.set(this.rate);            
        }
    }
}