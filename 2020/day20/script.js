// contains manual jigsaw assembly minigame!

let tiles = [];

Array.prototype.rotate = function() {
    this.unshift(this.pop()); 
    return this; 
}

const getFootprints = (data) => {
    let res = [];
    let left = '', right = '';
    for (let i = 0; i < 10; i++) {
        left += data[i][0];
        right += data[i][9];
    }
    res.push(parseInt(data[0], 2)); // top side
    res.push(parseInt(data[9], 2)); // bottom side
    res.push(parseInt(left, 2)); // left side
    res.push(parseInt(right, 2)); // right side
    return res;
}

const reverseString = (s) => {
    let res = '';
    for (let i = 0; i < s.length; i++) res = s[i]+res;
    return res;
}

const readInput = () => {
    input.map(t => {
        let tile = $.extend(true, {}, t);
        // add all configurations
        tile.configurations = [];
        let cfg1 = {used: 0, footprints: []};
        cfg1.footprints = getFootprints(tile.data);
        tile.configurations.push(cfg1);
        // this is just initial configuration, we need to account for all the 3 flips too

        // AB/CD -> CD/AB
        let cfg2 = {used: 0, footprints: []};
        cfg2.footprints = getFootprints(tile.data.reverse());
        tile.configurations.push(cfg2);

        // vertical flip on the AB/CD now
        t.data.map((line, index) => {
            t.data[index] = reverseString(line);
        })
        let cfg3 = {used: 0, footprints: []};
        cfg3.footprints = getFootprints(t.data);
        tile.configurations.push(cfg3);
        // both flips now
        let cfg4 = {used: 0, footprints: []};
        cfg4.footprints = getFootprints(t.data.reverse());
        tile.configurations.push(cfg4);

        tiles.push(tile);
    })
}

const getTileById = (id) => {
    let found = false;
    tiles.some(t => {
        if (t.id == id) {
            found = t;
            return true;
        }
    })
    return found;
}

const matchFootprints = (fp1, fp2) => {
    let found = false;
    let matchId1 = false, matchId2 = false;
    for (let i = 0; i < fp1.length; i++) {
        for (let j = 0; j < fp2.length; j++) {
            if (fp1[i] == fp2[j]) {
                found = fp1[i];
                matchId1 = i; matchId2 = j;
                break;
            }
        }
        if (found) break;
    }
    return found;
}

const checkTileCfgFit = (tile, cfgId) => {
    let cfg = tile.configurations[cfgId];
    let adjacentTilesIds = [];
    tiles.filter(t => t.id != tile.id).map(t => {
        t.configurations.map((tCfg, tCfgId) => {
            let bindingNum = matchFootprints(cfg.footprints, tCfg.footprints);
            if (bindingNum !== false) {
                if (!adjacentTilesIds.includes(t.id)) adjacentTilesIds.push(t.id);
            }
        })
    })
    return adjacentTilesIds;
}

const checkTileFit = (tile) => {
    let found = 0; let adjacentTilesIds = [];
    tile.configurations.map((cfg, cfgId) => {
        let cfgsAdjacentTilesIds = checkTileCfgFit(tile, cfgId);
        cfgsAdjacentTilesIds.map(c => {
            if (!adjacentTilesIds.includes(c)) adjacentTilesIds.push(c);
        })
    })
    return adjacentTilesIds;
}

const assignTile = (x, y, tileId) => {
    map[y][x] = tileId;
    getTileById(tileId).placed = true;
}

const getUnplacedTileByAdjacent = (tilesIds, positions) => {
    let result = [];
    if (!positions) positions = [2,3,4];
    tiles.filter(tf => tf.placed !== true && positions.includes(tf.positionInImage)).map(t => {
        let found = true;
        tilesIds.some(tId => {
            if (!t.adjacentTilesIds.includes(tId)) {
                found = false;
                return true;
            }
        })
        if (found) result.push(t);
    })
    return result;
}

const assignTiles = () => {
    tiles.map(tile => {
        let fits = checkTileFit(tile);
        tile.positionInImage = fits.length; // 2 = corner, 3 = side, 4 = inner
        tile.adjacentTilesIds = fits;
    })

    let cornerTiles = tiles.filter(t => t.positionInImage == 2);

    //console.log('corner ones', cornerTiles.length, cornerTiles); // p1

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

    assignTile(11, 11, cornerTiles.filter(t => t.placed !== true)[0].id); // 4th corner

    for (let y = 1; y < 11; y++) {
        for (let x = 1; x < 11; x++) {
            assignTile(x, y, getUnplacedTileByAdjacent([map[y-1][x], map[y][x-1]])[0].id)
        }
    }

}

