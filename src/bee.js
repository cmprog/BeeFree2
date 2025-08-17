import { EntityType, ProgressBar } from './entities.js';
import { SingleBulletShooting } from "./shooting.js";
import { spriteAtlas } from "./sprites.js";
import { currentLevel } from "./levels.js";

export class Bee extends EngineObject {

    constructor(player) {
        super(vec2(0, 0), vec2(2, 2)); 
        this.entityType = EntityType.BEE;

        this.healthBar = new ProgressBar();
        this.addChild(this.healthBar, vec2(0, 1));

        this.renderOrder = 400;

        this.setCollision();
        
        this.shooting = new SingleBulletShooting(
            player.beeDamage, 
            vec2(1, 0).normalize(player.beeBulletSpeed),
            player.beeFireRate,
        );

        this.speed = player.beeSpeed;        
        this.maxHealth = player.beeMaxHealth;
        this.health = this.maxHealth;
        this.healthRegen = player.beeHealthRegen;
        this.honeycombAttraction = player.beeHoneycombAttration;    
        
        this.healthRegenTimer = new Timer(1);
    } 
    
    update() {
        super.update();

        if (this.healthRegenTimer.elapsed()) {
            this.health = min(this.maxHealth, this.health + this.healthRegen);
            this.healthRegenTimer.set(1);
        }

        this.healthBar.value = this.health / this.maxHealth;
        
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

        if ((amount > 0) && currentLevel) {
            currentLevel.onBeeDamageTaken();
        }

        this.health = Math.max(0, this.health - amount);
        if (!this.health) {            
            this.destroy();

            if (currentLevel) {
                currentLevel.onBeeDestroyed();
            }
        }
    }

    collideWithObject(o) {

        if (o.entityType == EntityType.HONEYCOMB) {
            currentLevel.onHoneycombCollected(o.value);
            o.destroy();            
        }

        return false;
    }
}