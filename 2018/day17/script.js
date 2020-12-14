
var data = [], map = [], mapInitialized = false, water = [], maxY = 0, minY = 1000;

function readInput() {
    input.map(s => {
        var tmp = {};
        var pars = s.split(', ');
        pars.map(par => {
            var subpars = par.split('=');
            var dat;
            if (subpars[1].indexOf('..') >= 0) {
                dat = subpars[1].split('..').map(i => i = parseInt(i));
            } else {
                dat = parseInt(subpars[1]);
            }
            tmp[subpars[0]] = dat;
        })
        data.push(tmp);
    })
}

function addMapPoint(x,y,type) {
    if (y > maxY) maxY = y;
    if (y < minY) minY = y;
    if (!map[y]) map[y] = [];
    map[y][x] = type;
}

function drawScene() {
    var root = $('#root').empty();
    data.map(d => {
        var x = 0, y = 0, w = 0, h = 0;
        if (Array.isArray(d.x)) {
            y = d.y;h = 1;
            x = d.x[0];w = d.x[1]-d.x[0]+1;
        } else if (Array.isArray(d.y)) {
            x = d.x;w = 1;
            y = d.y[0];h = d.y[1]-d.y[0]+1;
        } else {
            w = 1;h = 1;x = d.x;y = d.y;
        }
        var div = $('<div />', {css: {
            left: x*2+'px',
            top: y*2+'px',
            width: w*2+'px',
            height: h*2+'px',
        }}).addClass('material rock');

        root.append(div);

        if (!mapInitialized) {
            if (Array.isArray(d.x)) {
                for (var i = d.x[0];i<=d.x[1]; i++) addMapPoint(i,y,'R');
            } else if (Array.isArray(d.y)) {
                for (var i = d.y[0];i<=d.y[1]; i++) addMapPoint(x,i,'R');
            }
        }
    })
    mapInitialized = true;
    var springDiv = $('<div />', {css: {
        left: 500*2+'px',
        top: 0*2+'px',
        width: 1*2+'px',
        height: 1*2+'px',
    }}).addClass('material spring');
    root.append(springDiv);

    // draw water
    for (var y = minY; y < maxY; y++) {
        if (!map[y]) map[y] = [];
        for (var x = 0; x < map[y].length; x++) {
            if (map[y][x] == 'W') {
                var div = $('<div />', {css: {
                    left: x*2+'px',
                    top: y*2+'px',
                    width: '2px',
                    height: '2px',
                }}).addClass('material water');
                root.append(div);
            }
            if (map[y][x] == 'S') {
                var div = $('<div />', {css: {
                    left: x*2+'px',
                    top: y*2+'px',
                    width: '2px',
                    height: '2px',
                }}).addClass('material sand');
                root.append(div);
            }
        }
    }
}

readInput();
drawScene();

function advanceWater(p) {
    var arr = [p], ptr = 0;
    while (ptr < arr.length) {
        for (var i = ptr; i < arr.length; i++) {
            var point = arr[i];
            if (point.y > maxY+2) break;
            if (!map[point.y]) map[point.y] = [];
            if (!map[point.y+1]) map[point.y+1] = [];

            if (!['R','W', 'w'].includes(map[point.y][point.x])) {
                map[point.y][point.x] = 'w';
                if (['R','W'].includes(map[point.y+1][point.x])) {
                    if (point.dir != 1) arr.push({x:point.x-1, y:point.y, dir:-1});
                    if (point.dir != -1) arr.push({x:point.x+1, y:point.y, dir:1});
                } else {
                    arr.push({x:point.x, y:point.y+1});
                }
            }
        }

        ptr = ptr+i+1;
        //drainWater();
    }
    for (var y = 0; y < maxY; y++) {
        if (!map[y]) map[y] = [];
        for (var x = 0; x < map[y].length; x++) {
            if (map[y][x] == 'w') map[y][x] = 'W';
        }
    }
}

// udelat chytrejsi drainWater
function drainWater() {
    for (var y = 0; y < maxY; y++) {
        if (!map[y]) map[y] = [];
        for (var x = 0; x < map[y].length; x++) {
            //if (map[y][x] == 'w') map[y][x] = 'W';
            if (map[y][x] == 'W') {
                if ( (!['W','R'].includes(map[y][x-1])) || (!['W','R'].includes(map[y][x+1])) ) {
                    map[y][x] = 'S';
                } else {
                    // lze utect vpravo?
                    var escX = x;
                    while (map[y][escX] == 'W') {escX++}
                    if (!['W','R'].includes(map[y+1][escX])) {
                        map[y][x] = 'S';
                    } else {
                        // lze utect vlevo?
                        var escX = x;
                        while (map[y][escX] == 'W') {escX--}
                        if (!['W','R'].includes(map[y+1][escX])) map[y][x] = 'S';
                    }
                }
            }
        }
    }
}

var ticks = 0;

function tick() {

    console.log('ticked');

    drainWater();

    //water.push({x:500,y:1});
    advanceWater({x:500,y:1});
    //drainWater();

    if (ticks % 100 == 0) 
        drawScene();
    ticks++;
    if (ticks < 1100) setTimeout(() => tick(), 5);
}

setTimeout(() => tick(), 1000);

console.log('data', data);
// watur: 30500+1 (spodni) - 6 (invalid fill) = 30495 UUUIIIIIII
// watur p2 24905 - 6 = 24