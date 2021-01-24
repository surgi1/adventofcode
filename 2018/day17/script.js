let data = [], map = [], drawn = [], mapInitialized = false, water = [], maxY = 0, minY = 1000;

const readInput = () => {
    input.map(s => {
        let tmp = {};
        let pars = s.split(', ');
        pars.map(par => {
            let subpars = par.split('=');
            let dat;
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

const drawScene = () => {
    let root = $('#root');
    if (!mapInitialized) data.map(d => {
        let x = 0, y = 0, w = 0, h = 0;
        if (Array.isArray(d.x)) {
            y = d.y;h = 1;
            x = d.x[0];w = d.x[1]-d.x[0]+1;
        } else if (Array.isArray(d.y)) {
            x = d.x;w = 1;
            y = d.y[0];h = d.y[1]-d.y[0]+1;
        } else {
            w = 1;h = 1;x = d.x;y = d.y;
        }
        let div = $('<div />', {css: {
            left: x*2+'px',
            top: y*2+'px',
            width: w*2+'px',
            height: h*2+'px',
        }}).addClass('material rock');

        root.append(div);

        if (Array.isArray(d.x)) {
            for (let i = d.x[0];i<=d.x[1]; i++) addMapPoint(i,y,'R');
        } else if (Array.isArray(d.y)) {
            for (let i = d.y[0];i<=d.y[1]; i++) addMapPoint(x,i,'R');
        }
        let springDiv = $('<div />', {css: {
            left: 500*2+'px',
            top: 0*2+'px',
            width: 1*2+'px',
            height: 1*2+'px',
        }}).addClass('material spring');
        root.append(springDiv);

        mapInitialized = true;
    })

    // draw water
    for (let y = minY; y < maxY; y++) {
        if (!map[y]) map[y] = [];
        if (!drawn[y]) drawn[y] = [];
        for (let x = 0; x < map[y].length; x++) {
            if (drawn[y][x] == map[y][x]) continue;
            let div = $('<div />', {css: {
                left: x*2+'px',
                top: y*2+'px',
                width: '2px',
                height: '2px',
            }})
            if (map[y][x] == 'W') div.addClass('material water');
            if (map[y][x] == 'S') div.addClass('material sand');
            root.append(div);
            drawn[y][x] = map[y][x];
        }
    }
}

readInput();
drawScene();

const advanceWater = (p) => {
    let arr = [p], ptr = 0;
    while (ptr < arr.length) {
        let point = arr[ptr];
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
        ptr++;
    }
    for (let y = 0; y < maxY; y++) {
        if (!map[y]) map[y] = [];
        for (let x = 0; x < map[y].length; x++) {
            if (map[y][x] == 'w') map[y][x] = 'W';
        }
    }
}

const drainWater = () => {
    for (let y = 0; y < maxY; y++) {
        if (!map[y]) map[y] = [];
        for (let x = 0; x < map[y].length; x++) {
            //if (map[y][x] == 'w') map[y][x] = 'W';
            if (map[y][x] == 'W') {
                if ( (!['W','R'].includes(map[y][x-1])) || (!['W','R'].includes(map[y][x+1])) ) {
                    map[y][x] = 'S';
                } else {
                    // lze utect vpravo?
                    let escX = x;
                    while (['W','S'].includes(map[y][escX])) {escX++}
                    if (!['W','R'].includes(map[y+1][escX])) {
                        map[y][x] = 'S';
                    } else {
                        // lze utect vlevo?
                        let escX = x;
                        while (['W','S'].includes(map[y][escX])) {escX--}
                        if (!['W','R'].includes(map[y+1][escX])) map[y][x] = 'S';
                    }
                }
            }
        }
    }
}

const countMap = (char, count = 0) => {
    for (let y = 0; y < maxY; y++) {
        for (let x = 0; x < map[y].length; x++) if (map[y][x] == char) count++;
    }
    return count;
}

let ticks = 0;

const tick = () => {
    console.log('ticked');

    drainWater();drainWater();drainWater();
    advanceWater({x:500,y:1});

    //if (ticks % 10 == 0) 
        drawScene();
    ticks++;
    if (ticks < 1100) {
        setTimeout(() => tick(), 20);
    } else {
        console.log('part 1', countMap('W')-minY+2);
        drainWater();
        console.log('part 2', countMap('W'));
    }
}

setTimeout(() => tick(), 500);
