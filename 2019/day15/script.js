// Contains visuals and playable game of maze.

var screen = [], pre, timerHandle;
var comp = new Computer();
var size = 42, bot = {x:size/2,y:size/2};

function renderScreen() {
    pre.empty();
    for (var y = 0; y < size; y++) {
        var line = '';
        for (var x = 0; x <= size; x++) {
            var tileId = screen[y][x] || 0;
            var char = ' ';
            if (tileId == 1) char = '#';
            if (tileId == 2) char = '.';
            if (tileId == 3) char = 'O';
            if (x == bot.x && y == bot.y) char = '@';
            line = line+char;
        }
        pre.append(line);
        pre.append('<br>');
    }
}

function getPos(tileId) {
    for (var y=1;y<=40;y++) {
        for (var x=0;x<=40;x++) {
            if (screen[y][x] == tileId) return {x:x,y:y}
        }
    }
}

function advanceWithCallback(actionId, callback) {
    var result = comp.run([actionId]);

    var x = bot.x, y = bot.y;
    if (actionId == 1) y--;
    if (actionId == 2) y++;
    if (actionId == 3) x--;
    if (actionId == 4) x++;

    if (result.output[0] == 0) {
        screen[y][x] = 1; // wall
    }
    if (result.output[0] == 1) {
        screen[y][x] = 2; // empty space
    }
    if (result.output[0] == 2) {
        screen[y][x] = 3; // oxygen station
        console.log('Found Oxygen Station!');
    }
    callback(result.output, x, y);
}

function thereAndBack(actionId, backActionId) {
    advanceWithCallback(actionId, (out, x, y) => {
        if (out != 0) {
            comp.run([backActionId]);
        }
    })
}

function gameTick(actionId) {
    advanceWithCallback(actionId, (out, x, y) => {
        if (out != 0) {
            bot.x = x;bot.y = y;
        }
    })

    // scan around a bit
    thereAndBack(1, 2); thereAndBack(2, 1);
    thereAndBack(3, 4); thereAndBack(4, 3);

    renderScreen();
}

function initGame() {
    pre = $('<pre>');
    $('#root').append(pre);

    comp.load(input);

    var result = comp.run();

    for (var y = 0; y < size; y++) screen[y] = [];
        screen[bot.y][bot.x] = 2;

    var keyMap = {
        ArrowLeft: 3,
        ArrowRight: 4,
        ArrowUp: 1,
        ArrowDown: 2,
    };

    $(document).keydown(function(e) {
        if (keyMap[e.key] !== undefined) {
            gameTick(keyMap[e.key]);
        }
    });

    renderScreen();
}

function autoPlay() {
}

initGame(); // part 1; playing game resulted in mapInput below

var mapInput = [
'#########################################',
'#...#...#.....#...#...#...........#.....#',
'#.###.#.#.#.#.#.###.#.#.#########.#.#####',
'#.#...#...#.#...#...#.......#.....#.....#',
'#.#.#######.###.#.###########.#####.###.#',
'#...#...#O#.#.#.#.#...#.......#.....#...#',
'#.###.#.#.#.#.#.#.#.###.#######.#####.#.#',
'#.#...#..@#.#...#.#.#...#.........#...#.#',
'#.###.#.###.#####.#.#.###.#########.###.#',
'#.....#.#...#.......#.#.#.#...#...#.#...#',
'#######.#.###.#######.#.#.#.###.#.#.#.###',
'#...#...#...#.#.....#.#...#.#...#.#.#.#.#',
'#.#.#######.#.#.###.#.#.###.#.###.#.#.#.#',
'#.#.....#...#.#...#...#.....#...#.#.#...#',
'#.#####.#.###.###.#############.#.#.#####',
'#.#...#...#...#...#.............#.#.....#',
'#.#.#.###.#.###.###.#############.#.###.#',
'#...#.#...#.#.#...#.........#.....#.#...#',
'#####.#.###.#.###.###.#######.#######.#.#',
'#.....#...#...#...#...#...#...#.#.....#.#',
'#.###########.#.###.###.#.#.###.#.#.###.#',
'#.............#.#...#S..#.#...#...#.#...#',
'#.#############.#.#######.###.#.###.#####',
'#.....#.#.....#...#.....#.....#...#.....#',
'#####.#.#.#.#########.###########.#####.#',
'#.....#.#.#.......#...#.........#.....#.#',
'#.#####.#.###.###.#.###.#.#####.#######.#',
'#.#.........#.#...#.....#...#...........#',
'#.#.#########.#.###########.###########.#',
'#.#...#.......#.#.........#...#...#.....#',
'#.#####.#######.#.#######.#.#.#.#.#.#####',
'#.......#...#...#.#.......#.#...#.#.#...#',
'#########.#.#.###.###.###########.#.###.#',
'#...#.....#.#.#.....#...........#.#.....#',
'#.#.#.#####.#.#.###.###########.#.#####.#',
'#.#.#.#.#...#.#...#.#...#.......#.#...#.#',
'#.#.#.#.#.###.#####.#.#.#.#######.#.#.#.#',
'#.#...#.#.....#...#.#.#...#...#...#.#.#.#',
'#.#####.#######.#.#.#.#####.#.###.#.#.#.#',
'#...............#...#.......#.....#.#...#',
'#########################################']

var mapSize = mapInput.length, distanceMap = [], map = [], startX = 9, startY = 5;

function part2() {
    for (var y = 0; y < mapSize; y++) {
        distanceMap[y] = [];
        map[y] = [];
    }
    mapInput.map((line, y) => {
        for (var x = 0; x < line.length; x++) {
            map[y][x] = line[x];
        }
    })
    generateDistanceMap();
}


function spread(x,y,dist) {
    if (!(distanceMap[y][x]) || (distanceMap[y][x] > dist)) {
        distanceMap[y][x] = dist;
        if (map[y][x-1] != '#') spread(x-1,y,dist+1);
        if (map[y][x+1] != '#') spread(x+1,y,dist+1);
        if (map[y-1][x] != '#') spread(x,y-1,dist+1);
        if (map[y+1][x] != '#') spread(x,y+1,dist+1);
    }
}

function generateDistanceMap() {
    spread(startX, startY, 0);

    var distances = [];

    for (var y=0;y<mapSize;y++) {
        for (var x=0;x<mapSize;x++) {
            if (distanceMap[y][x]) {
                distances.push(distanceMap[y][x]);
            }
        }
    }

    console.log('max distance', Math.max(...distances), distances);
}
part2();