import { currentLevel } from "./levels.js";

export class ShootingBehavior {

    /**
     * Attempts to fire a shot.
     * @param {EngineObject} shooter The shooting object.
     * @returns {number} The number of bullets fired.
     */
    fire(shooter) {
        
    }

    /**
     * Gets a copy of the behavior. This is only really needed for stateful behaviors.
     */
    copy() {
        return this;
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
            return 1;
        }

        return 0;
    }
}

export class MultiBulletShooting extends ShootingBehavior {
    constructor(opts) {
        super();
        
        /**
         * The number of bullets to spawn.
         * @type {number}
         * @public
         * @readonly
         */
        this.count = opts.count;

        /**
         * The factory which can create bullets for us.
         * @public
         * @readonly
         */
        this.bulletFactory = opts.bulletFactory;

        
        /**
         * The rate that we are allowed to fire bullets - defined as a duration in seconds.
         * @type {number}
         * @public
         * @readonly
         */
        this.rate = opts.rate;
        
        /**
         * A unit vector base direction we should be shooting the bullets.
         * @type {number}
         * @public
         * @readonly
         */
        this.direction = opts.direction;

        /**
         * A spread angle, in radians. The number of bullets will be spread between
         * (direction - (spread / 2), direction + (spread / 2)).
         * @type {number}
         * @public
         * @readonly
         */
        this.spread = opts.spread;

        this.startDirection = this.direction.rotate(-this.spread / 2);;
        this.endDirection = this.direction.rotate(this.spread / 2);
        this.deltaAngle = this.spread / (this.count - 1);

        this.cooldownTimer = new Timer();
    }

    fire(shooter) {
        
        if (!this.cooldownTimer.isSet() || this.cooldownTimer.elapsed()) {

            let currentDirection = this.startDirection;
            for (let iShot = 0; iShot < this.count; iShot += 1) {

                const bullet = this.bulletFactory.createBullet(shooter, currentDirection);
                currentLevel.trackObj(bullet);  

                currentDirection = currentDirection.rotate(this.deltaAngle);              
            }

            this.cooldownTimer.set(this.rate); 

            return this.count;
        }

        return 0;
    }
}