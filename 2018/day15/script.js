// much graphics, so wow
let tickDelay = 50, stopRound = false, map = [], mapSize = data[0].length, creatures = [], boost = 0, root = $('#root');

const addCreature = (type, x, y) => creatures.push({
    type: type, health: 200,
    attack: (type == 'E' ? 3+boost : 3),
    x: x, y: y,
    status: 'ALIVE' // DEAD
})

const init = () => {
    map = []; creatures = [];
    data.map((line, y) => {
        if (!map[y]) map[y] = [];
        line.split('').map((ch, x) => {
            map[y][x] = (ch == '#' ? 'W' : 'S');
            if (['G', 'E'].includes(ch)) addCreature(ch, x, y);
        })
    })
}

const baseDiv = (cls, x, y) => {
    cls.push('grid_'+y+'_'+x);
    let div = $('<div />', {css: {
        left: x*16+'px',
        top: y*16+'px'
    }}).addClass(cls.join(' '));
    return div;
}

const drawMap = () => {
    for (let y = 0; y < mapSize; y++)
        for (let x = 0; x < mapSize; x++) root.append(baseDiv(['mappoint', map[y][x]], x, y));
}

const drawCreatures = () => creatures.filter(c => c.status != 'DEAD').map(creature => {
    let cDiv = baseDiv(['creature', creature.type], creature.x, creature.y);
    cDiv.append( $('<div class="health"/>').html(creature.health) );
    root.append(cDiv);
})

const drawScene = () => {
    root.empty();
    drawMap();
    drawCreatures();
}

const computeDistanceMap = (spreadX, spreadY) => {
    let distanceMap = $.extend(true, [], map), toSpread = [{x: spreadX, y: spreadY, dist: 0}], i = 0;
    // add creatures
    creatures.filter(c => c.status != 'DEAD' && !(spreadX == c.x && spreadY == c.y)).map(c => distanceMap[c.y][c.x] = 'W')
    while (i < toSpread.length) {
        let point = distanceMap[toSpread[i].y][toSpread[i].x];
        if (point != 'W') {
            if ((point == 'S') || (point > toSpread[i].dist)) {
                distanceMap[toSpread[i].y][toSpread[i].x] = toSpread[i].dist;
                toSpread.push({x: toSpread[i].x-1, y: toSpread[i].y, dist: toSpread[i].dist+1})
                toSpread.push({x: toSpread[i].x, y: toSpread[i].y-1, dist: toSpread[i].dist+1})
                toSpread.push({x: toSpread[i].x+1, y: toSpread[i].y, dist: toSpread[i].dist+1})
                toSpread.push({x: toSpread[i].x, y: toSpread[i].y+1, dist: toSpread[i].dist+1})
            }
        }
        i++;
    }
    return distanceMap;
}

const findAdjacentPoints = (targetCreatures, dm) => {
    let adjMap = $.extend(true, [], map), adjacentPoints = []; // init
    creatures.filter(c => c.status != 'DEAD').map(c => adjMap[c.y][c.x] = 'W'); // add creatures
    targetCreatures.map(c => {
        if (adjMap[c.y-1][c.x] == 'S' && dm[c.y-1][c.x] != 'S') adjacentPoints.push({x: c.x, y: c.y-1});
        if (adjMap[c.y+1][c.x] == 'S' && dm[c.y+1][c.x] != 'S') adjacentPoints.push({x: c.x, y: c.y+1});
        if (adjMap[c.y][c.x-1] == 'S' && dm[c.y][c.x-1] != 'S') adjacentPoints.push({x: c.x-1, y: c.y});
        if (adjMap[c.y][c.x+1] == 'S' && dm[c.y][c.x+1] != 'S') adjacentPoints.push({x: c.x+1, y: c.y});
    })
    return adjacentPoints;
}

const performAttack = (from, to) => {
    to.health = Math.max(0, to.health-from.attack);
    if (to.health == 0) to.status = 'DEAD';
}

