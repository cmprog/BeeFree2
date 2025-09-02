import { currentLevel } from "./levels.js";
import { spriteAtlas } from "./sprites.js";
import { getWorldSize, isWellOutsideWorldBoundary } from "./util.js";

export class CloudGenerator extends EngineObject {

    constructor() {
        super()
        
        this.timer = new Timer();
        this.resetTimer();
    }

    update() {
        // purposefully not calling super because we don't care about physics
        if (this.timer.elapsed()) {
            this.generateCloud();
            this.resetTimer();
        }
    }

    render() {
        // Purposefully not calling super because we don't care about rending
    }

    resetTimer() {
        this.timer.set(rand(0.50, 1.5));
    }

    generateCloud() {

        let worldSize = getWorldSize();        
        let halfWorldSize = worldSize.scale(0.5);
        
        let cloudScale = rand(0.5, 2.0)
        let cloudSpeed = rand(0.1, 0.3)

        let cloudPos = vec2(halfWorldSize.x * 2, rand(-halfWorldSize.y, halfWorldSize.y))

        new Cloud(cloudPos, cloudScale, cloudSpeed)
    }
}

export class Cloud extends EngineObject
{
    constructor(pos, scale, speed)
    {
        const targetTileInfo = spriteAtlas.clouds[randInt(spriteAtlas.clouds.length)]
        
        const baseWidth = 3.0;
        const baseHeight = (targetTileInfo.size.y / targetTileInfo.size.x) * baseWidth;
        const baseSize = vec2(baseWidth, baseHeight);        

        super(pos, baseSize.scale(scale));

        this.tileInfo = targetTileInfo;
        this.velocity = vec2(-speed, 0);
    }

    update() {
        super.update();

        if (currentLevel && currentLevel.isSammyPartyTime()) {
            this.color = hsl(wave(1 / 5, 1, time - this.spawnTime), 0.5, 0.5); 
            this.drawSize = this.size.scale(0.8 + wave(1, 0.4, time - this.spawnTime));   
        } else {
            this.color = undefined;
            this.drawSize = undefined;
        }        

        if (isWellOutsideWorldBoundary(this)) {
            this.destroy();
        }
    }
}