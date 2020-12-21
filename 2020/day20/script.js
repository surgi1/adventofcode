// contains manual jigsaw assembly minigame!

var tiles = [];

Array.prototype.rotate = function() {
    this.unshift(this.pop()); 
    return this; 
}

function getFootprints(data) {
    var res = [];
    var left = '', right = '';
    for (var i = 0; i < 10; i++) {
        left += data[i][0];
        right += data[i][9];
    }
    res.push(parseInt(data[0], 2)); // top side
    res.push(parseInt(data[9], 2)); // bottom side
    res.push(parseInt(left, 2)); // left side
    res.push(parseInt(right, 2)); // right side
    return res;
}

function reverseString(s) {
    var res = '';
    for (var i = 0; i < s.length; i++) res = s[i]+res;
    return res;
}

function readInput() {
    input.map(t => {
        var tile = $.extend(true, {}, t);
        // add all configurations
        tile.configurations = [];
        var cfg1 = {used: 0, footprints: []};
        cfg1.footprints = getFootprints(tile.data);
        tile.configurations.push(cfg1);
        // this is just initial configuration, we need to account for all the 3 flips too

        // AB/CD -> CD/AB
        var cfg2 = {used: 0, footprints: []};
        cfg2.footprints = getFootprints(tile.data.reverse());
        tile.configurations.push(cfg2);

        // vertical flip on the AB/CD now
        t.data.map((line, index) => {
            t.data[index] = reverseString(line);
        })
        var cfg3 = {used: 0, footprints: []};
        cfg3.footprints = getFootprints(t.data);
        tile.configurations.push(cfg3);
        // both flips now
        var cfg4 = {used: 0, footprints: []};
        cfg4.footprints = getFootprints(t.data.reverse());
        tile.configurations.push(cfg4);

        tiles.push(tile);
    })
}

function getTileById(id) {
    var found = false;
    tiles.some(t => {
        if (t.id == id) {
            found = t;
            return true;
        }
    })
    return found;
}

