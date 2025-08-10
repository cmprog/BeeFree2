import { Bee } from "./bee.js";
import { BeeBullet, BirdBullet } from "./bullet.js";
import { EntityType } from "./entities.js";

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
                new BeeBullet(shooter.pos, this.velocity);
            } else if (shooter.entityType == EntityType.BIRD) {
                new BirdBullet(shooter.pos, this.velocity);
            }

            this.cooldownTimer.set(this.rate);            
        }
    }
}