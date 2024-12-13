let rules = [], screen = [];

const reverseString = s => {
    let res = '';
    for (let i = 0; i < s.length; i++) res = s[i]+res;
    return res;
}

const rotatePattern = data => {
    let newData = [], len = data.length;
    for (let i = 0; i < len; i++) newData[i] = [];
    for (let yy = 0; yy < len; yy++) {
        for (let xx = 0; xx < len; xx++) {
            newData[xx][len-1-yy] = data[yy][xx];
        }
    }
    let result = [];
    for (let i = 0; i < len; i++) result[i] = newData[i].join('');
    return result;
}

const flipPatternHorizontal = data => {
    return data.slice().reverse();
}

const flipPatternVertical = data => {
    let newData = [];
    data.slice().map((line, index) => {
        newData[index] = reverseString(line);
    })
    return newData;
}

const init = input => {
    screen = ['.#.','..#','###'];
    input.map(line => {
        let arr = line.split(' => ');
        let tmp = {size: 2, matches: [], patterns: [], output: arr[1], outputExploded: arr[1].split('/')};
        tmp.patterns.push(arr[0].split('/'));
        tmp.size = tmp.patterns[0].length;
        tmp.outputSize = tmp.outputExploded.length;
        for (let i = 0; i < 3; i++) tmp.patterns.push(rotatePattern(tmp.patterns[tmp.patterns.length-1]));
        tmp.patterns.push(flipPatternHorizontal(tmp.patterns[tmp.patterns.length-1]))
        for (let i = 0; i < 3; i++) tmp.patterns.push(rotatePattern(tmp.patterns[tmp.patterns.length-1]));
        tmp.patterns.push(flipPatternVertical(tmp.patterns[tmp.patterns.length-1]))
        for (let i = 0; i < 3; i++) tmp.patterns.push(rotatePattern(tmp.patterns[tmp.patterns.length-1]));
        tmp.patterns.map(pattern => {
            let s = pattern.join('/');
            if (!tmp.matches.includes(s)) tmp.matches.push(s);
        })
        rules.push(tmp);
    })
}

const iterate = () => {
    let size = screen.length, mode = 3, newScreen = [], tiles = [], newSize;
    if (size % 2 == 0) mode = 2;
    let activeRules = rules.filter(rule => rule.size == mode);

    // split into tiles
    for (let tileY = 0; tileY < size/mode; tileY++) {
        tiles[tileY] = [];
        for (let tileX = 0; tileX < size/mode; tileX++) {
            tiles[tileY][tileX] = [];
            for (let y = 0; y < mode; y++) {
                tiles[tileY][tileX][y] = '';
                for (let x = 0; x < mode; x++) {
                    tiles[tileY][tileX][y] += screen[tileY*mode+y][tileX*mode+x];
                }
            }
            tiles[tileY][tileX] = tiles[tileY][tileX].join('/');
        }
    }

    // transform tiles
    for (let tileY = 0; tileY < size/mode; tileY++) {
        for (let tileX = 0; tileX < size/mode; tileX++) {
            activeRules.some(rule => {
                if (rule.matches.includes(tiles[tileY][tileX])) {
                    tiles[tileY][tileX] = rule.outputExploded;
                    newSize = rule.outputSize;
                    return true;
                }
            })
        }
    }

    // redraw transformed
    for (let y = 0; y < newSize*tiles.length; y++) newScreen[y] = '';
    for (let tileY = 0; tileY < size/mode; tileY++) {
        for (let tileX = 0; tileX < size/mode; tileX++) {
            for (let y = 0; y < newSize; y++) {
                for (let x = 0; x < newSize; x++) {
                    newScreen[tileY*newSize+y] += tiles[tileY][tileX][y][x];
                }
            }
        }
    }
    screen = newScreen;
}

const getCount = () => {
    let count = 0;
    for (let y = 0; y < screen.length; y++) {
        for (let x = 0; x < screen[y].length; x++) if (screen[y][x] == '#') count++;
    }
    return count;
}

const run = iterations => {
    init(input);
    for (let i = 0; i < iterations; i++) iterate();
    console.log(getCount());
}

run(5); // p1
run(18); // p2