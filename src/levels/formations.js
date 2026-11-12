import { BIRD_TEMPLATES } from "../birds/templates.js";
import { FormationDefinition } from "./spawning.js";

/**
 * Just a class to support better JS doc support for the properties
 * of the FORMATIONS which we will be defining.
 */
export class FormationSet {
    constructor() {       

        /** 
         * A set of 6 birds in the shape of a backward slash (\).
         * @type {FormationDefinition}
         */
        this.backSlash = new FormationDefinition('Back Slash (\\)')    
            .withSpawn(BIRD_TEMPLATES.fred, 0, vec2(20, 10))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 6))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 2))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -2))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -6))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -10));

        /**
         * A set of 6 birds in the shape of a forward slash (/).
         * @type {FormationDefinition}
         */
        this.forwardSlash = new FormationDefinition('Forward Slash (/)') 
            .withSpawn(BIRD_TEMPLATES.fred, 0, vec2(20, -10))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -6))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, -2))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 2))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 6))
            .withSpawn(BIRD_TEMPLATES.fred, 1, vec2(20, 10));

        /**
         * A set of 4 birds aranged in a diamond pattern.
         * @type {FormationDefinition}
        */
        this.diamond = new FormationDefinition('Diamond')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 0))
            .withSpawn(BIRD_TEMPLATES.fred, 0.3, vec2(20, 5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.3, vec2(20, 0));

        /**
         * A vertical stack of 2 birds.
         * @type {FormationDefinition}
         */
        this.vert2 = new FormationDefinition('Vertical (2)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -5));

        /**
         * A vertical stack of 3 birds.
         * @type {FormationDefinition}
         */
        this.vert3 = new FormationDefinition('Vertical (3)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 0))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 7))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -7));

        /**
         * A vertical stack of 4 birds.
         * @type {FormationDefinition}
         */
        this.vert4 = new FormationDefinition('Vertical (4)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 9))    
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 3))            
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -3))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -9));

        /**
         * A vertical stack of 5 birds.
         * @type {FormationDefinition}
         */
        this.vert5 = new FormationDefinition('Vertical (5)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 10))    
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 0))            
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -10));

        /**
         * A vertical stack of 6 birds.
         * @type {FormationDefinition}
         */
        this.vert6 = new FormationDefinition('Vertical (6)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 10))    
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 6))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 2))            
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -2))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -6))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -10));

        /**
         * A vertical stack of 7 birds.
         * @type {FormationDefinition}
         */
        this.vert7 = new FormationDefinition('Vertical (7)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 9))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 6))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 3))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 0))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -3))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -6))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -9));

        /**
         * The thing 1 & 2 twin birds which always come from the right
         * side of the screen and move diagonally.
         * @type {FormationDefinition}
         */
        this.twinsRight = new FormationDefinition("Twins (Right - 1 & 2)")
            .withSpawn(BIRD_TEMPLATES.thing1, 0.0, vec2(20, -12))
            .withSpawn(BIRD_TEMPLATES.thing2, 0.0, vec2(20, 12));

        /**
         * The thing 1 & 2 twin birds which always come from the right
         * side of the screen and move diagonally.
         * @type {FormationDefinition}
         */
        this.twinsLeft = new FormationDefinition("Twins (Left - 3 & 4)")
            .withSpawn(BIRD_TEMPLATES.thing1, 0.0, vec2(-20, -12))
            .withSpawn(BIRD_TEMPLATES.thing2, 0.0, vec2(-20, 12));

        /**
         * The Whitney templaets which come from the right and move at a sharp angle.
         * @type {FormationDefinition}
         */
        this.whitneyRight = new FormationDefinition('Whitney (Right)')
            .withSpawn(BIRD_TEMPLATES.whitney_left_up, 0.0, vec2(20, -12))
            .withSpawn(BIRD_TEMPLATES.whitney_left_down, 0.0, vec2(20, 12));

        /**
         * Releases a set of birds in the shape of a greater than (>) sign.
         * This spawns 5 'columns' of birds where the third and fifth column
         * are a different type of bird. The final column is the 'point' and
         * only has one bird.
         * @type {FormationDefinition}
         */
        this.greaterThan = new FormationDefinition('Greater Than (>)')
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 9))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -9))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 7))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -7))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.bill, 0.0, vec2(20, 5))
            .withSpawn(BIRD_TEMPLATES.bill, 0.0, vec2(20, -5))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 3))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -3))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.bill, 0.0, vec2(20, 0));

            
        /**
         * Releases a set of birds in the shape of a less than (<) sign.
         * This spawns 5 'columns' of birds where the third and fifth column
         * are a different type of bird. The final column is the 'point' and
         * only has one bird.
         * @type {FormationDefinition}
         */
        this.lessThan = new FormationDefinition('Greater Than (<)')            
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 0))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 3))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -3))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 5))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -5))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 7))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -7))
            .withDelay(0.3)
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, 9))
            .withSpawn(BIRD_TEMPLATES.fred, 0.0, vec2(20, -9));
    }

}

/**
 * The reusable formations, available after initFormations() is called.
 * @type {FormationSet}
 */
export let FORMATIONS;

/**
 * Creates the formations. Must run after the bird templates are created.
 */
export function initFormations() {
    FORMATIONS = new FormationSet();
}