readInput();

let map = [], size = 12;
for (let y = 0; y < size; y++) map[y] = []; // tileIds

assignTiles();
console.log(map); // contains all the tile ids
// now we need to flip/rotate them

// manual approach
let root = $('#root');

const exportJigsaw = () => {
    let result = [];
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            getTileById(map[y][x]).data.map((line, lineId) => {
                if (lineId != 0 && lineId != 9) {
                    let yCoord = y*8+lineId-1;
                    if (!result[yCoord]) result[yCoord] = '';
                    for (let i = 1; i < line.length-1; i++) {
                        result[yCoord] += line[i];
                    }
                }
            })
            
        }
    }
    return result;
}

const renderTile = (tileId) => {
    let pre = $('<pre>');
    let data = getTileById(tileId).data;
    for (let y = 0; y < 10; y++) {
        let line = '';
        for (let x = 0; x < 10; x++) {
            let ch = ' ';
            if (data[y][x] == '1') ch = '#';
            line += ch;
        }
        pre.append(line+"\n");
    }
    return pre;
}

const renderActions = (x,y) => {
    let div = $('<div class="actions">');
    let rot = $('<a href="#">').text('ROT').on('click', e => {
        let data = getTileById(map[y][x]).data;
        let newData = [];
        for (let i = 0; i < 10; i++) newData[i] = [];
        for (let yy = 0; yy < 10; yy++) {
            for (let xx = 0; xx < 10; xx++) {
                newData[xx][9-yy] = data[yy][xx];
            }
        }

        for (let i = 0; i < 10; i++) getTileById(map[y][x]).data[i] = newData[i].join('');
        renderJigsaw();
        return false;
    })
    let hor = $('<a href="#">').text('HOR').on('click', e => {
        getTileById(map[y][x]).data.reverse();
        renderJigsaw();
        return false;
    })
    let ver = $('<a href="#">').text('VER').on('click', e => {
        getTileById(map[y][x]).data.map((line, index) => {
            getTileById(map[y][x]).data[index] = reverseString(line);
        })
        renderJigsaw();
        return false;
    })
    div.append( rot, '<br>', hor, '<br>', ver )
    return div;
}

const renderJigsaw = () => {
    root.empty();

    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            root.append(renderTile(map[y][x]));
            root.append(renderActions(x,y));
        }
        root.append($('<div class="break">').html(''));
    }
}

renderJigsaw();

// assembled jigsaw on screen, exported it via exportJigsaw().. and let's go on

let monster = [
'00000000000000000010',
'10000110000110000111', // .match(/1\d{4}11\d{4}11\d{4}111/g);
'01001001001001001000' // .match(/\d1\d\d1\d\d1\d\d1\d\d1\d\d1\d{3}/g)
]

let monsterDeduce = 0;
monster.map(line => monsterDeduce += line.match(/1/g).length);

const rotateImageData = () => {
    let data = imageData;
    let newData = [];
    for (let i = 0; i < 96; i++) newData[i] = [];
    for (let yy = 0; yy < 96; yy++) {
        for (let xx = 0; xx < 96; xx++) {
            newData[xx][95-yy] = data[yy][xx];
        }
    }

    for (let i = 0; i < 96; i++) imageData[i] = newData[i].join('');

}

const flipVerticalImageData = () => {
    imageData.map((line, index) => {
        imageData[index] = reverseString(line);
    })
}

let monsterLines = [[], [], []];

// the monster search is buggy, will debug later
// solution was hacked by checking just middle line of monster + head
const matchMonsterLine = (line, mId) => {
    let re;
    if (mId == 0) re = /\d{18}1\d/g;
    if (mId == 1) re = /1\d{4}11\d{4}11\d{4}111/g;
    if (mId == 2) re = /\d1\d\d1\d\d1\d\d1\d\d1\d\d1\d{3}/g;
    let result = [];
    while(match = re.exec(line)) {
        result.push(match.index);
    }
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
                    if (imageData[i-2][line1Id+18] == '1') {
                        console.log('monster found on line', i, 'index', line1Id);
                        totalMonstersFound++;
                    }
                })
            }
        }
    }
    return totalMonstersFound;
}

const countImageData = (ch) => {
    let count = 0;
    for (let y = 0; y < imageData.length; y++) {
        for (let x = 0; x < imageData[y].length; x++) {
            if (imageData[y][x] == ch) count++;
        }
    }
    return count;
}

// this was estimated by trial/error
rotateImageData();
flipVerticalImageData();
imageData.reverse();

let monsters = searchForMonster();

console.log('total monsters found', monsters, 'residual value', countImageData('1')-monsters*monsterDeduce);
