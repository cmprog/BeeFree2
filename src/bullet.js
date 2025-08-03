export class Bullet extends EngineObject {
    constructor(pos, velocity) {
        super(pos, vec2(1));
        this.color = BLACK;
        this.velocity = velocity;        

        this.lifeTimer = new Timer(10);
    }

    update() {
        super.update();

        if (this.lifeTimer.elapsed()) {
            this.destroy();
        }
    }
}