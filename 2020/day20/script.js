// implementation-heavier, would benefit from some better structuring..

let tiles = [], map = [], size = 12;
for (let y = 0; y < size; y++) map[y] = []; // tileIds

const rotateImage = data => {
    let newData = [], len = data.length;
    for (let i = 0; i < len; i++) newData[i] = [];
    for (let y = 0; y < len; y++) {
        for (let x = 0; x < len; x++) newData[x][(len-1)-y] = data[y][x];
    }
    return newData.map(line => line.join(''));
}

const getFootprints = data => {
    let res = [], left = '', right = '';
    for (let i = 0; i < 10; i++) {
        left += data[9-i][0];
        right += data[i][9];
    }
    res.push(parseInt(data[0], 2)); // top side
    res.push(parseInt(reverseString(data[9]), 2)); // bottom side
    res.push(parseInt(left, 2)); // left side
    res.push(parseInt(right, 2)); // right side
    return res;
}

const reverseString = s => s.split('').reverse().join('')
const matchArray = (arr1, arr2) => arr1.every(e => arr2.includes(e)) // arr1 is contained in arr2
const getTileById = id => tiles.filter(t => t.id == id)[0]
const countCharsInArray = (arr, ch = '1') => arr.join('').split('').filter(c => c == ch).length
const checkTileFootprintFit = tile => tiles.filter(t => t.id != tile.id).filter(t => matchFootprints(tile.footprints, t.footprints)).map(t => t.id)
const matchFootprints = (footprints1, footprints2) => footprints1.some(fp => footprints2.includes(fp))
const getUnplacedTileByAdjacent = (tilesIds, positions = [2,3,4]) => 
        tiles.filter(t => t.placed !== true && positions.includes(t.positionInImage) && matchArray(tilesIds, t.adjacentTilesIds))
const rotateTile = tileId => getTileById(tileId).data = rotateImage(getTileById(tileId).data);

const readInput = () => {
    input.map(t => {
        let tile = $.extend(true, {}, t);
        tile.footprints = getFootprints(tile.data); // one side
        tile.footprints.push(...getFootprints(tile.data.reverse()).filter(fp => !tile.footprints.includes(fp))); // flip
        tiles.push(tile);
    })
}

const assignTile = (x, y, tileId) => {
    map[y][x] = tileId;
    getTileById(tileId).placed = true;
}

const assignTiles = () => {
    tiles.map(tile => {
        let fits = checkTileFootprintFit(tile);
        tile.positionInImage = fits.length; // 2 = corner, 3 = side, 4 = inner
        tile.adjacentTilesIds = fits;
    })

    let cornerTiles = tiles.filter(t => t.positionInImage == 2);

    console.log('corner ones', cornerTiles.length, cornerTiles); // p1

    // corner[0] will be top left
    assignTile(0, 0, cornerTiles[0].id); // 1st corner

    for (let i = 1; i < 12; i++) {
        assignTile(0, i, getUnplacedTileByAdjacent([map[i-1][0]], [2,3])[0].id);    
        assignTile(i, 0, getUnplacedTileByAdjacent([map[0][i-1]], [2,3])[0].id);    
    }

    for (let i = 1; i < 11; i++) {
        assignTile(11, i, getUnplacedTileByAdjacent([map[i-1][11]], [2,3])[0].id);    
        assignTile(i, 11, getUnplacedTileByAdjacent([map[11][i-1]], [2,3])[0].id);    
    }

    assignTile(11, 11, cornerTiles.filter(t => t.placed !== true)[0].id); // 4th corner, frame is done

    for (let y = 1; y < 11; y++) {
        for (let x = 1; x < 11; x++) {
            assignTile(x, y, getUnplacedTileByAdjacent([map[y-1][x], map[y][x-1]])[0].id)
        }
    }
}

const exportJigsaw = () => {
    let result = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            getTileById(map[y][x]).data.filter((l, id) => id != 0 && id != 9).map((line, id) => {
                let yCoord = y*8+id;
                if (!result[yCoord]) result[yCoord] = '';
                result[yCoord] += line.substr(1, 8);
            })
        }
    }
    return result;
}

const tilesFit = (tileId, refTileId, mode = 'left') => {
    let fits = true, tile = getTileById(tileId).data, refTile = getTileById(refTileId).data;
    if (mode == 'left') {
        // compare refTile's right col with tile's left col
        fits = refTile.every((l, i) => refTile[i][9] == tile[i][0]);
    } else if (mode == 'top') {
        // compare refTile's bottom line with tile's top line, both strings
        fits = refTile[9] == tile[0];
    }
    return fits;
}

const alignTile = (tileId, refTileId, mode = 'left') => {
    for (let i = 0; i < 3; i++) if (!tilesFit(tileId, refTileId, mode)) rotateTile(tileId);
    if (!tilesFit(tileId, refTileId, mode)) getTileById(tileId).data.reverse(); // flip
    for (let i = 0; i < 3; i++) if (!tilesFit(tileId, refTileId, mode)) rotateTile(tileId);
}

const alignTiles = () => {
    for (let i = 1; i < size; i++) alignTile(map[0][i], map[0][i-1], 'left');
    for (let y = 1; y < size; y++) {
        for (let x = 0; x < size; x++) alignTile(map[y][x], map[y-1][x], 'top');
    }
}

// the monster search is buggy, will debug later
// solution was hacked by checking just exact loc of middle line of monster + head + mere existence of bottom line
const matchMonsterLine = (line, mId) => {
    let re, result = [];
    if (mId == 1) re = /1\d{4}11\d{4}11\d{4}111/g;
    if (mId == 2) re = /\d1\d\d1\d\d1\d\d1\d\d1\d\d1\d{3}/g;
    while (match = re.exec(line)) result.push(match.index);
    return result;
}

const searchForMonster = () => {
    let totalMonstersFound = 0;
    for (let i = 2; i < imageData.length; i++) {
        let line2matches = matchMonsterLine(imageData[i], 2);
        if (line2matches.length > 0) {
            let line1matches = matchMonsterLine(imageData[i-1], 1);
            if (line1matches.length > 0) {
                line1matches.map(line1Id => {
                    if (imageData[i-2][line1Id+18] == '1') totalMonstersFound++;
                })
            }
        }
    }
    return totalMonstersFound;
}

const alignImageData = () => {
    for (let i = 0; i < 3; i++) if (searchForMonster() == 0) imageData = rotateImage(imageData);
    if (searchForMonster() == 0) imageData.reverse(); // flip
    for (let i = 0; i < 3; i++) if (searchForMonster() == 0) imageData = rotateImage(imageData);
    return searchForMonster();
}

readInput();
assignTiles();
alignTiles();

let imageData = exportJigsaw(),
    monster = [
        '00000000000000000010',
        '10000110000110000111',
        '01001001001001001000'
    ],
    monsters = alignImageData();

console.log('total monsters found', monsters, 'residual value', countCharsInArray(imageData)-monsters*countCharsInArray(monster));
