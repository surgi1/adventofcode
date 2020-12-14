// TAKE 2, lazy walk with stacked control characters

var root = $('#root');
var pre = $('<pre>');
root.append(pre);

function renderMap(filling) {
    if (!filling) filling = ' ';
    pre.empty();

    for (var y=0;y<mapSize;y++) {
        var line = '';
        for (var x=0;x<mapSize;x++) {
            line = line+(map[y][x] ? (map[y][x] == '?' ? '#' : map[y][x]) : filling);
        }
        pre.append(line);
        pre.append('<br>');
    }
}

var map = [], mapSize = 201, distanceMap =[]; //[y][x]
for (var y=0;y<mapSize;y++) {
    map[y] = [];
    distanceMap[y] = [];
}

var startX = Math.round(mapSize/2)-6, startY=Math.round(mapSize/2)-2;
map[startY][startX] = 'X';

var minx = 0,miny = 0,maxx = 0,maxy = 0;
var pointer = 0, x = startX, y = startY, stack = [];

function drawPoint(ch) {
    if (ch == '^') return false;
    if (ch == '$') return false;
    if (ch == '(') return false;
    if (ch == ')') return false;
    if (ch == '|') return false;
    if (ch == 'N') {
        y--;
        map[y][x] = '-';
        map[y][x-1] = '#';map[y][x+1] = '#';
        y--;
    }
    if (ch == 'S') {
        y++;
        map[y][x] = '-';
        map[y][x-1] = '#';map[y][x+1] = '#';
        y++;
    }
    if (ch == 'E') {
        x++;
        map[y][x] = '|';
        map[y-1][x] = '#';map[y+1][x] = '#';
        x++;
    }
    if (ch == 'W') {
        x--;
        map[y][x] = '|';
        map[y-1][x] = '#';map[y+1][x] = '#';
        x--;
    }
    map[y][x] = '.';
    return true;
}

var furthest = 0;
var savedFurthests = [], stackF = [];;

var stackX = [], stackY = [], stop = false;

var ticks = 0;

function tick() {
    var ch = input[pointer];
    while (drawPoint(ch)) {
        pointer++;
        ch = input[pointer];
        furthest++;
    }
    // control characters
    if (ch == '(') {
        stackX.push(x);
        stackY.push(y);
    }
    if (ch == ')') {
        if (stackX.length > 0) x = stackX.pop(); else console.log('tried to pop ) with empty stack', pointer);
        if (stackY.length > 0) y = stackY.pop(); else console.log('tried to pop ) with empty stack', pointer);
    }

    if (ch == '|') {
        x = stackX[stackX.length-1];
        y = stackY[stackY.length-1];
    }

    if (ch == '$') stop = true;

    pointer++;
    ticks++;

    if ((ticks % 100 == 0) || stop) renderMap();
    if (!stop) {
        setTimeout(() => tick(), 5);
    } else {
        savedFurthests.push(furthest);
        console.log('drawing ended'/*, Math.max(...savedFurthests), savedFurthests*/);
        renderMap('#');
        // let's cmpute distances
        generateDistanceMap();
    }
}

function spread(x,y,dist) {
    if (!(distanceMap[y][x]) || (distanceMap[y][x] > dist)) {
        distanceMap[y][x] = dist;
        if (map[y][x-1] == '|') spread(x-2,y,dist+1);
        if (map[y][x+1] == '|') spread(x+2,y,dist+1);
        if (map[y-1][x] == '-') spread(x,y-2,dist+1);
        if (map[y+1][x] == '-') spread(x,y+2,dist+1);
    }
}

function generateDistanceMap() {
    //distanceMap[startY][startX] = 0;
    spread(startX,startY,0);

    var distances = [];
    var over1k = 0;

    for (var y=0;y<mapSize;y++) {
        for (var x=0;x<mapSize;x++) {
            if (distanceMap[y][x]) {
                distances.push(distanceMap[y][x]);
                if (distanceMap[y][x] >= 1000) over1k++;
            }
        }
    }

    console.log('distances', Math.max(...distances), 'over1k', over1k, distances);
    
}

tick();
