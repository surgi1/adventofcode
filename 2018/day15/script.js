var data = [
'################################',
'################.G#...##...#####',
'#######..#######..#.G..##..#####',
'#######....#####........##.#####',
'######.....#####.....GG.##.#####',
'######..GG.##.###G.........#####',
'#####........G####.......#######',
'######.#..G...####........######',
'##########....#####...G...######',
'########.......###..........####',
'#########...GG####............##',
'#########....................###',
'######........#####...E......###',
'####....G....#######........####',
'###.........#########.......####',
'#...#.G..G..#########..........#',
'#..###..#...#########E.E....E###',
'#..##...#...#########.E...E...##',
'#.....G.....#########.........##',
'#......G.G...#######........####',
'###..G...#....#####........#####',
'###########....G........EE..####',
'##########...................###',
'##########...................###',
'#######.............E....##E####',
'#######................#########',
'########.#.............#########',
'#######..#####.#......##########',
'######...#######...##.##########',
'################..###.##########',
'###############.......##########',
'################################'
];

var _data = [
'#########',
'#G..G..G#',
'#.......#',
'#.......#',
'#G..E..G#',
'#.......#',
'#.......#',
'#G..G..G#',
'#########'
]

var _data = [
'#######', //   
'#.G...#', //   G(200)
'#...EG#', //   E(200), G(200)
'#.#.#G#', //   G(200)
'#..G#E#', //   G(200), E(200)
'#.....#', //   
'#######'
]

var _data = [
'#######', //       #######
'#G..#E#', //       #...#E#   E(200)
'#E#E.E#', //       #E#...#   E(197)
'#G.##.#', //  -->  #.E##.#   E(185)
'#...#E#', //       #E..#E#   E(200), E(200)
'#...E.#', //       #.....#
'#######'
]

var _data = [
'#########', //       #########   
'#G......#', //       #.G.....#   G(137)
'#.E.#...#', //       #G.G#...#   G(200), G(200)
'#..##..G#', //       #.G##...#   G(200)
'#...##..#', //  -->  #...##..#   
'#...#...#', //       #.G.#...#   G(200)
'#.G...G.#', //       #.......#   
'#.....G.#', //       #.......#   
'#########'
]

var tickDelay = 25;
var stopRound = false;

var map = []; // [y][x]: W = wall, S = space
var mapSize = data[0].length;
var creatures = [];

function addCreature(type, x, y) {
    creatures.push({
        type: type,
        health: 200,
        attack: (type == 'E' ? 7 : 3),
        x: x,
        y: y,
        status: 'ALIVE' // DEAD
    })
}

function readInput() {
    data.map((line, y) => {
        if (!map[y]) map[y] = [];
        for (var x = 0; x < line.length; x++) {
            map[y][x] = (line[x] == '#' ? 'W' : 'S');
            if (['G', 'E'].includes(line[x])) addCreature(line[x], x, y);
        }
    })
}

function baseDiv(cls, x, y) {
    cls.push('grid_'+y+'_'+x);
    var div = $('<div />', {css: {
        left: x*16+'px',
        top: y*16+'px'
    }}).addClass(cls.join(' '));
    return div;
}

function drawMap(root) {
    for (var y = 0; y < mapSize; y++) {
        for (var x = 0; x < mapSize; x++) {
            var mDiv = baseDiv(['mappoint', map[y][x]], x, y);
            //if (distanceMap) { if (distanceMap[y][x] != 'W' && distanceMap[y][x] != 'S') mDiv.text(distanceMap[y][x]); }
            root.append(mDiv);
        }
    }
}

function drawCreatures(root) {
    creatures.map((creature, index) => {
        if (creature.status != 'DEAD') {
            var cDiv = baseDiv(['creature', creature.type], creature.x, creature.y);
            cDiv.append( $('<div class="health"/>').html(creature.health) );
            root.append(cDiv);
        }
    })
}

