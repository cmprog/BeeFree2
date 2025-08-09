import { logDebug } from "./logging.js";
import { EntityType, HealthBar } from './entities.js';
import { SingleBulletShooting } from "./shooting.js";
import { spriteAtlas } from "./sprites.js";
import { currentLevel } from "./levels.js";

export class Bee extends EngineObject {

    constructor() {
        super(vec2(0, 0), vec2(2, 2)); 
        this.entityType = EntityType.BEE;

        this.healthBar = new HealthBar();
        this.addChild(this.healthBar, vec2(0, 1));

        this.renderOrder = 400;

        this.setCollision();
        
        this.shooting = new SingleBulletShooting(1, vec2(1, 0), 1);

        this.speed = 0.1;
        
        this.maxHealth = 5;
        this.health = this.maxHealth;
    } 
    
    update() {
        super.update();

        this.healthBar.currentValue = this.health;
        this.healthBar.maxValue = this.maxHealth;
        
        let direction;
        let holdingFire = false;

        if (isUsingGamepad) {

            direction = gamepadStick(0);            
            holdingFire = gamepadIsDown(0) || gamepadIsDown(0);
            
        } else {
            
            // Chase the mouse cursor, put some threshold around the length to prevent
            // twitchiness around this object's center
            direction = mousePos.subtract(this.pos)
            if (direction.length() < this.size.scale(0.4).length()) {
                direction = vec2(0);
            }

            holdingFire = keyIsDown('KeySpace') || mouseIsDown(0) || gamepadIsDown(0);
        }

        if (direction.length()) {
            this.velocity = direction.normalize(this.speed);
        } else {
            this.velocity = vec2(0);
        }      

        if (holdingFire) {
            this.shooting.fire(this);
        }
    }

    render() {        
        const frame = (time * 4) % 4 | 0;
        this.tileInfo = spriteAtlas.bee.frame(frame)
        super.render();
    }

    applyDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        if (!this.health) {            
            this.destroy();

            if (currentLevel) {
                currentLevel.onBeeDestroyed();
            }
        }
    }
}