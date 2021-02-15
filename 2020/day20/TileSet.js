class TileSet {
    constructor(config) {
        this.tiles = config;
        this.prepareTiles();
    }

    byId = id => this.tiles.filter(t => t.id == id)[0];

    prepareTiles = () => {
        const getAdjacentIds = tile => this.tiles
                .filter(t => t.id != tile.id)
                .filter(t => tile.footprints.some(fp => t.footprints.includes(fp)))
                .map(t => t.id)
        const getFootprints = data => [
                data[0].join(''), Array.from(data[9]).reverse().join(''), // top, bottom
                data.reduce((a,e,i) => a+data[9-i][0], ''), data.reduce((a,e,i) => a+e[9], '')] // left, right
                .map(s => parseInt(s, 2))
        this.tiles.map(t => t.data = t.data.map(d => d.split('')))
        this.tiles.map(t => t.footprints = [].concat(getFootprints(t.data), getFootprints(t.data.reverse()))) // add footprints for both sides
        this.tiles.map(t => t.adjacentIds = getAdjacentIds(t)) // t.adjacentIds.length: 2 = corner, 3 = side, 4 = inner
    }

    assignTiles = () => {
        const unplacedByAdjacent = (tilesIds, positions = [2,3,4]) => this.tiles
                .filter(t => !t.placed && positions.includes(t.adjacentIds.length) && tilesIds.every(id => t.adjacentIds.includes(id)))
        const assign = (x, y, tileId) => {
            if (!map[y]) map[y] = [];
            map[y][x] = tileId;
            this.byId(tileId).placed = true;
        }

        let map = [], cornerTiles = this.tiles.filter(t => t.adjacentIds.length == 2);
        console.log('corner tiles ids product', cornerTiles.reduce((a, t) => a*t.id, 1)); // p1

        assign(0, 0, cornerTiles[0].id); // 1st corner, defined as top left

        for (let i = 1; i < 12; i++) {
            assign(0, i, unplacedByAdjacent([map[i-1][0]], [2,3])[0].id);    
            assign(i, 0, unplacedByAdjacent([map[0][i-1]], [2,3])[0].id);    
        }

        for (let i = 1; i < 11; i++) {
            assign(11, i, unplacedByAdjacent([map[i-1][11]], [2,3])[0].id);    
            assign(i, 11, unplacedByAdjacent([map[11][i-1]], [2,3])[0].id);    
        }

        assign(11, 11, cornerTiles.filter(t => !t.placed)[0].id); // 4th corner, frame is done

        for (let y = 1; y < 11; y++)
            for (let x = 1; x < 11; x++)
                assign(x, y, unplacedByAdjacent([map[y-1][x], map[y][x-1]])[0].id)
       
        return map;
    }

    alignTiles = map => {
        const rotTile = tileId => this.byId(tileId).data = rotate(this.byId(tileId).data);
        const checkFit = (tileId, refTileId, mode) => {
            let tile = this.byId(tileId).data, refTile = this.byId(refTileId).data;
            // left: compare refTile's right col with tile's left col, top: compare refTile's bottom line with tile's top line
            return mode == 'left' ? refTile.every((l, i) => refTile[i][9] == tile[i][0]) : refTile[9].join('') == tile[0].join('');
        }

        const align = (tileId, refTileId, mode) => {
            for (let i = 0; i < 3; i++) if (!checkFit(tileId, refTileId, mode)) rotTile(tileId);
            if (!checkFit(tileId, refTileId, mode)) this.byId(tileId).data.reverse(); // flip
            while (!checkFit(tileId, refTileId, mode)) rotTile(tileId);
            return checkFit(tileId, refTileId, mode);
        }

        const alignTopLeft = () => {
            for (let i = 0; i < 3; i++) if (!checkFit(map[0][1], map[0][0], 'left') || !checkFit(map[1][0], map[0][0], 'top')) rotTile(map[0][0]);
            if (!checkFit(map[0][1], map[0][0], 'left') || !checkFit(map[1][0], map[0][0], 'top')) this.byId(map[0][0]).data.reverse(); // flip
            while (!checkFit(map[0][1], map[0][0], 'left') || !checkFit(map[1][0], map[0][0], 'top')) rotTile(map[0][0]);
        }

        const exportImage = (result = []) => {
            for (let y = 0; y < map.length; y++)
                for (let x = 0; x < map.length; x++)
                    this.byId(map[y][x]).data
                        .filter((l, id) => id != 0 && id != 9)
                        .map((line, id) => result[y*8+id] = (result[y*8+id] || '') + line.join('').substr(1, 8))
            return result.map(l => l = l.split(''));
        }

        if (!align(map[0][1], map[0][0], 'left') || !align(map[1][0], map[0][0], 'top')) alignTopLeft();
        for (let x = 1; x < map.length; x++) align(map[0][x], map[0][x-1], 'left');
        for (let y = 1; y < map.length; y++)
            for (let x = 0; x < map.length; x++) align(map[y][x], map[y-1][x], 'top');

        return exportImage();
    }

    process = () => this.alignTiles(this.assignTiles())
}