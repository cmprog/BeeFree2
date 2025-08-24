import { currentLevel } from "./levels.js";

export class ShootingBehavior {

    fire() {
        
    }
}

export class PassiveShooting extends ShootingBehavior {    
}

export class SingleBulletShooting extends ShootingBehavior {
    constructor(opts) {
        super();
        
        this.bulletFactory = opts.bulletFactory;
        this.rate = opts.rate;
        this.direction = opts.direction;

        this.cooldownTimer = new Timer();
    }

    fire(shooter) {
        if (!this.cooldownTimer.isSet() || this.cooldownTimer.elapsed()) {
            const bullet = this.bulletFactory.createBullet(shooter, this.direction);
            currentLevel.trackObj(bullet);
            this.cooldownTimer.set(this.rate);            
        }
    }
}