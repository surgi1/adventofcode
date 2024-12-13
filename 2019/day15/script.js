// Contains visuals and a playable game of maze (set autoplay to false)

const frameDelay = 50, reverseMoves = [0, 2, 1, 4, 3], size = 42;
let screen = [], root, actionLog = [], unresolvedPoints = [], autoplay = true,
    comp = new Computer(), bot = {x:size/2,y:size/2}, botStart = {x:size/2,y:size/2},
    ox = false, oxDm = false, oxTicks = 1;

const prepareScreen = () => {
    root.empty();
    for (let y = 0; y < size; y++) {
        let line = '';
        for (let x = 0; x <= size; x++) {
            let tileId = screen[y][x] || 0;
            let char = ' ';
            let div = $('<div>', {
                id: 'tile_'+y*42+x,
                css: {
                    left: x*16+'px',
                    top: y*16+'px',
                }
            })
            div.addClass('tile');
            div.html(' ');
            root.append(div);
        }
    }
}

const getTileDivId = (x, y) => '#tile_'+y*42+x;

const renderScreen = () => {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x <= size; x++) {
            let tileId = screen[y][x] || 0;
            let div = $(getTileDivId(x, y));
            div.addClass('type_'+tileId);
            if (x == bot.x && y == bot.y) {
                div.addClass('bot');
            }
        }
    }
}

const getPos = tileId => {
    for (let y=1;y<=40;y++) {
        for (let x=0;x<=40;x++) {
            if (screen[y][x] == tileId) return {x:x,y:y}
        }
    }
}

const advanceByActionId = (p, actionId) => {
    let x = p.x, y = p.y;
    if (actionId == 1) y--;
    if (actionId == 2) y++;
    if (actionId == 3) x--;
    if (actionId == 4) x++;
    return {x: x, y: y};
}

const solvePart1 = () => {
    let dm = generateDistanceMap(ox);
    console.log('Steps from start to oxygen station', dm[botStart.y][botStart.x]);
}

const advanceWithCallback = (actionId, callback, markEmpty = true) => {
    let result = comp.run([actionId]);
    let p = advanceByActionId(bot, actionId);

    if (result.output[0] == 0) {
        screen[p.y][p.x] = 1; // wall
    }
    if (result.output[0] == 1) {
        if (markEmpty) screen[p.y][p.x] = 2; // empty space
    }
    if (result.output[0] == 2) {
        if (!ox) {
            screen[p.y][p.x] = 3; // oxygen station
            ox = p;
            solvePart1();
        }
    }
    callback(result.output[0], p.x, p.y);
}

const thereAndBack = (actionId, backActionId) => {
    let res;
    advanceWithCallback(actionId, (out, x, y) => {
        if (out != 0) comp.run([backActionId]);
        res = out;
    }, false)
    return res;
}

const delayedGameTick = actionId => setTimeout(() => gameTick(actionId), frameDelay);
const getScreenPoint = p => screen[p.y][p.x] || 0;

const reduceUnresolvedPoints = (x, y) => {
    let found = false;
    unresolvedPoints.some((p, i) => {
        if (unresolvedPoints[i].x == x && unresolvedPoints[i].y == y) {
            found = i;
            return true;
        }
    })
    if (found) unresolvedPoints.splice(found, 1);
}

const canMoveTo = p => getScreenPoint(p) != 1;

const spread = (distanceMap, x, y, dist) => {
    if (!distanceMap[y]) distanceMap[y] = [];
    if (!(distanceMap[y][x]) || (distanceMap[y][x] > dist)) {
        distanceMap[y][x] = dist;
        if (getScreenPoint({x:x, y:y}) == 0 && dist > 0) return;
        if (canMoveTo({x: x-1, y: y})) spread(distanceMap, x-1,y,dist+1);
        if (canMoveTo({x: x+1, y: y})) spread(distanceMap, x+1,y,dist+1);
        if (canMoveTo({x: x, y: y-1})) spread(distanceMap, x,y-1,dist+1);
        if (canMoveTo({x: x, y: y+1})) spread(distanceMap, x,y+1,dist+1);
    }
}

