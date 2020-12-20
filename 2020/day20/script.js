var tiles = [];

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
    //console.log('match fp', fp1, fp2);
    for (var i = 0; i < 4; i++) {
        for (var j = 0; j < 4; j++) {
            if (fp1[i] == fp2[j]) {
                found = true;
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
            //console.log('t', tCfg, tCfgId);console.log('tile', tCfg, tCfgId);
            if (matchFootprints(cfg.footprints, tCfg.footprints)) {
                //console.log('tile id', tile.id, 'its respective configuration id', cfgId, 'can be placed next to tile id', t.id, 'in its configurations id', tCfgId);
                if (!adjacentTilesIds.includes(t.id)) adjacentTilesIds.push(t.id);
            }
        })
    })
    return adjacentTilesIds;
}

function checkTileFit(tile) {
    var found = 0; var adjacentTilesIds = [];
    tile.configurations.map((cfg, cfgId) => {
        //console.log('checking tile', tile.id, 'cfg index', cfgId);
        var cfgsAdjacentTilesIds = checkTileCfgFit(tile, cfgId);
        cfgsAdjacentTilesIds.map(c => {
            if (!adjacentTilesIds.includes(c)) adjacentTilesIds.push(c);
        })
        // todo switch matched tiles to found states and move on
    })
    return adjacentTilesIds;
}

// once we have all the configurations for all the tiles, we need to map those numbers together
// the tiles whose one of the configurations has 2 footprints used exactly once are the corner tiles

readInput();
console.log('tiles', tiles);

var cornerOnes = [];

tiles.map(tile => {
    var fits = checkTileFit(tile);
    tile.positionInImage = fits.length; // 2 = corner, 3 = side, 4 = inner
    tile.adjacentTilesIds = fits;
})

console.log('corner ones', tiles.filter(t => t.positionInImage == 2)); // p1