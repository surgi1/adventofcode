// implementation-heavier, would benefit from some better structuring..

let map = [], size = 12;
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
    return [data[0], reverseString(data[9]), left, right].map(s => parseInt(s, 2))
}

const reverseString = s => s.split('').reverse().join('')
const matchArray = (arr1, arr2) => arr1.every(e => arr2.includes(e)) // arr1 is contained in arr2
const tileById = id => tiles.filter(t => t.id == id)[0]
const countCharsInArray = (arr, ch = '1') => arr.join('').split('').filter(c => c == ch).length
const checkTileFootprintFit = tile => tiles
        .filter(t => t.id != tile.id)
        .filter(t => matchFootprints(tile.footprints, t.footprints))
        .map(t => t.id)
const matchFootprints = (footprints1, footprints2) => footprints1.some(fp => footprints2.includes(fp))
const getUnplacedTileByAdjacent = (tilesIds, positions = [2,3,4]) => tiles
        .filter(t => t.placed !== true && positions.includes(t.positionInImage) && matchArray(tilesIds, t.adjacentTilesIds))
const rotateTile = tileId => tileById(tileId).data = rotateImage(tileById(tileId).data);
const addFootprints = () => tiles.map(t => t.footprints = [].concat(getFootprints(t.data), getFootprints(t.data.reverse()))) // both sides

const assignTile = (x, y, tileId) => {
    map[y][x] = tileId;
    tileById(tileId).placed = true;
}

const assignTiles = () => {
    tiles.map(tile => {
        let fits = checkTileFootprintFit(tile);
        tile.positionInImage = fits.length; // 2 = corner, 3 = side, 4 = inner
        tile.adjacentTilesIds = fits;
    })

    let cornerTiles = tiles.filter(t => t.positionInImage == 2);
    console.log('corner tiles', cornerTiles.length, cornerTiles); // p1

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

    for (let y = 1; y < 11; y++)
        for (let x = 1; x < 11; x++)
            assignTile(x, y, getUnplacedTileByAdjacent([map[y-1][x], map[y][x-1]])[0].id)
}

const exportJigsaw = () => {
    let result = [];
    for (let y = 0; y < size; y++)
        for (let x = 0; x < size; x++)
            tileById(map[y][x]).data
                .filter((l, id) => id != 0 && id != 9)
                .map((line, id) => result[y*8+id] = (result[y*8+id] || '') + line.substr(1, 8))
    return result;
}

const tilesFit = (tileId, refTileId, mode = 'left') => {
    let fits = true, tile = tileById(tileId).data, refTile = tileById(refTileId).data;
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
    if (!tilesFit(tileId, refTileId, mode)) tileById(tileId).data.reverse(); // flip
    for (let i = 0; i < 3; i++) if (!tilesFit(tileId, refTileId, mode)) rotateTile(tileId);
}

const alignTiles = () => {
    for (let i = 1; i < size; i++) alignTile(map[0][i], map[0][i-1], 'left');
    for (let y = 1; y < size; y++) {
        for (let x = 0; x < size; x++) alignTile(map[y][x], map[y-1][x], 'top');
    }
}

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
        if (matchMonsterLine(imageData[i], 2).length > 0) {
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

addFootprints();
assignTiles();
alignTiles();

let imageData = exportJigsaw(), monsters = alignImageData(),
    monster = ['00000000000000000010',
               '10000110000110000111',
               '01001001001001001000'];

console.log('total monsters found', monsters, ', water roughness', countCharsInArray(imageData)-monsters*countCharsInArray(monster));