function drawScene() {
    var root = $('#root');
    root.empty();
    drawMap(root);
    drawCreatures(root);
}

function computeDistanceMap(spreadX, spreadY) {
    var distanceMap = $.extend(true, [], map); // init
    // add creatures
    creatures.map((creature, index) => {
        if ((creature.status != 'DEAD') && ( !((spreadX == creature.x) && (spreadY == creature.y)) )) {
            distanceMap[creature.y][creature.x] = 'W'; // maybe unit type?
        }
    })
    var toSpread = [{x: spreadX, y: spreadY, dist: 0}];
    var processed = 0;
    while (processed < toSpread.length) {
        for (var i = processed; i < toSpread.length; i++) {
            var point = distanceMap[toSpread[i].y][toSpread[i].x];
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

function findAdjacentPoints(targetCreatures, dm) {
    var adjMap = $.extend(true, [], map); // init
    // add creatures
    creatures.map((creature, index) => {
        if (creature.status != 'DEAD') {
            adjMap[creature.y][creature.x] = 'W'; // maybe unit type?
        }
    })
    var adjacentPoints = []; // {x,y}
    targetCreatures.map(creature => {
        if (adjMap[creature.y-1][creature.x] == 'S' && dm[creature.y-1][creature.x] != 'S') adjacentPoints.push({x: creature.x, y: creature.y-1});
        if (adjMap[creature.y+1][creature.x] == 'S' && dm[creature.y+1][creature.x] != 'S') adjacentPoints.push({x: creature.x, y: creature.y+1});
        if (adjMap[creature.y][creature.x-1] == 'S' && dm[creature.y][creature.x-1] != 'S') adjacentPoints.push({x: creature.x-1, y: creature.y});
        if (adjMap[creature.y][creature.x+1] == 'S' && dm[creature.y][creature.x+1] != 'S') adjacentPoints.push({x: creature.x+1, y: creature.y});
    })
    return adjacentPoints;
}

function creatureTargets(creature) {
    var targetType = (creature.type == 'G' ? 'E' : 'G');
    var targets = [];
    creatures.map((c, i) => {
        if ((c.type == targetType) && (c.status != 'DEAD')) targets.push(c);
    })
    return targets;
}

function getTargetsInRange(creature, targets) {
    var targetsInRange = [];
    targets.map(target => {
        if ((Math.abs(target.x-creature.x) + Math.abs(target.y-creature.y)) == 1) targetsInRange.push(target);
    })
    return targetsInRange;
}

function performAttack(from, to) {
    to.health = Math.max(0, to.health-from.attack);
    if (to.health == 0) to.status = 'DEAD';
}

function getTotalHealth() {
    var h = 0;
    creatures.map(c => {
        if (c.status != 'DEAD') h = h+c.health;
    })
    return h;
}

function deads(type) {
    var cnt = 0;
    creatures.map(c => {
        if (c.status == "DEAD" && c.type == type) cnt++;
    })
    return cnt;
}

readInput();

var creatureIndex = 4;
var ungluedCreaturesIds = [creatureIndex]; // later sorted of all

//creatures[0].x = 1;creatures[0].y = 3;
//for (var i = 1; i < 2; i++) creatures[i].status = 'DEAD';

drawScene();

var eob = false; // end of battle

var roundsPassed = 0;

function tick() {

    creatures.sort((a,b) => {
        return (a.y*mapSize+a.x) - (b.y*mapSize+b.x);
    })

    // move just unglued
    //for (var i = 0; i < ungluedCreaturesIds.length; i++) {
        //var creature = creatures[ungluedCreaturesIds[i]];
    for (var i = 0; i < creatures.length; i++) {
        var creature = creatures[i];
        //console.log('dealing with creature index', i);
        if (creature.status == 'DEAD') continue;

        var targets = creatureTargets(creature);
        if (targets.length == 0) {
            var h = getTotalHealth();
            console.log('battle ended with dead elves:', deads('E'), ' and dead goblins:', deads('G'), creatures);
            console.log('full rounds ticked', roundsPassed);
            console.log('remaining creatures total health', h);
            console.log('BATTLE STATUS', h*roundsPassed);
            eob = true;
            break;
        }

        // does he need to move?
        var targetsInRange = getTargetsInRange(creature, targets);
        if (targetsInRange.length == 0) {
            var dmFromCreature = computeDistanceMap(creature.x, creature.y);
            var moveTargets = findAdjacentPoints(targets, dmFromCreature);

            // if yes, can he move (at least 1 adjacent field accessible)?
            if (moveTargets.length > 0) {
                moveTargets.sort((a,b) => {
                    if (dmFromCreature[a.y][a.x] == dmFromCreature[b.y][b.x]) return (a.y*mapSize+a.x) - (b.y*mapSize+b.x);
                    return dmFromCreature[a.y][a.x] - dmFromCreature[b.y][b.x];
                })
                // we have a move target (point adjacent to closest target creature) in moveTargets[0]

                // druha dist mapa od cile pohybu
                dmFromTargetField = computeDistanceMap(moveTargets[0].x, moveTargets[0].y);
                // mozne cile pohybu
                var possibleMoves = [], x = creature.x, y = creature.y;
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

/*
results #1
full rounds ticked 70
remaining creatures total health 2683
BATTLE STATUS 187810 // not correct; too high :(

result #2 (po oprave chyby v cileni utoku)
full rounds ticked 71
remaining creatures total health 2614
BATTLE STATUS 185594 // not correct; too high :(

// rough guess rounds--: 182980 // too high as well :(

result #3 (po oprave chybneho zahrnuti nedosazitelneho mista do moznych cilu pohybu)
full rounds ticked 74
remaining creatures total health 2453
BATTLE STATUS 181522

*/


// debug stuff below this line
/*
var distanceMap = computeDistanceMap(creatures[creatureIndex].x, creatures[creatureIndex].y);

drawScene();

console.log(map);
console.log(creatures);

var adjfor0 = findAdjacentPoints(creatureTargets(creatures[creatureIndex]), distanceMap);

adjfor0.sort((a,b) => {
    if (distanceMap[a.y][a.x] == distanceMap[b.y][b.x]) return (a.y*mapSize+a.x) - (b.y*mapSize+b.x);
    return distanceMap[a.y][a.x] - distanceMap[b.y][b.x];
})

adjfor0.map(p => {
    //$('.grid_'+p.y+'_'+p.x).addClass('highlight');
})
$('.grid_'+adjfor0[0].y+'_'+adjfor0[0].x).addClass('highlight');


// druha dist mapa od cile pohybu
distanceMap = computeDistanceMap(adjfor0[0].x, adjfor0[0].y);
// mozne cile pohybu
var possibleMoves = [], x = creatures[creatureIndex].x, y = creatures[creatureIndex].y;
if (distanceMap[y][x-1] != 'W' && distanceMap[y][x-1] != 'S') possibleMoves.push({x: x-1, y: y});
if (distanceMap[y][x+1] != 'W' && distanceMap[y][x+1] != 'S') possibleMoves.push({x: x+1, y: y});
if (distanceMap[y-1][x] != 'W' && distanceMap[y-1][x] != 'S') possibleMoves.push({x: x, y: y-1});
if (distanceMap[y+1][x] != 'W' && distanceMap[y+1][x] != 'S') possibleMoves.push({x: x, y: y+1});

possibleMoves.sort((a,b) => {
    if (distanceMap[a.y][a.x] == distanceMap[b.y][b.x]) return (a.y*mapSize+a.x) - (b.y*mapSize+b.x);
    return distanceMap[a.y][a.x] - distanceMap[b.y][b.x];
})

drawScene();

$('.grid_'+possibleMoves[0].y+'_'+possibleMoves[0].x).addClass('highlight');

console.log('adj for first creature', adjfor0);
*/