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

function checkFit(tile) {
    tile.configurations.map((cfg, cfgId) => {
        console.log('checking tile', tile.id, 'cfg index', cfgId);
        // TODO
        // lets try to find this tile a perfect fit, 4 another tiles that in some config fit it
    })
}

// once we have all the configurations for all the tiles, we need to map those numbers together
// the tiles whose one of the configurations has 2 footprints used exactly once are the corner tiles

readInput();
console.log('tiles', tiles);
