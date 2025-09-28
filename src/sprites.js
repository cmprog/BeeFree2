export class BorderInfo {

    constructor(tileInfo, borderSizeScale, borderPaddingScale) {

        /**
         * @type {TileInfo}
         */
        this.fullTileInfo = tileInfo;
        
        /**
         * The scaled down tile info representing just the top left corder of the border image.
         * @type {TileInfo}
         */
        this.nineSliceTileInfo = new TileInfo(
            this.fullTileInfo.pos, this.fullTileInfo.size.scale(1 / 3), 
            this.fullTileInfo.textureIndex, this.fullTileInfo.padding);

        /**
         * @type {number}
         */
        this.borderSizeScale = borderSizeScale;

        /**
         * @type {number}
         */
        this.borderPaddingScale = borderPaddingScale;
    }

    drawNineSlice(pos, size, color) {
        drawNineSlice(pos, size, this.nineSliceTileInfo, color, this.getBorderSize());
    }

    /**
     * Fills the inner content of the nine-slice border.
     * @param {Vector2} pos 
     * @param {Vector2} size 
     * @param {Color} color 
     */
    fillNineSlice(pos, size, color) {
        drawRect(pos, size.subtract(vec2(this.getBorderPadding())), color);
    }

    getBorderSize() {
        return (this.fullTileInfo.size.x * this.borderSizeScale) / cameraScale;
    }

    getBorderPadding() {
        return (this.fullTileInfo.size.x * this.borderPaddingScale) / cameraScale;
    }
}

class BorderSetInfo {
    constructor(textureIndex) {

        const borderTemplateSize = 64;
        const columnCount = 10;
        const rowCount = 8;

        const createBorderInfo = (iRow, iCol, borderSizeScale, borderPaddingScale) => {

            const tilePos = vec2(
                (iCol * borderTemplateSize),
                (iRow * borderTemplateSize),
            );

            const tileInfo = new TileInfo(tilePos, vec2(borderTemplateSize), textureIndex);

            return new BorderInfo(tileInfo, 
                borderSizeScale || (1 / 3), 
                borderPaddingScale || (1 / 4),
            );
        };

        this.style00 = createBorderInfo(0, 0);
        this.style01 = createBorderInfo(0, 1);
        this.style02 = createBorderInfo(0, 2);
        this.style03 = createBorderInfo(0, 3);
        this.style04 = createBorderInfo(0, 4);
        this.style05 = createBorderInfo(0, 5);
        this.style06 = createBorderInfo(0, 6);
        this.style07 = createBorderInfo(0, 7);
        this.style08 = createBorderInfo(0, 8);
        this.style09 = createBorderInfo(0, 9);

        this.style10 = createBorderInfo(1, 0);
        this.style11 = createBorderInfo(1, 1, (1 / 4), (1 / 5));
        this.style12 = createBorderInfo(1, 2);
        this.style13 = createBorderInfo(1, 3);
        this.style14 = createBorderInfo(1, 4);
        this.style15 = createBorderInfo(1, 5);
        this.style16 = createBorderInfo(1, 6);
        this.style17 = createBorderInfo(1, 7);
        this.style18 = createBorderInfo(1, 8);
        this.style19 = createBorderInfo(1, 9);

        this.style20 = createBorderInfo(2, 0);
        this.style21 = createBorderInfo(2, 1);
        this.style22 = createBorderInfo(2, 2);
        this.style23 = createBorderInfo(2, 3);
        this.style24 = createBorderInfo(2, 4);
        this.style25 = createBorderInfo(2, 5);
        this.style26 = createBorderInfo(2, 6);
        this.style27 = createBorderInfo(2, 7);
        this.style28 = createBorderInfo(2, 8);
        this.style29 = createBorderInfo(2, 9);

        this.style30 = createBorderInfo(3, 0);
        this.style31 = createBorderInfo(3, 1);
        this.style32 = createBorderInfo(3, 2);
        this.style33 = createBorderInfo(3, 3);
        this.style34 = createBorderInfo(3, 4);
        this.style35 = createBorderInfo(3, 5);
        this.style36 = createBorderInfo(3, 6);
        this.style37 = createBorderInfo(3, 7);
        this.style38 = createBorderInfo(3, 8);
        this.style39 = createBorderInfo(3, 9);

        this.style40 = createBorderInfo(4, 0);
        this.style41 = createBorderInfo(4, 1);
        this.style42 = createBorderInfo(4, 2);
        this.style43 = createBorderInfo(4, 3);
        this.style44 = createBorderInfo(4, 4);
        this.style45 = createBorderInfo(4, 5);
        this.style46 = createBorderInfo(4, 6);
        this.style47 = createBorderInfo(4, 7);
        this.style48 = createBorderInfo(4, 8);
        this.style49 = createBorderInfo(4, 9);

        this.style50 = createBorderInfo(5, 0);
        this.style51 = createBorderInfo(5, 1);
        this.style52 = createBorderInfo(5, 2);
        this.style53 = createBorderInfo(5, 3);
        this.style54 = createBorderInfo(5, 4);
        this.style55 = createBorderInfo(5, 5);
        this.style56 = createBorderInfo(5, 6);
        this.style57 = createBorderInfo(5, 7);
        this.style58 = createBorderInfo(5, 8);
        this.style59 = createBorderInfo(5, 9);

        this.style60 = createBorderInfo(6, 0);
        this.style61 = createBorderInfo(6, 1);
        this.style62 = createBorderInfo(6, 2);
        this.style63 = createBorderInfo(6, 3);
        this.style64 = createBorderInfo(6, 4);
        this.style65 = createBorderInfo(6, 5);
        this.style66 = createBorderInfo(6, 6);
        this.style67 = createBorderInfo(6, 7);
        this.style68 = createBorderInfo(6, 8);
        this.style69 = createBorderInfo(6, 9);

        this.style70 = createBorderInfo(7, 0);
        this.style71 = createBorderInfo(7, 1);
        this.style72 = createBorderInfo(7, 2);
        this.style73 = createBorderInfo(7, 3);
        this.style74 = createBorderInfo(7, 4);
        this.style75 = createBorderInfo(7, 5);
        this.style76 = createBorderInfo(7, 6);
        this.style77 = createBorderInfo(7, 7);
        this.style78 = createBorderInfo(7, 8);
        this.style79 = createBorderInfo(7, 9);
    }
}

