const rotateImage = data => {
    let newData = [], len = data.length;
    for (let i = 0; i < len; i++) newData[i] = [];
    for (let y = 0; y < len; y++)
        for (let x = 0; x < len; x++) newData[x][(len-1)-y] = data[y][x];
    return newData.map(line => line.join(''));
}

const matchArray = (arr1, arr2) => arr1.every(e => arr2.includes(e)) // arr1 is subset of arr2
const countCharsInArray = (arr, ch = '1') => arr.join('').split('').filter(c => c == ch).length
const tileById = id => tiles.filter(t => t.id == id)[0]

const assignTiles = () => {
    const getFootprints = data => {
        let res = [], left = '', right = '';
        for (let i = 0; i < 10; i++) {
            left += data[9-i][0];
            right += data[i][9];
        }
        return [data[0], data[9].split('').reverse().join(''), left, right].map(s => parseInt(s, 2))
    }

    const getAdjacentIds = tile => tiles
            .filter(t => t.id != tile.id)
            .filter(t => tile.footprints.some(fp => t.footprints.includes(fp)))
            .map(t => t.id)
    const unplacedByAdjacent = (tilesIds, positions = [2,3,4]) => tiles
            .filter(t => !t.placed && positions.includes(t.adjacentIds.length) && matchArray(tilesIds, t.adjacentIds))

    const assign = (x, y, tileId) => {
        if (!map[y]) map[y] = [];
        map[y][x] = tileId;
        tileById(tileId).placed = true;
    }

    tiles.map(t => t.footprints = [].concat(getFootprints(t.data), getFootprints(t.data.reverse()))) // add footprints for both sides
    tiles.map(t => t.adjacentIds = getAdjacentIds(t)) // t.adjacentIds.length: 2 = corner, 3 = side, 4 = inner

    let map = [], cornerTiles = tiles.filter(t => t.adjacentIds.length == 2);
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

const alignTiles = map => {
    const rotate = tileId => tileById(tileId).data = rotateImage(tileById(tileId).data);
    const checkFit = (tileId, refTileId, mode) => {
        let tile = tileById(tileId).data, refTile = tileById(refTileId).data;
        // left: compare refTile's right col with tile's left col, top: compare refTile's bottom line with tile's top line
        return mode == 'left' ? refTile.every((l, i) => refTile[i][9] == tile[i][0]) : refTile[9] == tile[0];
    }

    const align = (tileId, refTileId, mode) => {
        for (let i = 0; i < 3; i++) if (!checkFit(tileId, refTileId, mode)) rotate(tileId);
        if (!checkFit(tileId, refTileId, mode)) tileById(tileId).data.reverse(); // flip
        for (let i = 0; i < 3; i++) if (!checkFit(tileId, refTileId, mode)) rotate(tileId);
        return checkFit(tileId, refTileId, mode);
    }

    const alignTopLeft = () => {
        for (let i = 0; i < 3; i++) if (!checkFit(map[0][1], map[0][0], 'left') || !checkFit(map[1][0], map[0][0], 'top')) rotate(map[0][0]);
        if (!checkFit(map[0][1], map[0][0], 'left') || !checkFit(map[1][0], map[0][0], 'top')) tileById(map[0][0]).data.reverse(); // flip
        for (let i = 0; i < 3; i++) if (!checkFit(map[0][1], map[0][0], 'left') || !checkFit(map[1][0], map[0][0], 'top')) rotate(map[0][0]);
    }

    const compileImageData = () => {
        let result = [];
        for (let y = 0; y < map.length; y++)
            for (let x = 0; x < map.length; x++)
                tileById(map[y][x]).data
                    .filter((l, id) => id != 0 && id != 9)
                    .map((line, id) => result[y*8+id] = (result[y*8+id] || '') + line.substr(1, 8))
        return result;
    }

    if (!align(map[0][1], map[0][0], 'left') || !align(map[1][0], map[0][0], 'top')) alignTopLeft();
    for (let x = 1; x < map.length; x++) align(map[0][x], map[0][x-1], 'left');
    for (let y = 1; y < map.length; y++)
        for (let x = 0; x < map.length; x++) align(map[y][x], map[y-1][x], 'top');

    return compileImageData(map);
}

const processImageData = imageData => {
    const monster = ['00000000000000000010', '10000110000110000111', '01001001001001001000'];
    const matchMonsterLine = (line, mId) => {
        let re, result = [];
        if (mId == 1) re = /1\d{4}11\d{4}11\d{4}111/g;
        if (mId == 2) re = /\d1\d\d1\d\d1\d\d1\d\d1\d\d1\d{3}/g;
        while (match = re.exec(line)) result.push(match.index);
        return result;
    }

    const searchForMonster = () => {
        let totalMonstersFound = 0;
        for (let i = 2; i < imageData.length; i++)
            if (matchMonsterLine(imageData[i], 2).length > 0)
                matchMonsterLine(imageData[i-1], 1).map(line1Id => imageData[i-2][line1Id+18] == '1' && totalMonstersFound++)
        return totalMonstersFound;
    }

    for (let i = 0; i < 3; i++) if (searchForMonster() == 0) imageData = rotateImage(imageData);
    if (searchForMonster() == 0) imageData.reverse(); // flip
    for (let i = 0; i < 3; i++) if (searchForMonster() == 0) imageData = rotateImage(imageData);

    return countCharsInArray(imageData)-searchForMonster()*countCharsInArray(monster);
}

console.log('water roughness', processImageData(alignTiles(assignTiles())));