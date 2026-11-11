'use strict';

import { initSpriteAtlas, spriteAtlas } from "./sprites.js";
import { initMenus } from "./menus.js";
import { MENUS } from "./menu-registry.js";
import { CloudGenerator } from "./cloud.js";
import { initLevels } from "./level-list.js";
import { currentLevel } from "./levels.js";
import { initLogging, logDebug, logError, logInfo } from "./logging.js";
import { reloadAchivements, tryUnlockAllAchivements } from "./achivements.js";
import { initBirdTemplates } from "./birds.js";
import { GAME_SETTINGS } from "./settings.js";
import { initPlayer } from "./player.js";

initLogging();
initPlayer();

if (isTouchDevice) {
    logDebug("Touch device detected, initializing touch gamepad.");
    touchGamepadEnable = true;
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

    initSpriteAtlas();
    initBirdTemplates();
    initLevels();
    initMenus();

    // use a 720p fixed size canvas
    setCanvasFixedSize(vec2(1280, 720));
    
    reloadAchivements();

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

    tryUnlockAllAchivements();
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
const imagesSources = [
    'img/bee.png',
    'img/clouds.png',
    'img/bird.png',
    'img/misc.png',
    'img/owl.png',
    'img/honeycomb.png',
    'img/gem_red.png',
    'img/gem_blue.png',
    'img/gem_gold.png',
    'img/borders/Ram Border All.png',
    'img/hats.png',
];

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, imagesSources);