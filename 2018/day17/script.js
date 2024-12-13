let data = [], map = [], drawn = [], mapInitialized = false, water = [], maxY = 0, minY = 1000,
    ticks = 0, lastMap = false, stop = false, root = $('#root'), lastTime;

const readInput = () => {
    input.map(s => {
        let tmp = {}, pars = s.split(', ');
        pars.map(par => {
            let subpars = par.split('='), dat;
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

const addMapPoint = (x,y,type) => {
    if (y > maxY) maxY = y;
    if (y < minY) minY = y;
    if (!map[y]) map[y] = [];
    map[y][x] = type;
}

const initScene = () => {
    if (mapInitialized) return;
    data.map(d => {
        let x = 0, y = 0, w = 0, h = 0;
        if (Array.isArray(d.x)) {
            y = d.y;h = 1;
            x = d.x[0];w = d.x[1]-d.x[0]+1;
            for (let i = d.x[0];i<=d.x[1]; i++) addMapPoint(i,y,'R');
        } else if (Array.isArray(d.y)) {
            x = d.x;w = 1;
            y = d.y[0];h = d.y[1]-d.y[0]+1;
            for (let i = d.y[0];i<=d.y[1]; i++) addMapPoint(x,i,'R');
        }
        let div = $('<div />', {css: {
            left: x*2+'px',
            top: y*2+'px',
            width: w*2+'px',
            height: h*2+'px',
        }}).addClass('material rock');

        root.append(div);

        let springDiv = $('<div />', {css: {
            left: 499*2+'px',
            top: 0*2+'px',
            width: 3*2+'px',
            height: 3*2+'px',
        }}).addClass('material spring');
        root.append(springDiv);
    })
    for (let y = 0; y <= maxY+1; y++) if (!map[y]) map[y] = [];
    mapInitialized = true;
}

const drawScene = () => {
    initScene();
    // draw water
    for (let y = 0; y <= maxY; y++) {
        if (map[y].indexOf('W') == -1) continue;
        if (!drawn[y]) drawn[y] = [];
        if (map[y].filter(e => e == 'W').length == drawn[y].filter(e => e == 'W').length) continue;
        for (let x = map[y].indexOf('W'); x < map[y].length; x++) {
            if (map[y][x] != 'W' || drawn[y][x] == map[y][x]) continue;
            let xStart = x;
            while (map[y][x+1] == 'W') x++;
            let div = $('<div />', {css: {
                left: xStart*2+'px',
                top: y*2+'px',
                width: (x-xStart+1)*2+'px',
                height: '2px',
            }})
            div.addClass('material water');
            root.append(div);
        }
        drawn[y] = map[y].slice();
    }
}

const advanceWater = p => {
    let arr = [p], ptr = 0;
    while (ptr < arr.length) {
        let point = arr[ptr];
        if (point.y >= maxY+1) break;
        if (map[point.y][point.x] == 'S' || map[point.y][point.x] == undefined) {
            map[point.y][point.x] = 'w';
            if (map[point.y+1][point.x] == 'R' || map[point.y+1][point.x] == 'W') {
                if (point.dir != 1) arr.push({x:point.x-1, y:point.y, dir:-1});
                if (point.dir != -1) arr.push({x:point.x+1, y:point.y, dir:1});
            } else {
                arr.push({x:point.x, y:point.y+1});
            }
        }
        ptr++;
    }
    map.map((row, y) => row.map((e, x) => {
        if (e == 'w') map[y][x] = 'W';
    }))
}

const drainWater = () => {
    for (let y = 0; y <= maxY; y++) {
        if (map[y].indexOf('W') == -1) continue;
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] == 'W') {
                if ( (!['W','R'].includes(map[y][x-1])) || (!['W','R'].includes(map[y][x+1])) ) {
                    map[y][x] = 'S';
                } else {
                    // escape to the right possible?
                    let escX = x;
                    while (map[y][escX] == 'W') escX++;
                    if (map[y][escX] == 'S' || !['W','R'].includes(map[y+1][escX])) {
                        for (let i = x; i < escX; i++) map[y][i] = 'S';
                    } else {
                        // escape to the left possible?
                        escX = x;
                        while (map[y][escX] == 'W') escX--;
                        if (map[y][escX] == 'S' || !['W','R'].includes(map[y+1][escX])) map[y][x] = 'S';
                    }
                }
            }
        }
    }
}

const countMap = char => map.join('').split('').reduce((a, v) => a+(v == char), 0);
const cmpStates = (s1, s2) => s1.length == s2.length && s1.every((r1, i) => s2[i] && s2[i].length == r1.length && r1.every((e, j) => s2[i][j] == e))

const tick = () => {
    lastTime = new Date().getTime();
    if (map[maxY].indexOf('W') > -1) {
        if (lastMap !== false && cmpStates(map, lastMap)) stop = true;
        lastMap = $.extend(true, [], map);
    }

    drainWater();drainWater();
    advanceWater({x:500,y:1});

    //if (ticks % 100 == 0)
        drawScene();
    ticks++;
    if (!stop) {
        setTimeout(() => tick(), Math.max(0, (40-(new Date().getTime()-lastTime))));
    } else {
        drawScene();
        console.log('part 1', countMap('W')-minY+1);
        drainWater();
        console.log('part 2', countMap('W'));
    }
}

readInput();
drawScene();
setTimeout(() => tick(), 1000);
