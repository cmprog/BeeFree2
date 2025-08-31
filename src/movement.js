import { currentPlayer } from "./player.js";
import { currentLevel } from "./levels.js";

export class MovementBehavior {
    update(obj) {

    }

    /**
     * Gets a copy of the behavior. This is only really needed for stateful behaviors.
     */
    copy() {
        return this;
    }
}

export class StaticMovement extends MovementBehavior {
    update(obj) {
        obj.velocity = vec2(0);
    }
}

export class FixedVelocityMovement extends MovementBehavior {
    constructor(velocity) {
        super();
        
        this.velocity = velocity;
    }

    update(obj) {
        obj.velocity = this.velocity;
    }
}

export class WaveyMovement extends MovementBehavior {
    /**
     * Moves an object along a general velocity line.
     * @param {Vector2} velocity The general direction and frequency of the movement.
     * @param {Vector2} size The total size of the wave - effectively the period and magnitude.
     * @param {number} period The duration in seconds to complete the wave.
     */
    constructor(velocity, size, period) {
        super();
        
        this.velocity = velocity;
        this.size = size;
        this.period = period;
    }

    update(obj) {
        
        // We track a pos value which is non-offset.
        // This just initializes the pos value we use.
        if (!this.pos) {
            this.pos = obj.pos;
        }

        // Save the non-offset position        
        this.pos = this.pos.add(this.velocity);

        // Apply the waving offset to the position to make the obj pos
        // We use the time since spawn to prevent weird sync behaviors with multiple entities
        obj.pos = this.pos.add(this.size.scale(Math.sin((time - obj.spawnTime) * (PI / this.period))));
    }

    copy() {
        return new WaveyMovement(this.velocity, this.size, this.period);
    }
}

export class BeeAttractiveMovementBehavior extends MovementBehavior {

    /**
     * 
     * @param {Vector2} initialVelocity The initial velocity to apply toward the obj.
     * @param {number} distance The minimum distance required before moving toward the bee.
     * @param {number} strength The speed used when chacing the bee.
     */
    constructor(initialVelocity, distance, strength) {

        super();

        this.initializedVelocity = false;
        this.initialVelocity = initialVelocity;
        this.normalSpeed = initialVelocity.length();

        this.distance = distance;
        this.strength = strength;
    }

    update(obj) {

        // Ensure we have an initial velocity set
        if (!this.initializedVelocity) {
            obj.velocity = this.initialVelocity;
            this.initializedVelocity;
        }

        const vectToBee = currentLevel.bee.pos.subtract(obj.pos);
        
        if (vectToBee.length() < this.distance) {
            obj.velocity = vectToBee.normalize(this.strength);
        } else {
            // Keep the velocity vector, but change the magnitude to normal speed
            obj.velocity = obj.velocity.normalize(this.normalSpeed);
        }
    }
}