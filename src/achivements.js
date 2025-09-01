import { currentPlayer } from './player.js'

setMedalDisplaySize(vec2(300, 60));
setMedalDisplayIconSize(55);

class Achivement extends Medal {
    constructor(id, name, description, icon, src, data) {
        super(id, name, description, icon, src)

        this.getCurrentValue = data.getCurrentValue;
        this.targetValue = data.targetValue;
        this.rewardedHoneycomb = data.rewardedHoneycomb;

        this.checkUnlock = data.checkUnlock || (() => (this.getCurrentValue() >= this.targetValue));

        this.reload();
    }

    /**
     * The percentage progress of this achivement.
     * @returns A percent progress represented as a number between 0.0 and 1.0.
     */
    getProgress() {
        return clamp(this.getCurrentValue() / this.targetValue, 0, 1);
    }

    /**
     * Reloads the achivement, specifically the unlocked state, by checking
     * the current player's unlocks.
     */
    reload() {        
        this.unlocked = (this.id in currentPlayer.achivements) && currentPlayer.achivements[this.id];
    }

    tryUnlock() {
        if (this.unlocked) return;
        if (this.checkUnlock()) {
            this.unlock();
        }
    }

    unlock() {
        // default logic saves each medal in its own local storage, we want to
        // save it with the player data, so we overwrite the whole method

        if (medalsPreventUnlock || this.unlocked) return;

        this.unlocked = true;

        if (this.rewardedHoneycomb) {
            currentPlayer.onHoneycombCollected(this.rewardedHoneycomb);
        }

        currentPlayer.achivements[this.id] = this.unlocked;
        currentPlayer.save();

        medalsDisplayQueue.push(this);
    }

    render(hidePercent=0) {
        
        // Overriding the super logic because it doesn't scale properly when the `medalDisplaySize` and `medalDisplayIconSize`
        // settings are changed from their default values.

        const context = overlayContext;
        const width = min(medalDisplaySize.x, mainCanvas.width);
        const x = overlayCanvas.width - width;
        const y = -medalDisplaySize.y*hidePercent;

        // draw containing rect and clip to that region
        context.save();
        context.beginPath();
        context.fillStyle = new Color(.9,.9,.9).toString();
        context.strokeStyle = new Color(0,0,0).toString();
        context.lineWidth = 3;
        context.rect(x, y, width, medalDisplaySize.y);
        context.fill();
        context.stroke();
        context.clip();

        const defaultMedalDisplayX = 640;
        const defaultMedalDisplayY = 80;
        const defaultDisplayIconSize = 50;

        // draw the icon and text
        this.renderIcon(vec2(x+(15 / defaultDisplayIconSize)+medalDisplayIconSize/2, y+medalDisplaySize.y/2));
        const pos = vec2(x+medalDisplayIconSize + (30 / defaultMedalDisplayX), y+medalDisplayIconSize * (28 / defaultMedalDisplayY));
        drawTextScreen(this.name, pos, medalDisplayIconSize * (38 / defaultMedalDisplayY), new Color(0,0,0), 0, undefined, 'left');
        pos.y += medalDisplayIconSize * (32 / defaultMedalDisplayY);
        drawTextScreen(this.description, pos, medalDisplayIconSize * (24 / defaultMedalDisplayY), new Color(0,0,0), 0, undefined, 'left');
        context.restore();
    }
}

