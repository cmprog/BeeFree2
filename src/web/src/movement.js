export class MovementBehavior {
    update(obj) {

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