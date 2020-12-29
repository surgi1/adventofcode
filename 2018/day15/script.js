// much graphics, so wow

let tickDelay = 25;
let stopRound = false;

let map = []; // [y][x]: W = wall, S = space
let mapSize = data[0].length;
let creatures = [];

const addCreature = (type, x, y) => {
    creatures.push({
        type: type,
        health: 200,
        attack: (type == 'E' ? 12 : 3),
        x: x,
        y: y,
        status: 'ALIVE' // DEAD
    })
}

const readInput = () => {
    data.map((line, y) => {
        if (!map[y]) map[y] = [];
        for (let x = 0; x < line.length; x++) {
            map[y][x] = (line[x] == '#' ? 'W' : 'S');
            if (['G', 'E'].includes(line[x])) addCreature(line[x], x, y);
        }
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

const drawMap = (root) => {
    for (let y = 0; y < mapSize; y++) {
        for (let x = 0; x < mapSize; x++) {
            let mDiv = baseDiv(['mappoint', map[y][x]], x, y);
            //if (distanceMap) { if (distanceMap[y][x] != 'W' && distanceMap[y][x] != 'S') mDiv.text(distanceMap[y][x]); }
            root.append(mDiv);
        }
    }
}

const drawCreatures = (root) => {
    creatures.map((creature, index) => {
        if (creature.status != 'DEAD') {
            let cDiv = baseDiv(['creature', creature.type], creature.x, creature.y);
            cDiv.append( $('<div class="health"/>').html(creature.health) );
            root.append(cDiv);
        }
    })
}

const drawScene = () => {
    let root = $('#root');
    root.empty();
    drawMap(root);
    drawCreatures(root);
}

const computeDistanceMap = (spreadX, spreadY) => {
    let distanceMap = $.extend(true, [], map); // init
    // add creatures
    creatures.map((creature, index) => {
        if ((creature.status != 'DEAD') && ( !((spreadX == creature.x) && (spreadY == creature.y)) )) {
            distanceMap[creature.y][creature.x] = 'W'; // maybe unit type?
        }
    })
    let toSpread = [{x: spreadX, y: spreadY, dist: 0}];
    let processed = 0;
    while (processed < toSpread.length) {
        for (let i = processed; i < toSpread.length; i++) {
            let point = distanceMap[toSpread[i].y][toSpread[i].x];
            if (point != 'W') {
                if ((point == 'S') || (point > toSpread[i].dist)) {
                    distanceMap[toSpread[i].y][toSpread[i].x] = toSpread[i].dist;
                    // now spread moar
                    // spread left
                    toSpread.push({
                        x: toSpread[i].x-1,
                        y: toSpread[i].y,
                        dist: toSpread[i].dist+1
                    })
                    // spread up
                    toSpread.push({
                        x: toSpread[i].x,
                        y: toSpread[i].y-1,
                        dist: toSpread[i].dist+1
                    })
                    // spread right
                    toSpread.push({
                        x: toSpread[i].x+1,
                        y: toSpread[i].y,
                        dist: toSpread[i].dist+1
                    })
                    // spread down
                    toSpread.push({
                        x: toSpread[i].x,
                        y: toSpread[i].y+1,
                        dist: toSpread[i].dist+1
                    })
                }
            }
            processed++;
        }
    }
    return distanceMap;
}

const findAdjacentPoints = (targetCreatures, dm) => {
    let adjMap = $.extend(true, [], map); // init
    // add creatures
    creatures.map((creature, index) => {
        if (creature.status != 'DEAD') {
            adjMap[creature.y][creature.x] = 'W'; // maybe unit type?
        }
    })
    let adjacentPoints = []; // {x,y}
    targetCreatures.map(creature => {
        if (adjMap[creature.y-1][creature.x] == 'S' && dm[creature.y-1][creature.x] != 'S') adjacentPoints.push({x: creature.x, y: creature.y-1});
        if (adjMap[creature.y+1][creature.x] == 'S' && dm[creature.y+1][creature.x] != 'S') adjacentPoints.push({x: creature.x, y: creature.y+1});
        if (adjMap[creature.y][creature.x-1] == 'S' && dm[creature.y][creature.x-1] != 'S') adjacentPoints.push({x: creature.x-1, y: creature.y});
        if (adjMap[creature.y][creature.x+1] == 'S' && dm[creature.y][creature.x+1] != 'S') adjacentPoints.push({x: creature.x+1, y: creature.y});
    })
    return adjacentPoints;
}

const creatureTargets = (creature) => {
    let targetType = (creature.type == 'G' ? 'E' : 'G');
    let targets = [];
    creatures.map((c, i) => {
        if ((c.type == targetType) && (c.status != 'DEAD')) targets.push(c);
    })
    return targets;
}

const getTargetsInRange = (creature, targets) => {
    let targetsInRange = [];
    targets.map(target => {
        if ((Math.abs(target.x-creature.x) + Math.abs(target.y-creature.y)) == 1) targetsInRange.push(target);
    })
    return targetsInRange;
}

const performAttack = (from, to) => {
    to.health = Math.max(0, to.health-from.attack);
    if (to.health == 0) to.status = 'DEAD';
}

const getTotalHealth = () => {
    let h = 0;
    creatures.map(c => {
        if (c.status != 'DEAD') h = h+c.health;
    })
    return h;
}

const deads = (type) => {
    let cnt = 0;
    creatures.map(c => {
        if (c.status == "DEAD" && c.type == type) cnt++;
    })
    return cnt;
}

readInput();
drawScene();

let eob = false; // end of battle
let roundsPassed = 0;

const tick = () => {

    creatures.sort((a,b) => {
        return (a.y*mapSize+a.x) - (b.y*mapSize+b.x);
    })

    for (let i = 0; i < creatures.length; i++) {
        let creature = creatures[i];
        if (creature.status == 'DEAD') continue;

        let targets = creatureTargets(creature);
        if (targets.length == 0) {
            let h = getTotalHealth();
            console.log('battle ended with dead elves:', deads('E'), ' and dead goblins:', deads('G'), creatures);
            console.log('full rounds ticked', roundsPassed);
            console.log('remaining creatures total health', h);
            console.log('BATTLE STATUS', h*roundsPassed);
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