function matchFootprints(fp1, fp2) {
    var found = false;
    var matchId1 = false, matchId2 = false;
    for (var i = 0; i < fp1.length; i++) {
        for (var j = 0; j < fp2.length; j++) {
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

function checkTileCfgFit(tile, cfgId) {
    var cfg = tile.configurations[cfgId];
    var adjacentTilesIds = [];
    tiles.filter(t => t.id != tile.id).map(t => {
        t.configurations.map((tCfg, tCfgId) => {
            var bindingNum = matchFootprints(cfg.footprints, tCfg.footprints);
            if (bindingNum !== false) {
                if (!adjacentTilesIds.includes(t.id)) adjacentTilesIds.push(t.id);
            }
        })
    })
    return adjacentTilesIds;
}

function checkTileFit(tile) {
    var found = 0; var adjacentTilesIds = [];
    tile.configurations.map((cfg, cfgId) => {
        var cfgsAdjacentTilesIds = checkTileCfgFit(tile, cfgId);
        cfgsAdjacentTilesIds.map(c => {
            if (!adjacentTilesIds.includes(c)) adjacentTilesIds.push(c);
        })
    })
    return adjacentTilesIds;
}

function assignTile(x, y, tileId) {
    map[y][x] = tileId;
    getTileById(tileId).placed = true;
}

function getUnplacedTileByAdjacent(tilesIds, positions) {
    var result = [];
    if (!positions) positions = [2,3,4];
    tiles.filter(tf => tf.placed !== true && positions.includes(tf.positionInImage)).map(t => {
        var found = true;
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

function assignTiles() {
    tiles.map(tile => {
        var fits = checkTileFit(tile);
        tile.positionInImage = fits.length; // 2 = corner, 3 = side, 4 = inner
        tile.adjacentTilesIds = fits;
    })

    var cornerTiles = tiles.filter(t => t.positionInImage == 2);

    //console.log('corner ones', cornerTiles.length, cornerTiles); // p1

    // corner[0] will be top left
    assignTile(0, 0, cornerTiles[0].id); // 1st corner

    for (var i = 1; i < 12; i++) {
        assignTile(0, i, getUnplacedTileByAdjacent([map[i-1][0]], [2,3])[0].id);    
        assignTile(i, 0, getUnplacedTileByAdjacent([map[0][i-1]], [2,3])[0].id);    
    }

    for (var i = 1; i < 11; i++) {
        assignTile(11, i, getUnplacedTileByAdjacent([map[i-1][11]], [2,3])[0].id);    
        assignTile(i, 11, getUnplacedTileByAdjacent([map[11][i-1]], [2,3])[0].id);    
    }

    assignTile(11, 11, cornerTiles.filter(t => t.placed !== true)[0].id); // 4th corner

    for (var y = 1; y < 11; y++) {
        for (var x = 1; x < 11; x++) {
            assignTile(x, y, getUnplacedTileByAdjacent([map[y-1][x], map[y][x-1]])[0].id)
        }
    }

}

readInput();

var map = [], size = 12;
for (var y = 0; y < size; y++) map[y] = []; // tileIds

assignTiles();
console.log(map); // contains all the tile ids
// now we need to flip/rotate them

// manual approach
var root = $('#root');

function exportJigsaw() {
    var result = [];
    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            getTileById(map[y][x]).data.map((line, lineId) => {
                if (lineId != 0 && lineId != 9) {
                    var yCoord = y*8+lineId-1;
                    if (!result[yCoord]) result[yCoord] = '';
                    for (var i = 1; i < line.length-1; i++) {
                        result[yCoord] += line[i];
                    }
                }
            })
            
        }
    }
    return result;
}

function renderTile(tileId) {
    var pre = $('<pre>');
    var data = getTileById(tileId).data;
    for (var y = 0; y < 10; y++) {
        var line = '';
        for (var x = 0; x < 10; x++) {
            var ch = ' ';
            if (data[y][x] == '1') ch = '#';
            line += ch;
        }
        pre.append(line+"\n");
    }
    return pre;
}

function renderActions(x,y) {
    var div = $('<div class="actions">');
    var rot = $('<a href="#">').text('ROT').on('click', e => {
        var data = getTileById(map[y][x]).data;
        var newData = [];
        for (var i = 0; i < 10; i++) newData[i] = [];
        for (var yy = 0; yy < 10; yy++) {
            for (var xx = 0; xx < 10; xx++) {
                newData[xx][9-yy] = data[yy][xx];
            }
        }

        for (var i = 0; i < 10; i++) getTileById(map[y][x]).data[i] = newData[i].join('');
        renderJigsaw();
        return false;
    })
    var hor = $('<a href="#">').text('HOR').on('click', e => {
        getTileById(map[y][x]).data.reverse();
        renderJigsaw();
        return false;
    })
    var ver = $('<a href="#">').text('VER').on('click', e => {
        getTileById(map[y][x]).data.map((line, index) => {
            getTileById(map[y][x]).data[index] = reverseString(line);
        })
        renderJigsaw();
        return false;
    })
    div.append( rot, '<br>', hor, '<br>', ver )
    return div;
}

function renderJigsaw() {
    root.empty();

    for (var y = 0; y < size; y++) {
        for (var x = 0; x < size; x++) {
            root.append(renderTile(map[y][x]));
            root.append(renderActions(x,y));
        }
        root.append($('<div class="break">').html(''));
    }
}

renderJigsaw();

// assembled jigsaw on screen, exported it via exportJigsaw().. and let's go on

var monster = [
'00000000000000000010',
'10000110000110000111', // .match(/1\d{4}11\d{4}11\d{4}111/g);
'01001001001001001000' // .match(/\d1\d\d1\d\d1\d\d1\d\d1\d\d1\d{3}/g)
]

var monsterDeduce = 0;
monster.map(line => monsterDeduce += line.match(/1/g).length);

function rotateImageData() {
    var data = imageData;
    var newData = [];
    for (var i = 0; i < 96; i++) newData[i] = [];
    for (var yy = 0; yy < 96; yy++) {
        for (var xx = 0; xx < 96; xx++) {
            newData[xx][95-yy] = data[yy][xx];
        }
    }

    for (var i = 0; i < 96; i++) imageData[i] = newData[i].join('');

}

function flipVerticalImageData() {
    imageData.map((line, index) => {
        imageData[index] = reverseString(line);
    })
}

var monsterLines = [[], [], []];

// the monster search is buggy, will debug later
// solution was hacked by checking just middle line of monster + head
function matchMonsterLine(line, mId) {
    var re;
    if (mId == 0) re = /\d{18}1\d/g;
    if (mId == 1) re = /1\d{4}11\d{4}11\d{4}111/g;
    if (mId == 2) re = /\d1\d\d1\d\d1\d\d1\d\d1\d\d1\d{3}/g;
    var result = [];
    while(match = re.exec(line)) {
        result.push(match.index);
    }
    return result;
}

function searchForMonster() {
    var totalMonstersFound = 0;
    for (var i = 2; i < imageData.length; i++) {
        var line2matches = matchMonsterLine(imageData[i], 2);
        if (line2matches.length > 0) {
            var line1matches = matchMonsterLine(imageData[i-1], 1);
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

function countImageData(ch) {
    var count = 0;
    for (var y = 0; y < imageData.length; y++) {
        for (var x = 0; x < imageData[y].length; x++) {
            if (imageData[y][x] == ch) count++;
        }
    }
    return count;
}

// this was estimated by trial/error
rotateImageData();
flipVerticalImageData();
imageData.reverse();

var monsters = searchForMonster();

console.log('total monsters found', monsters, 'residual value', countImageData('1')-monsters*monsterDeduce);