const generateDistanceMap = start => {
    let dm = [];
    spread(dm, start.x, start.y, 0);
    return dm;
}

const scan = () => {
    let movePossible = [];
    for (let move = 1; move < reverseMoves.length; move++) movePossible[move] = thereAndBack(move, reverseMoves[move]);
    return movePossible;
}

const gameTick = actionId => {
    scan();

    $(getTileDivId(bot.x, bot.y)).removeClass('bot');
    advanceWithCallback(actionId, (out, x, y) => {
        if (out != 0) {
            bot.x = x; bot.y = y;
            actionLog.push(actionId);
            reduceUnresolvedPoints(x, y);
        }
    })

    let movePossible = scan(), nextMoves = [], advance = false;
    for (let move = 1; move < reverseMoves.length; move++) if (movePossible[move] && reverseMoves[move] != actionLog[actionLog.length-1]) nextMoves.push(move);

    if (autoplay) {
        if (nextMoves.length == 0) {
            delayedGameTick(reverseMoves[actionLog[actionLog.length-1]]);
            advance = true;
        } else if (nextMoves.length == 1) {
            delayedGameTick(nextMoves[0]);
            advance = true;
        } else if (nextMoves.length == 2) {
            let blanks = nextMoves.filter(move => getScreenPoint(advanceByActionId(bot, move)) == 0);
            if (blanks.length >= 1) {
                delayedGameTick(blanks[0]);
                advance = true;
                if (blanks.length > 1) unresolvedPoints.push(advanceByActionId(bot, blanks[1]));
            } else {
                if (unresolvedPoints.length > 0) {
                    // generate distanceMap from last unresolved point, pick direction to it
                    let dm = generateDistanceMap(unresolvedPoints[unresolvedPoints.length-1]);
                    nextMoves.some(move => {
                        let p = advanceByActionId(bot, move);
                        if (dm[p.y][p.x] < dm[bot.y][bot.x]) {
                            delayedGameTick(move);
                            advance = true;
                            return true;
                        }
                    })
                }
            }
        }

        if (!advance && !oxDm) {
            oxDm = generateDistanceMap(ox), distances = [];
            for (let y=0;y<size;y++) {
                for (let x=0;x<size;x++) if (oxDm[y] && oxDm[y][x]) distances.push(oxDm[y][x]);
            }
            oxMaxDistance = Math.max(...distances);
            console.log('Minutes needed for oxygen to fully spread', Math.max(...distances));
            oxTick();
        }
    }

    renderScreen();
}

const oxTick = () => {
    for (let y=0;y<size;y++) {
        for (let x=0;x<size;x++) {
            if (x == ox.x && y == ox.y) continue;
            if (oxDm[y] && oxDm[y][x] && oxDm[y][x] === oxTicks) screen[y][x] = 4;
        }
    }
    renderScreen();
    if (oxTicks < oxMaxDistance) setTimeout(oxTick, frameDelay);
    oxTicks++;
}

const initGame = () => {
    root = $('#root');
    comp.load(input);
    let result = comp.run();

    for (let y = 0; y < size; y++) screen[y] = [];
        screen[bot.y][bot.x] = 2;

    let keyMap = {
        ArrowLeft: 3,
        ArrowRight: 4,
        ArrowUp: 1,
        ArrowDown: 2,
    };

    let lastTick = 0;

    prepareScreen();
    renderScreen();

    if (!autoplay) {
        $(document).keydown(function(e) {
            if (new Date().getTime() - lastTick < frameDelay) return;
            if (keyMap[e.key] !== undefined) {
                lastTick = new Date().getTime();
                gameTick(keyMap[e.key]);
            }
        });
    }

    gameTick(1);
}

initGame();