const creatureTargets = creature => creatures.filter(c => (c.type == (creature.type == 'G' ? 'E' : 'G')) && (c.status != 'DEAD'));
const getTargetsInRange = (creature, targets) => targets.filter(t => (Math.abs(t.x-creature.x) + Math.abs(t.y-creature.y)) == 1);
const getTotalHealth = () => creatures.filter(c => c.status != 'DEAD').reduce((a, c) => a+c.health, 0)
const deads = type => creatures.filter(c => c.status == "DEAD" && c.type == type).length;
const displayBattleResult = res => {
    $('.message').text(res.join(' '));
    console.log(...res);
}
const clearMessage = () => $('.message').text('');

const battle = () => {
    init();
    drawScene();
    clearMessage();

    let eob = false, roundsPassed = 0;
    const tick = () => {
        creatures.sort((a,b) => (a.y*mapSize+a.x) - (b.y*mapSize+b.x))

        for (let i = 0; i < creatures.length; i++) {
            let creature = creatures[i];
            if (creature.status == 'DEAD') continue;

            let targets = creatureTargets(creature);
            if (targets.length == 0) {
                displayBattleResult(['Battle with elves attack boosted by', boost, 'ended after', roundsPassed,'rounds with', deads('E'), 'dead elves and', deads('G'), 'dead goblins with battle status', getTotalHealth()*roundsPassed]);
                boost++;
                if (deads('E') != 0) setTimeout(battle, 8000);
                eob = true;
                break;
            }

            // does he need to move?
            let targetsInRange = getTargetsInRange(creature, targets);
            if (targetsInRange.length == 0) {
                let dmFromCreature = computeDistanceMap(creature.x, creature.y);
                let moveTargets = findAdjacentPoints(targets, dmFromCreature);

                // if yes, can he move (at least 1 adjacent field accessible)?
                if (moveTargets.length > 0) {
                    moveTargets.sort((a,b) => {
                        if (dmFromCreature[a.y][a.x] == dmFromCreature[b.y][b.x]) return (a.y*mapSize+a.x) - (b.y*mapSize+b.x);
                        return dmFromCreature[a.y][a.x] - dmFromCreature[b.y][b.x];
                    })
                    // we have a move target (point adjacent to closest target creature) in moveTargets[0]

                    // dist map from movement target
                    dmFromTargetField = computeDistanceMap(moveTargets[0].x, moveTargets[0].y);

                    let possibleMoves = [], x = creature.x, y = creature.y;
                    if (dmFromTargetField[y][x-1] != 'W' && dmFromTargetField[y][x-1] != 'S') possibleMoves.push({x: x-1, y: y});
                    if (dmFromTargetField[y][x+1] != 'W' && dmFromTargetField[y][x+1] != 'S') possibleMoves.push({x: x+1, y: y});
                    if (dmFromTargetField[y-1][x] != 'W' && dmFromTargetField[y-1][x] != 'S') possibleMoves.push({x: x, y: y-1});
                    if (dmFromTargetField[y+1][x] != 'W' && dmFromTargetField[y+1][x] != 'S') possibleMoves.push({x: x, y: y+1});

                    if (possibleMoves.length > 0) {
                        possibleMoves.sort((a,b) => {
                            if (dmFromTargetField[a.y][a.x] == dmFromTargetField[b.y][b.x]) return (a.y*mapSize+a.x) - (b.y*mapSize+b.x);
                            return dmFromTargetField[a.y][a.x] - dmFromTargetField[b.y][b.x];
                        })
                        creature.x = possibleMoves[0].x;
                        creature.y = possibleMoves[0].y;
                    }
                }
            }

            // attacking
            // recompute targetsInRange
            targetsInRange = getTargetsInRange(creature, targets);
            if (targetsInRange.length > 0) {
                // determine which one will be attacked
                targetsInRange.sort((a,b) => {
                    if (a.health == b.health) return (a.y*mapSize+a.x) - (b.y*mapSize+b.x);
                    return a.health - b.health;
                })
                performAttack(creature, targetsInRange[0]);
            }
        }

        drawScene();

        if (stopRound) {
            if (roundsPassed+1 == stopRound) eob = true;
        }

        // plan another tick
        if (!eob) {
            roundsPassed++;
            setTimeout(() => tick(), tickDelay);
        }
    }

    if (!eob) setTimeout(() => tick(), 2000);
}

battle();