//let depth = 510; let target = {x: 10, y: 10}
let depth = 6084; let target = {x: 14, y: 709}
let ext = {y:20, x:22};
let erosionLevelMap = [], map = [], fastestMap = [];
let regionTypeName = ['rocky', 'wet', 'narrow'];
let gear4RegionType = [['torch', 'climb'], ['climb', 'none'], ['torch', 'none']];
let regionTypeSign = ['.', '=', '|'];

for (let y = 0; y <= target.y+ext.y; y++) {
    erosionLevelMap[y] = [];
    map[y] = [];
    fastestMap[y] = [];
}

const geoId = (x,y) => {
    if (x == 0 && y == 0) return 0;
    if (x == target.x && y == target.y) return 0;
    if (y == 0) return x*16807;
    if (x == 0) return y*48271;
    if (!erosionLevelMap[y-1][x] || !erosionLevelMap[y][x-1]) return false; 
    return erosionLevelMap[y-1][x]*erosionLevelMap[y][x-1];
}

const erosionLevel = (x,y) => {
    if (erosionLevelMap[y][x]) return  erosionLevelMap[y][x];
    let gId = geoId(x,y);
    if (gId === false) {
        console.log('cannot determine erosionLevel and/or geoId for [x,y]', x, y);
    }

    let el = (gId+depth) % 20183;
    erosionLevelMap[y][x] = el;
    return el;
}

const regionType = erosionLevel => {
    return erosionLevel % 3;
}

for (let i=0;i<=target.y+ext.y;i++) {
    for (let j=0; j<=i;j++) {
        if (i <= target.x+ext.x && j <= target.y+ext.y) erosionLevel(i,j);
        if (i != j && j <= target.x+ext.x && i <= target.y+ext.y) erosionLevel(j,i);
    }
}

for (let y = 0; y <= target.y+ext.y; y++) {
    for (let x = 0; x <= target.x+ext.x; x++) {
        let rType = regionType(erosionLevelMap[y][x]);
        map[y][x] = rType;
    }
}

//console.log('risk level', riskLevel);

// p2

let root = $('#root');
let pre = $('<pre>');
root.append(pre);

const renderMap = () => {
    pre.empty();

    for (let y=0;y<=target.y+ext.y;y++) {
        let line = '';
        for (let x=0;x<=target.x+ext.x;x++) {
            let char = regionTypeSign[map[y][x]];
            if (target.x == x && target.y == y) char = 'T';
            line = line+char;
        }
        pre.append(line);
        pre.append('<br>');
    }
}

delete erosionLevelMap;

let ticks = 0;
let start = {x:0,y:0,gear:'torch', minutes: 0};
let paths = []; // really positions to explore, position is defined as x,y,gear (gear equipped)
// fastestMap[y][x] will store possibly multiples of {minutes:min, gear: gear equipped} meaning the fastest we can get there with a thing equipped
paths.push(start);

let pointer = 0;
let stop = false;

while ((!stop) && (pointer < paths.length)) {

    let pos = paths[pointer];
    let proceedWithPath = false;

    // first check if our fastestMap[y][x] requires an update
    if (!fastestMap[pos.y][pos.x]) {
        fastestMap[pos.y][pos.x] = [{gear: pos.gear, minutes: pos.minutes}];
        proceedWithPath = true;
    } else {
        // if a record with currently equipped gear exists, compare minutes
        let sameGearFound = false;
        fastestMap[pos.y][pos.x].map((pathObj, index) => {
            if (pathObj.gear == pos.gear) {
                sameGearFound = true;
                if (pathObj.minutes > pos.minutes) {
                    fastestMap[pos.y][pos.x][index] = {gear: pos.gear, minutes: pos.minutes};
                    proceedWithPath = true;
                }
            }
        })

        if (!proceedWithPath && !sameGearFound) {
            // here maybe we could delete obsolete ones (other gear equipped with time > pos.time+7)
            fastestMap[pos.y][pos.x].push({gear: pos.gear, minutes: pos.minutes});
            proceedWithPath = true;
        }
    }

    // second check what points are available
    if (proceedWithPath) {
        let toCheck = [];
        if (pos.x > 1) toCheck.push({x:pos.x-1,y:pos.y});
        if (pos.x < target.x+ext.x) toCheck.push({x:pos.x+1,y:pos.y});
        if (pos.y > 1) toCheck.push({x:pos.x,y:pos.y-1});
        if (pos.y < target.y+ext.y) toCheck.push({x:pos.x,y:pos.y+1});

        toCheck.map(newPos => {
            let newPosType = map[newPos.y][newPos.x];
            gear4RegionType[newPosType].map(gear => {
                paths.push({x:newPos.x, y: newPos.y, gear: gear, minutes: pos.minutes+1+(gear == pos.gear ? 0 : 7)});
            })
        })

        // remember when pushing more paths that all the available gear combinations must be checked
    }

    ticks++;
    if (ticks % 100000000 == 0) {
        console.log('hand breaking', ticks);
        console.log('getting to target', fastestMap[target.y][target.x]);
        break;
    }

    pointer++;
}

renderMap();
console.log('getting to target', fastestMap[target.y][target.x]);
// p2
// 952 YAY