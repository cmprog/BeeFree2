'use strict';

import { CloudGenerator } from "./cloud.js";
import { initializeSpriteAtlas, spriteAtlas } from "./sprites.js";
import { MENUS } from "./menus.js";
import { currentLevel } from "./levels.js";
import { logDebug, logError, logInfo } from "./logging.js";

if (isTouchDevice) {
    logDebug("Touch device detected, initializing touch gamepad.");
    touchGamepadEnable = true;
    touchGamepadSize = 200;
}

// Write up some error handing to we can see it in our UI logger
window.addEventListener('error', (errorMsg, url, lineNumber) => {
    logError(errorMsg.error.stack);
});

// Only show the watermark when we are running in dev.
showWatermark = (document.location.href.indexOf('localhost') >= 0);

///////////////////////////////////////////////////////////////////////////////
function gameInit() {

    logInfo('Initializing game...');

    soundEnable = false;

    initializeSpriteAtlas();

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
];

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, imagesSources);