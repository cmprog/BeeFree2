import { Bullet } from "./bullet.js";

export class ShootingBehavior {
    constructor() {        
        this.bulletTileInfo = undefined
    }

    update() {
        
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
            new Bullet(shooter.pos, this.velocity);
            this.cooldownTimer.set(this.rate);            
        }
    }
}