'use strict';

import { getWorldSize } from "./util.js";
import { Wall } from "./wall.js"
import { CloudGenerator } from "./cloud.js";
import { initializeSpriteAtlas, spriteAtlas } from "./sprites.js";
import { LEVEL_SELECTION_MENU, MAIN_MENU } from "./menus.js";
import { currentLevel } from "./levels.js";
import { BIRD_TEMPLATES } from "./birds.js";


///////////////////////////////////////////////////////////////////////////////
function gameInit()
{
    initializeSpriteAtlas();

    // called once after the engine starts up

    setCanvasFixedSize(vec2(1280, 720)); // use a 720p fixed size canvas

    // create bricks
    // for(let x=2;  x<=levelSize.x-2; x+=2)
    // for(let y=12; y<=levelSize.y-2; y+=1)
    // {
    //     const brick = new Brick(vec2(x,y), vec2(2,1)); // create a brick
    //     brick.color = randColor(); // give brick a random color
    // }

    // new Paddle; // create player's paddle
    // new Bee()
    new CloudGenerator()

    MAIN_MENU.open();

    let worldSize = getWorldSize()
    let halfWorldSize = worldSize.scale(0.5)

    // create walls
    new Wall(vec2(-halfWorldSize.x - 1, 0), vec2(1, worldSize.y * 2)) // left
    new Wall(vec2(halfWorldSize.x + 1, 0), vec2(1, worldSize.y * 2)) // right
    new Wall(vec2(0, halfWorldSize.y + 1), vec2(worldSize.x * 2, 1)) // top
    new Wall(vec2(0, -halfWorldSize.y - 1), vec2(worldSize.x * 2, 1)) // bottom
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdate()
{
    if (currentLevel) {

        currentLevel.update();

        if (currentLevel.isComplete()) {
            LEVEL_SELECTION_MENU.open();
            currentLevel.destroy();
        }
    }
}

///////////////////////////////////////////////////////////////////////////////
function gameUpdatePost()
{
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
]

engineInit(gameInit, gameUpdate, gameUpdatePost, gameRender, gameRenderPost, imagesSources);