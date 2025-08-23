import { currentPlayer } from './player.js'

class Achivement extends Medal {
    constructor(id, name, description, icon, src, data) {
        super(id, name, description, icon, src)
        this.checkUnlock = data.checkUnlock;

        this.reload();
    }

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
        currentPlayer.achivements[this.id] = this.unlocked;
        medalsDisplayQueue.push(this);
    }
}

const ACHIVEMENTS = [
    new Achivement(0, 'First Level', 'Started your first level.', undefined, undefined, {
        checkUnlock: () => currentPlayer.levelsStarted > 1
    }),
    new Achivement(1, 'Fifth Level', 'Started 5 total levels.', undefined, undefined, {
        checkUnlock: () => currentPlayer.levelsStarted > 5
    }),
    new Achivement(2, 'Tenth Levels', 'Started 10 total levels.', undefined, undefined, {
        checkUnlock: () => currentPlayer.levelsStarted > 10
    }),
    new Achivement(3, 'Twenty-fifth Levels', 'Started 25 total levels.', undefined, undefined, {
        checkUnlock: () => currentPlayer.levelsStarted > 25
    }),
    new Achivement(4, 'Fiftieth Levels', 'Started 50 total levels.', undefined, undefined, {
        checkUnlock: () => currentPlayer.levelsStarted > 50
    }),
    new Achivement(5, 'Hundredth Levels', 'Started 100 total levels.', undefined, undefined, {
        checkUnlock: () => currentPlayer.levelsStarted > 100
    }),
];

medalsInit('achivements');

export function tryUnlockAllAchivements() {
    medalsForEach(achivement => {
        achivement.tryUnlock();
    });
}