const ACHIVEMENTS = [

    // ****************************************************
    // Level Start
    // ****************************************************
    new Achivement(0, 'First Level', 'Started your first level.', undefined, undefined, {        
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 1,
        rewardedHoneycomb: 1,
    }),
    new Achivement(1, 'Fifth Level', 'Started 5 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 5,
        rewardedHoneycomb: 1,
    }),
    new Achivement(2, 'Tenth Level', 'Started 10 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 10,
        rewardedHoneycomb: 5,
    }),
    new Achivement(3, 'Twenty-fifth Level', 'Started 25 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 25,
        rewardedHoneycomb: 10,
    }),
    new Achivement(4, 'Fiftieth Level', 'Started 50 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 50,
        rewardedHoneycomb: 20,
    }),
    new Achivement(5, 'Hundredth Level', 'Started 100 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 100,
        rewardedHoneycomb: 25,
    }),
    new Achivement(6, 'Two-hundredth Level', 'Started 200 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 200,
        rewardedHoneycomb: 50,
    }),
    new Achivement(7, 'Five-hundredth Level', 'Started 500 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 500,
        rewardedHoneycomb: 100,
    }),
    new Achivement(8, 'Thousandth Level', 'Started 1,000 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsStartCount,
        targetValue: 1000,
        rewardedHoneycomb: 200,
    }),
    
    // ****************************************************
    // Level Completion
    // ****************************************************
    new Achivement(9, 'First Level Complete', 'Completed your first level.', undefined, undefined, {        
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 1,
        rewardedHoneycomb: 1,
    }),
    new Achivement(10, 'Fifth Level Complete', 'Completed 5 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 5,
        rewardedHoneycomb: 1,
    }),
    new Achivement(11, 'Tenth Level Complete', 'Completed 10 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 10,
        rewardedHoneycomb: 5,
    }),
    new Achivement(12, 'Twenty-fifth Level Complete', 'Completed 25 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 25,
        rewardedHoneycomb: 10,
    }),
    new Achivement(13, 'Fiftieth Level Complete', 'Completed 50 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 50,
        rewardedHoneycomb: 20,
    }),
    new Achivement(14, 'Hundredth Level Complete', 'Completed 100 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 100,
        rewardedHoneycomb: 25,
    }),
    new Achivement(15, 'Two-hundredth Level Complete', 'Completed 200 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 200,
        rewardedHoneycomb: 50,
    }),
    new Achivement(16, 'Five-hundredth Level Complete', 'Completed 500 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 500,
        rewardedHoneycomb: 100,
    }),
    new Achivement(17, 'Thousandth Level Complete', 'Completed 1,000 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsCompletedCount,
        targetValue: 1000,
        rewardedHoneycomb: 200,
    }),
    
    // ****************************************************
    // Level Failure
    // ****************************************************
    new Achivement(18, 'First Level Complete', 'Failed your first level.', undefined, undefined, {        
        getCurrentValue: () => currentPlayer.levelsFailureCount,
        targetValue: 1,
        rewardedHoneycomb: 1,
    }),
    new Achivement(19, 'Fifth Level Complete', 'Failed 5 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsFailureCount,
        targetValue: 5,
        rewardedHoneycomb: 1,
    }),
    new Achivement(20, 'Tenth Level Complete', 'Failed 10 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsFailureCount,
        targetValue: 10,
        rewardedHoneycomb: 5,
    }),
    new Achivement(21, 'Twenty-fifth Level Complete', 'Failed 25 total levels.', undefined, undefined, {
        getCurrentValue: () => currentPlayer.levelsFailureCount,
        targetValue: 25,
        rewardedHoneycomb: 10,
    }),
    
    // ****************************************************
    // Honeycomb Collection
    // ****************************************************
    new Achivement(22, 'Honeycomb is good', 'Collect your first honeycomb', undefined, undefined, {        
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 1,
        rewardedHoneycomb: 1,
    }),
    new Achivement(23, 'More honeycomb', 'Collect 10 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 10,
        rewardedHoneycomb: 2,
    }),
    new Achivement(24, 'Even more honeycomb', 'Collect 50 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 50,
        rewardedHoneycomb: 5,
    }),
    new Achivement(25, 'Why is it so sticky?', 'Collect 100 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 100,
        rewardedHoneycomb: 10,
    }),
    new Achivement(26, 'I want more!', 'Collect 200 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 200,
        rewardedHoneycomb: 20,
    }),
    new Achivement(27, 'Even more!', 'Collect 500 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 500,
        rewardedHoneycomb: 30,
    }),
    new Achivement(28, 'I\'m not sharing...', 'Collect 1,000 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 1000,
        rewardedHoneycomb: 40,
    }),
    new Achivement(29, 'Do bees have pockets?', 'Collect 2,000 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 2000,
        rewardedHoneycomb: 60,
    }),
    new Achivement(30, 'Fat stacks', 'Collect 5,000 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 5000,
        rewardedHoneycomb: 100,
    }),
    new Achivement(31, 'Investment fund', 'Collect 10,000 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 10000,
        rewardedHoneycomb: 300,
    }),
    new Achivement(32, 'Honey, honey, honey', 'Collect 50,000 honeycomb', undefined, undefined, {
        getCurrentValue: () => currentPlayer.totalHoneycombCollected,
        targetValue: 50000,
        rewardedHoneycomb: 1000,
    }),
];

medalsInit('achivements');

export function tryUnlockAllAchivements() {
    medalsForEach(achivement => {
        achivement.tryUnlock();
    });
}