import { BirdTemplate } from "./birds.js";
import { BirdBulletFactory } from "./bullet.js";
import { BeeAttractiveMovementBehavior, FixedVelocityMovement, WaveyMovement } from "./movement.js";
import { DEFAULT_BIRD_ATTRIBUTES } from "./settings.js";
import { MultiBulletShooting, SingleBulletShooting } from "./shooting.js";
import { SPAWN_REGIONS } from "./spawning.js";
import { rgb255 } from "./util.js";

// Every kind of bird in the game, built with the BirdTemplate fluent builder (birds.js).
// Template keys are used by the levels and the time trial; the time trial picks from all of them.
export class BirdTemplateSet {

    constructor() {        

        /** 
         * A simple bird, simple movement and no shooting.
         * @type {BirdTemplate}
         */
        this.fred = new BirdTemplate('Fred', 'A simple bird, simple movement and no shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 1;
                attr.touchDamage = 1;
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(RED, RED);

        /** 
         * The most basic aggressive bird. Simple movement and shots forward.
         * @type {BirdTemplate}
         * */
        this.bill = new BirdTemplate('Bill', 'The most basic aggressive bird. Simple movement and shots forward.')
            .configureAttributes(attr => {
                attr.maxHealth = 2;
                attr.touchDamage = 2;
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            })            
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(BLUE, BLUE);

        /** 
         * Twin to Thing 2 - this bird moves up and to the left while shooting.
         * @type {BirdTemplate}
         */
        this.thing1 = new BirdTemplate('Thing 1', 'Twin to Thing 2 - this bird moves up and to the left while shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 4;
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 1).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            })
            .withTimeTrialPhase(1)     
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withSpawnRegion(SPAWN_REGIONS.BOTTOM_RIGHT)
            .withColors(BLUE, RED);

