export let spriteAtlas;

export function initializeSpriteAtlas() {
    spriteAtlas = {
        bee: new TileInfo(vec2(0, 0), vec2(75, 59), 0),

        clouds: [
            new TileInfo(vec2(7, 12), vec2(62, 37), 1),
            new TileInfo(vec2(8, 55), vec2(34, 23), 1),
            new TileInfo(vec2(16, 86), vec2(41, 28), 1),
            new TileInfo(vec2(81, 24), vec2(30, 20), 1),
            new TileInfo(vec2(67, 55), vec2(50, 29), 1),
            new TileInfo(vec2(72, 92), vec2(31, 24), 1),
        ],

        bird: {
            body: new TileInfo(vec2(2, 22), vec2(51, 40), 2),
            head: new TileInfo(vec2(0, 0), vec2(18, 21), 2),
            face: new TileInfo(vec2(23, 2), vec2(13, 13), 2),
            eyelids: new TileInfo(vec2(24, 18), vec2(11, 4), 2),
            legs: new TileInfo(vec2(39, 0), vec2(29, 19), 2),            
        },

        ammo: {
            bee: new TileInfo(vec2(0, 0), vec2(15, 12), 3),
            bird: new TileInfo(vec2(17, 1), vec2(15, 10), 3),
        },

        owl: {
            body: new TileInfo(vec2(0, 0), vec2(190, 200), 4),
            frontWing: new TileInfo(vec2(189, 2), vec2(100, 110), 4),
            backWing: new TileInfo(vec2(292, 11), vec2(85, 75), 4),
        }
    }
}