'use strict';

import { IMAGE_SOURCES, initSpriteAtlas, spriteAtlas } from "./core/sprites.js";
import { initMenus } from "./menus/menus.js";
import { MENUS } from "./menus/registry.js";
import { CloudGenerator } from "./entities/cloud.js";
import { initLevels } from "./levels/level-list.js";
import { currentLevel } from "./levels/levels.js";
import { initLogging, logDebug, logError, logInfo } from "./core/logging.js";
import { initAchievements, tryUnlockAllAchievements } from "./player/achievements.js";
import { BIRD_TEMPLATES, initBirdTemplates } from "./birds/templates.js";
import { initBirdArt } from "./birds/art.js";
import { GAME_SETTINGS } from "./settings.js";
import { initPlayer } from "./player/player.js";
import { initHatTuning } from "./hats/hats.js";

///////////////////////////////////////////////////////////////////////////////
// Startup
//
// Importing a module only declares things (classes, functions, fixed data). Everything the game
// creates at runtime is set up by the init*() calls here and in gameInit(), in this order.

// Before the engine starts; none of this needs the images.
initLogging();      // first, so everything after it shows up in the log panel
initHatTuning();    // dev-only hat tuning saved in this browser (localhost)
initPlayer();       // loads the save
initAchievements(); // after the player: each achievement reads its unlocked state from it

if (isTouchDevice) {
    logDebug("Touch device detected, initializing touch gamepad.");
    touchGamepadEnable = true;
    // The bee only uses the left stick (move) and button 0 (fire), so show one large fire button
    // instead of the default four.
    setTouchGamepadButtonCount(1);
    // touchGamepadSize is in screen (CSS) pixels since LittleJS 1.2x. The default of 100 matches the
    // size the old setting of 200 canvas pixels came out to on a phone.
}

// Write up some error handing to we can see it in our UI logger
window.addEventListener('error', (errorMsg, url, lineNumber) => {
    logError(errorMsg.error.stack);
});

// Only show the watermark when we are running in dev.
setDebugWatermark(GAME_SETTINGS.IS_LOCAL_DEV_ENVIRONMENT);

///////////////////////////////////////////////////////////////////////////////
function gameInit() {

    logInfo('Initializing game...');

    soundEnable = false;

    // Once the engine has loaded the images.
    initSpriteAtlas();   // needs the loaded images
    initBirdTemplates();
    initBirdArt(Object.values(BIRD_TEMPLATES)); // draws each bird type's sprite sheet
    initLevels();        // after the bird templates: levels are built from them
    initMenus();         // last: menus read the player, levels and sprites

    // use a 720p fixed size canvas
    setCanvasFixedSize(vec2(1280, 720));

    new CloudGenerator()

    MENUS.MAIN.open(); 
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {

    touchGamepadEnable = (currentLevel != null);
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {

    // called after physics and objects are updated
    // setup camera and prepare for render

    // logDebug(`Solid object count: ${engineObjectsCollide.length}`);

    tryUnlockAllAchievements();
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects
    
    drawRect(vec2(), screenToWorld(mainCanvasSize).scale(2), new Color(0, 1, 1));
}

///////////////////////////////////////////////////////////////////////////////
function gameRenderPost()
{
    // called after objects are rendered
    // draw effects or hud that appear above all objects
    // drawTextScreen('Hello World!', mainCanvasSize.scale(.5), 80);    
}

///////////////////////////////////////////////////////////////////////////////
// Startup LittleJS Engine
engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, [...IMAGE_SOURCES]);