        /** 
         * The twin to Thing 1 - this bird moves down and to the left while shooting.
         * @type {BirdTemplate}
         */
        this.thing2 = new BirdTemplate('Thing 2', 'The twin to Thing 1 - this bird moves down and to the left while shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 4;
                attr.damage = 4;
                attr.fireRate = (1.0 / 0.9);
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, -1).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            })     
            .withTimeTrialPhase(1)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.TOP_RIGHT)           
            .withColors(BLUE, RED);

        /**
         * The twin to Thing 4, this bird moves up and to the right while shooting.
         * @type {BirdTemplate}
         */
        this.thing3 = new BirdTemplate('Thing 3', 'The twin to Thing 4, this bird moves up and to the right while shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 4;
                attr.damage = 4;
                attr.fireRate = (1.0 / 0.9);
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(1, 1).normalize(attr.speed));
            })
            .withTimeTrialPhase(1)
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            })         
            .withSpawnRegion(SPAWN_REGIONS.BOTTOM_LEFT)
            .withSpawnRegion(SPAWN_REGIONS.LEFT_LOWER)      
            .withColors(BLUE, RED);

        /**
         * @type {BirdTemplate}
         */
        this.thing4 = new BirdTemplate('Thing 4', 'The twin to Thing 3, this bird moves down and to the right while shooting.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 4;
                attr.damage = 4;
                attr.fireRate = (1.0 / 0.9);
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(1, -1).normalize(attr.speed));
            })
            .withTimeTrialPhase(1)
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .configureAttributes(attr => {
                attr.damage = 4;
                attr.fireRate = 1.0 / 0.9;
            })
            .withSpawnRegion(SPAWN_REGIONS.TOP_LEFT)
            .withSpawnRegion(SPAWN_REGIONS.LEFT_UPPER)          
            .withColors(BLUE, RED);

        /**
         * (GREEN) Greg is a simple bird who is a little drunk.
         * @type {BirdTemplate}
         */
        this.greg = new BirdTemplate('Greg', 'Greg is a simple bird who is a little drunk.')
            .configureAttributes(attr => {
                attr.maxHealth = 3;
                attr.touchDamage = 6;
            })
            .withMovement(attr => {
                return new WaveyMovement(vec2(-1, 0).normalize(attr.speed), vec2(1, 1), 1);
            })            
            .withTimeTrialPhase(2)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)        
            .withColors(GREEN, GREEN);

        /**
         * (YELLOW) Frank is Greg's friend but he flings poo.
         * @type {BirdTemplate}
         */
        this.frank = new BirdTemplate('Frank', 'Frank is Greg\'s friend but he flings poo.')
            .configureAttributes(attr => {
                attr.maxHealth = 4;
                attr.touchDamage = 7;
                attr.damage = 6;
                attr.fireRate = (1.0 / 0.8);
            })
            .withMovement(attr => {
                return new WaveyMovement(vec2(-1, 0).normalize(attr.speed), vec2(1, 1), 1);
            })
            .withTimeTrialPhase(3)
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(YELLOW, YELLOW);

        /**
         * (PURPLE) Harry has mastered the ability to throw two pieces of poop at once.
         * @type {BirdTemplate}
         */
        this.harry = new BirdTemplate('Harry', 'Harry has mastered the ability to throw two pieces of poop at once.')
            .configureAttributes(attr => {
                attr.maxHealth = 8;
                attr.touchDamage = 10;
                attr.damage = 7;
                attr.fireRate = (1.0 / 1.0);
            })
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new MultiBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                    count: 2,
                    spread: PI / 4
                });
            }) 
            .withTimeTrialPhase(4)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(rgb255(85, 26, 139), rgb255(125, 38, 205));

        /**
         * (GRAY / BLACK) Kathy is a little extreme when it comes to stalking bees
         * @type {BirdTemplate}
         */
        this.kathy = new BirdTemplate('Kathy', 'Kathy is a little extreme when it comes to stalking bees.')
            .configureAttributes(attr => {
                attr.maxHealth = 6;
                attr.touchDamage = 8;
                attr.damage = 8;
            })
            .withMovement(attr => {
                return new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(attr.speed), 10, DEFAULT_BIRD_ATTRIBUTES.speed * 1.25);
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory(),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withTimeTrialPhase(4)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            .withColors(GRAY, BLACK);

        /**
         * (LIME GREEN) Whitney has managed to throw poo in such a way as to track bees!
         * @type {BirdTemplate}
         */
        this.whitney_left = new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!')  
            .configureAttributes(attr => {
                attr.maxHealth = 7;
                attr.touchDamage = 13;
                attr.damage = 7;
                attr.fireRate = (1.0 / 1.2);
            })          
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory({                        
                        movement: new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(attr.bulletSpeed), 5, attr.bulletSpeed * 1.5)
                    }),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withTimeTrialPhase(5)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152));

        /**
         * (LIME GREEN) Whitney has managed to throw poo in such a way as to track bees!
         * @type {BirdTemplate}
         */
        this.whitney_left_up = new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!')    
            .configureAttributes(attr => {
                attr.maxHealth = 7;
                attr.touchDamage = 13;
                attr.damage = 7;
                attr.fireRate = (1.0 / 1.2);
            })                  
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 2).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory({                        
                        movement: new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(attr.bulletSpeed), 5, attr.bulletSpeed * 1.5)
                    }),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withTimeTrialPhase(5)
            .withSpawnRegion(SPAWN_REGIONS.BOTTOM_RIGHT)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152));

        /**
         * (LIME GREEN) Whitney has managed to throw poo in such a way as to track bees!
         * @type {BirdTemplate}
         */
        this.whitney_left_down = new BirdTemplate('Whitney', 'Whitney has managed to throw poo in such a way as to track bees!')   
            .configureAttributes(attr => {
                attr.maxHealth = 7;
                attr.touchDamage = 13;
                attr.damage = 7;
                attr.fireRate = (1.0 / 1.2);
            })                   
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, -2).normalize(attr.speed));
            })
            .withShooting(attr => {
                return new SingleBulletShooting({
                    bulletFactory: new BirdBulletFactory({                        
                        movement: new BeeAttractiveMovementBehavior(vec2(-1, 0).normalize(attr.bulletSpeed), 5, attr.bulletSpeed * 1.5)
                    }),
                    direction: vec2(-1, 0),
                    rate: attr.fireRate,
                });
            }) 
            .withTimeTrialPhase(5)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.TOP_RIGHT)
            // Very lime green
            .withColors(rgb255(0, 255, 0), rgb255(152, 251, 152));

        /**
         * (DARK RED) A more resiliant basic passive bird.
         * @type {BirdTemplate}
         */
        this.tom = new BirdTemplate('Tom', 'A more resiliant basic passive bird.')         
            .configureAttributes(attr => {
                attr.maxHealth = 25;
                attr.touchDamage = 15;
                attr.damage = 7;
            })             
            .withMovement(attr => {
                return new FixedVelocityMovement(vec2(-1, 0).normalize(attr.speed));
            })
            .withTimeTrialPhase(6)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_UPPER)
            .withSpawnRegion(SPAWN_REGIONS.RIGHT_LOWER)
            // Darker red than fred
            .withColors(rgb255(139, 26, 26), rgb255(238, 44, 44));
    }

}

/**
 * @type {BirdTemplateSet}
 */
export let BIRD_TEMPLATES;

/**
 * Creates the bird templates. Called by game.js at startup.
 */
export function initBirdTemplates() {
    BIRD_TEMPLATES = new BirdTemplateSet();
}
