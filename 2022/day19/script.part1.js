const resourceTypes = {
    ORE: 0,
    CLAY: 1,
    OBSIDIAN: 2,
    GEODE: 3
}

const getBlueprintes = input => input.split("\n").map(line => {
    let tmp = line.match(/\d+/g).map(Number), bots = [];
    bots.push({
        type: resourceTypes.ORE,
        cost: [{
            type: resourceTypes.ORE,
            amount: tmp[1]
        }]
    })
    bots.push({
        type: resourceTypes.CLAY,
        cost: [{
            type: resourceTypes.ORE,
            amount: tmp[2]
        }]
    })
    bots.push({
        type: resourceTypes.OBSIDIAN,
        cost: [{
            type: resourceTypes.ORE,
            amount: tmp[3]
        }, {
            type: resourceTypes.CLAY,
            amount: tmp[4]
        }]
    })
    bots.push({
        type: resourceTypes.GEODE,
        cost: [{
            type: resourceTypes.ORE,
            amount: tmp[5]
        }, {
            type: resourceTypes.OBSIDIAN,
            amount: tmp[6]
        }]
    })

    return {
        id: tmp[0],
        bots: bots
    }
})

const run = bp => {

    const canBuildBot = (type, resourcePool) => bp.bots[type].cost.every(c => resourcePool[c.type] >= c.amount)
    const buildBot = (type, resourcePool) => {
        let rp = resourcePool.slice();
        bp.bots[type].cost.forEach(c => rp[c.type] -= c.amount)
        return rp;
    }
    const advancePool = (resourcePool, bots) => {
        let rp = resourcePool.slice();
        bots.forEach((bots, type) => rp[type] += bots);
        return rp;
    }

    let paths = [{bots: [1, 0, 0, 0], timeLeft: 24, steps: [], finished: false, resourcePool: [0, 0, 0, 0]}];
    let i = 0, maxResult = 0;

    let visited = new Set();

    while (paths.length) {
        let path = paths.pop();
        path.steps.push([path.resourcePool.join(', '), path.bots.join(', ')]);

        /*let k = path.steps.map(s => s[1]).flat().join('_');
        if (visited.has(k)) continue;
        visited.add(k);*/

        if (path.timeLeft <= 0) {
            path.finished = true;
            //console.log('a finished path', maxResult, path);
        }
        if (path.resourcePool[resourceTypes.GEODE] > maxResult) {
            maxResult = path.resourcePool[resourceTypes.GEODE];
            console.log('new max', maxResult, path);
        }
        if (path.finished) continue;

        let referenceRP = path.resourcePool.slice();
        let advancedRP = advancePool(path.resourcePool, path.bots);

        let attempts = [], built = false, noBuiltOption = true;
        if (path.timeLeft > 1) {
            if (canBuildBot(resourceTypes.GEODE, referenceRP)) {
                attempts.push(resourceTypes.GEODE);
                noBuiltOption = false;
            } else if (canBuildBot(resourceTypes.OBSIDIAN, referenceRP)) {
                attempts.push(resourceTypes.OBSIDIAN);
                noBuiltOption = false;
            } else {
                if (path.bots[resourceTypes.ORE] < 4) attempts.push(resourceTypes.ORE);
                attempts.push(resourceTypes.CLAY);
            }
        }

        // default path, let's advance
        if (noBuiltOption) paths.push({
            timeLeft: path.timeLeft-1,
            bots: path.bots.slice(),
            steps: path.steps.slice(),
            resourcePool: advancedRP.slice()
        });

        attempts.forEach(botType => {
            if (canBuildBot(botType, referenceRP)) {
                let tmp = {
                    timeLeft: path.timeLeft-1,
                    bots: path.bots.slice(),
                    steps: path.steps.slice(),
                    resourcePool: advancedRP
                }
                tmp.bots[botType]++;
                tmp.resourcePool = buildBot(botType, advancedRP);

                paths.push(tmp);
                built = true;
            }
        })


        i++; if (i > 10000000) {console.log('em break'); break}
    }

    console.log('paths', paths);

    return maxResult;
}

let res = 0;


let blueprints = getBlueprintes(input);

blueprints.forEach((bp, bpId) => {
    console.log('*****************************', bpId+1);
    res += run(bp)*(bpId+1);
})

console.log('part1', res);

// 1607 too low 
// 1656 too low
// 1725 star p1