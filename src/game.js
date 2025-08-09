'use strict';

import { getWorldSize } from "./util.js";
import { Wall } from "./wall.js"
import { CloudGenerator } from "./cloud.js";
import { initializeSpriteAtlas, spriteAtlas } from "./sprites.js";
import { LEVEL_SELECTION_MENU, MAIN_MENU } from "./menus.js";
import { currentLevel } from "./levels.js";
import { logDebug, logInfo } from "./logging.js";
import { Owl } from "./owl.js";

if (isTouchDevice) {
    logDebug("Touch device detected, initializing touch gamepad.");
    touchGamepadEnable = true;
    touchGamepadSize = 200;
}

///////////////////////////////////////////////////////////////////////////////
function gameInit() {

    logInfo('Initializing game...');

    initializeSpriteAtlas();

    setCanvasFixedSize(vec2(1280, 720)); // use a 720p fixed size canvas

    new CloudGenerator()

    MAIN_MENU.open();

    let worldSize = getWorldSize();
    let halfWorldSize = worldSize.scale(0.5);

    // create walls
    new Wall(vec2(-halfWorldSize.x - 1, 0), vec2(1, worldSize.y * 2)) // left
    new Wall(vec2(halfWorldSize.x + 1, 0), vec2(1, worldSize.y * 2)) // right
    new Wall(vec2(0, halfWorldSize.y + 1), vec2(worldSize.x * 2, 1)) // top
    new Wall(vec2(0, -halfWorldSize.y - 1), vec2(worldSize.x * 2, 1)) // bottom
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate() {

    if (currentLevel) {

        currentLevel.update();

        if (currentLevel.isComplete()) {
            LEVEL_SELECTION_MENU.open();
            currentLevel.destroy();
        }
    } else {
        touchGamepadEnable = false;
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost() {

    // called after physics and objects are updated
    // setup camera and prepare for render
}

///////////////////////////////////////////////////////////////////////////////
function gameRender()
{
    // called before objects are rendered
    // draw any background effects that appear behind objects

    const worldSize = getWorldSize()
    drawRect(vec2(), worldSize, new Color(0, 1, 1))
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
]

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, imagesSources);