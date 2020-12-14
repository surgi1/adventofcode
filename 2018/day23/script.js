// this is 50% zooming approach
// intended to add some sublevel sampling, but wasn't necessary (read: got lucky with input data)
// code is sketchy, taken directly from the first successful manually-assisted attempt

function botWithLargestR() {
    var id = -1;
    var rMax = 0;
    input.map((bot,index) => {
        if (bot.r > rMax) {
            id = index;
            rMax = bot.r;
        }
    })
    return id;
}

function botWithSmallestR() {
    var id = -1;
    var rMin = 83044472;
    input.map((bot,index) => {
        if (bot.r < rMin) {
            id = index;
            rMin = bot.r;
        }
    })
    return id;
}

function dist(id1, id2) {
    var dist = 0;
    for (var i = 0; i < 3; i++) {
        dist += Math.abs(input[id1].pos[i]-input[id2].pos[i]);
    }
    return dist;
}

function dist2point(id, pos) {
    var dist = 0;
    for (var i = 0; i < 3; i++) {
        dist += Math.abs(input[id].pos[i]-pos[i]);
    }
    return dist;
}

function distP2P(pos1, pos2) {
    var dist = 0;
    for (var i = 0; i < 3; i++) {
        dist += Math.abs(pos1[i]-pos2[i]);
    }
    return dist;
}

function botsWithinBot(botId) {
    var bots = 0;
    var r = input[botId].r;
    for (var i = 0; i < input.length; i++) {
        if (dist(botId, i) <= r) bots++;
    }
    return bots;
}

function botsReachingBot(botId) {
    var bots = 0;
    for (var i = 0; i < input.length; i++) {
        if (dist(botId, i) <= input[i].r) bots++;
    }
    return bots;
}

function botsReachingPoint(p) {
    var bots = 0;
    for (var i = 0; i < input.length; i++) {
        if (dist2point(i,p) <= input[i].r) bots++;
    }
    return bots;
}


// p1
var botId = botWithLargestR();
console.log('largest radius', input[botId].r, 'nr of bots within its range', botsWithinBot(botId));

function maxDim(dim) {
    var maxDim = 0;
    for (var i = 0; i < input.length; i++) {
        maxDim = Math.max(maxDim, input[i].pos[dim]);
    }
    return maxDim;
}

function minDim(dim) {
    var minDim = 0;
    for (var i = 0; i < input.length; i++) {
        minDim = Math.min(minDim, input[i].pos[dim]);
    }
    return minDim;
}


// zoom level 1

var cubes = 100; // seemingly regions [48, 42, 39] are interesting

// zoom 0
var minPos = [minDim(0), minDim(1), minDim(2)];
var maxPos = [maxDim(0), maxDim(1), maxDim(2)];
var absSize = [Math.abs(maxPos[0]-minPos[0]), Math.abs(maxPos[1]-minPos[1]), Math.abs(maxPos[2]-minPos[2])];
var divPos = [Math.round(absSize[0]/cubes), Math.round(absSize[1]/cubes), Math.round(absSize[2]/cubes)];

console.log('abs size', absSize, 'min', minPos, 'max', maxPos, 'div', divPos);

var zooms = [
[48, 42, 39],
[51, 49, 51],
[50, 50, 50],
[51, 49, 49],
[50, 48, 63],
[64, 52, 16],
[22, 63, 66],
[50, 49, 53],
[38, 54, 68],
[84, 8, 40],
[39, 67, 52],
[39, 97, 19],
[3, 81, 98],
[8, 85, 85],
[4, 85, 92],
[1, 86, 96],
[0, 95, 87],
[0, 95, 86],
[4, 74, 99],
[1, 81, 99],
[0, 52, 99]
]

// zoom
for (var i = 0;i<zooms.length; i++) {
    var start = minPos.slice();
    minPos = [start[0]+Math.round([zooms[i][0]-25]*divPos[0]), start[1]+Math.round([zooms[i][1]-25]*divPos[1]), start[2]+Math.round([zooms[i][2]-25]*divPos[2])];
    maxPos = [start[0]+Math.round([zooms[i][0]+25]*divPos[0]), start[1]+Math.round([zooms[i][1]+25]*divPos[1]), start[2]+Math.round([zooms[i][2]+25]*divPos[2])];
    absSize = [Math.abs(maxPos[0]-minPos[0]), Math.abs(maxPos[1]-minPos[1]), Math.abs(maxPos[2]-minPos[2])];
    divPos = [Math.round(absSize[0]/cubes), Math.round(absSize[1]/cubes), Math.round(absSize[2]/cubes)];

    console.log('abs size', absSize, 'min', minPos, 'max', maxPos, 'div', divPos);
}

var pFound = [];
var foundMax = 0;
/*
// sampling
for (var x = 0; x < cubes; x++) {
    console.log('going for x', x);
    var pos = [];
    pos[0] = minPos[0] + x*divPos[0] + Math.round(divPos[0]/2);
    for (var y = 0; y < cubes; y++) {
        pos[1] = minPos[1] + y*divPos[1] + Math.round(divPos[1]/2);
        for (var z = 0; z < cubes; z++) {
            pos[2] = minPos[2] + z*divPos[2] + Math.round(divPos[2]/2);
            var nr = botsReachingPoint(pos);
            if (nr > foundMax) {
                foundMax = nr;
                pFound = [x,y,z];
                console.log('new max', foundMax, ' close to', pos, pFound);
            }
            //if (z == 50 && y == 50) console.log('nr', nr, ' close to', pos, [x,y,z], 'dist to our bot id 67', dist2point(67, pos));
        }
    }    
}
*/

// final check

foundMax = 910;
var minDistanceToZero = false;
var zero = [0,0,0];

for (var x = minPos[0]; x <= maxPos[0]; x++) {
    console.log('going for x', x);
    for (var y = minPos[1]; y <= maxPos[1]; y++) {
        for (var z = minPos[2]; z <= maxPos[2]; z++) {

            var pos = [x,y,z];
            var nr = botsReachingPoint(pos);
            if (nr > foundMax) {
                console.log('ALERT ALERT', nr);
            }
            if (nr == foundMax) {
                var d2zero = distP2P(zero, pos);
                if ((minDistanceToZero === false) || (d2zero < minDistanceToZero)) {
                    minDistanceToZero = d2zero;
                    pFound = [x,y,z];
                    //console.log('new max', foundMax, ' close to', pos, pFound, 'dist to our bot id 67', dist2point(67, pos));
                    console.log('shortest dist to zero found', minDistanceToZero, pFound);
                }
            }

        }
    }
}

// 96145480 too high
// 95541011  OH YEAH
