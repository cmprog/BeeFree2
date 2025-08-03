import { SingleBulletShooting } from "./shooting.js";
import { spriteAtlas } from "./sprites.js";

export class Bee extends EngineObject
{
    constructor()
    {
        super(vec2(0, 0), vec2(2, 2)); // set object position and size

        this.renderOrder = 400;

        this.setCollision(); // make object collide
        this.mass = 0; 

        this.shooting = new SingleBulletShooting(1, vec2(1, 0), 1);

        this.speed = 0.1        
    } 
    
    update() {
        super.update();
        
        // Chase the mouse cursor
        let direction = mousePos.subtract(this.pos)
        if (direction.length() > this.size.scale(0.4).length()) {
            this.velocity = direction.normalize(this.speed);
        } else {
            this.velocity = vec2(0, 0)
        }

        this.holdingFire = keyIsDown('KeySpace') || mouseIsDown(0) || gamepadIsDown(0);

        if (this.holdingFire) {
            this.shooting.fire(this);
        }
    }

    render() {        
        const frame = (time * 4) % 4 | 0;
        this.tileInfo = spriteAtlas.bee.frame(frame)
        super.render();
    }
}