class SpriteAtlas {
    constructor() {
        
        this.bee = new TileInfo(vec2(0, 0), vec2(75, 59), 0);

        this.clouds = [
            new TileInfo(vec2(7, 12), vec2(62, 37), 1),
            new TileInfo(vec2(8, 55), vec2(34, 23), 1),
            new TileInfo(vec2(16, 86), vec2(41, 28), 1),
            new TileInfo(vec2(81, 24), vec2(30, 20), 1),
            new TileInfo(vec2(67, 55), vec2(50, 29), 1),
            new TileInfo(vec2(72, 92), vec2(31, 24), 1),
        ];

        this.bird = {
            body: new TileInfo(vec2(2, 22), vec2(51, 40), 2),
            head: new TileInfo(vec2(0, 0), vec2(18, 21), 2),
            face: new TileInfo(vec2(23, 2), vec2(13, 13), 2),
            eyelids: new TileInfo(vec2(24, 18), vec2(11, 4), 2),
            legs: new TileInfo(vec2(39, 0), vec2(29, 19), 2),            
        };

        this.ammo = {
            bee: new TileInfo(vec2(0, 0), vec2(15, 12), 3),
            bird: new TileInfo(vec2(17, 1), vec2(15, 10), 3),
        };

        this.owl = {
            body: new TileInfo(vec2(0, 0), vec2(190, 200), 4),
            frontWing: new TileInfo(vec2(189, 2), vec2(100, 110), 4),
            backWing: new TileInfo(vec2(292, 11), vec2(85, 75), 4),
        };

        this.honeycomb = new TileInfo(vec2(0, 0), vec2(45, 39), 5);

        this.gems = {
            red: new TileInfo(vec2(0, 0), vec2(16), 6),
            blue: new TileInfo(vec2(0, 0), vec2(16), 7),
            gold: new TileInfo(vec2(0, 0), vec2(16), 8),
        };

        this.borders = {
            flat: new BorderSetInfo(9),
        };
    }
}

/**
 * @type {SpriteAtlas}
 */
export let spriteAtlas;
export function initSpriteAtlas() {
    spriteAtlas = new SpriteAtlas();
}