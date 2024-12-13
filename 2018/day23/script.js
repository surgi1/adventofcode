// this is 50% zooming approach
// intended to add some sublevel sampling, but wasn't necessary (easy input)
// part 2 is pretty slow, as it samples 100^3 cubes in each step, could be sped up by adaptive sampling

const botWithLargestR = () => input.sort((a, b) => b.r-a.r)[0];
const dist = (b1, b2) => [0,1,2].reduce((a, i) => a+Math.abs(b1.pos[i]-b2.pos[i]), 0)
const botsWithinBot = bot => input.filter(b => dist(bot, b) <= bot.r).length
const dist2point = (bot, pos) => [0,1,2].reduce((a, i) => a+Math.abs(bot.pos[i]-pos[i]), 0)
const distP2P = (pos1, pos2) => [0,1,2].reduce((a, i) => a+Math.abs(pos1[i]-pos2[i]), 0)
const maxDim = dim => input.reduce((a, b) => a = Math.max(a, b.pos[dim]), 0)
const minDim = dim => input.reduce((a, b) => a = Math.min(a, b.pos[dim]), 0)
const botsReachingPoint = p => input.filter(b => dist2point(b,p) <= b.r).length
const part1 = () => console.log('Nr of bots within its range of bot with largest radius (part 1 answer)', botsWithinBot(botWithLargestR()));

const part2 = () => {
    let cubes = 100;
    let foundMaxBots = 0; // nr of nanobots in best segment

    // init zoom 0
    let minPos = [minDim(0), minDim(1), minDim(2)];
    let maxPos = [maxDim(0), maxDim(1), maxDim(2)];
    let absSize = [Math.abs(maxPos[0]-minPos[0]), Math.abs(maxPos[1]-minPos[1]), Math.abs(maxPos[2]-minPos[2])];
    let divPos = [Math.round(absSize[0]/cubes), Math.round(absSize[1]/cubes), Math.round(absSize[2]/cubes)];

    const zoom = segment => {
        let start = minPos.slice();
        minPos = [start[0]+Math.round([segment[0]-25]*divPos[0]), start[1]+Math.round([segment[1]-25]*divPos[1]), start[2]+Math.round([segment[2]-25]*divPos[2])];
        maxPos = [start[0]+Math.round([segment[0]+25]*divPos[0]), start[1]+Math.round([segment[1]+25]*divPos[1]), start[2]+Math.round([segment[2]+25]*divPos[2])];
        absSize = [Math.abs(maxPos[0]-minPos[0]), Math.abs(maxPos[1]-minPos[1]), Math.abs(maxPos[2]-minPos[2])];
        divPos = [Math.round(absSize[0]/cubes), Math.round(absSize[1]/cubes), Math.round(absSize[2]/cubes)];
    }

    const sample = () => {
        foundMaxBots = 0;
        let segment = [];
        for (let x = 0; x < cubes; x++) {
            let pos = [];
            pos[0] = minPos[0] + x*divPos[0] + Math.round(divPos[0]/2);
            for (let y = 0; y < cubes; y++) {
                pos[1] = minPos[1] + y*divPos[1] + Math.round(divPos[1]/2);
                for (let z = 0; z < cubes; z++) {
                    pos[2] = minPos[2] + z*divPos[2] + Math.round(divPos[2]/2);
                    let nr = botsReachingPoint(pos);
                    if (nr > foundMaxBots) {
                        foundMaxBots = nr;
                        segment = [x,y,z];
                    }
                }
            }    
        }
        console.log('Zooming 50% down with center in subsegment', segment, 'with', foundMaxBots, 'nanobots in range.');
        return segment;
    }

    const segmentFullScan = () => {
        console.log('Performing full scan of segment of size', absSize);
        let minDistanceToZero = false;
        for (let x = minPos[0]; x <= maxPos[0]; x++) {
            for (let y = minPos[1]; y <= maxPos[1]; y++) {
                for (let z = minPos[2]; z <= maxPos[2]; z++) {
                    let pos = [x,y,z], nr = botsReachingPoint(pos);
                    if (nr > foundMaxBots) console.log('Maximum found nanobots value from sampling does not hold', foundMaxBots, 'vs', nr, '. The result will be flawed.');
                    if (nr == foundMaxBots) {
                        let d2zero = distP2P([0,0,0], pos);
                        if ((minDistanceToZero === false) || (d2zero < minDistanceToZero)) minDistanceToZero = d2zero;
                    }

                }
            }
        }
        return minDistanceToZero;
    }

    while (absSize[0]*absSize[1]*absSize[2] > 10000000) zoom(sample());
    console.log('part 2 answer', segmentFullScan());
}

part1();
part2();
