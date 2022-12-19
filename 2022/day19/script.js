// just part 2

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

const run = (bp, timeLeft) => {

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

    let paths = [{bots: [1, 0, 0, 0], timeLeft: timeLeft, steps: [], finished: false, resourcePool: [0, 0, 0, 0]}];
    let i = 0, maxResult = 0, earliestGeoge = 0;

    while (paths.length) {
        let path = paths.pop();
        path.steps.push([path.resourcePool.join(', '), path.bots.join(', ')]);

        if (path.resourcePool[resourceTypes.GEODE] >= 1 && path.timeLeft > earliestGeoge) {
            earliestGeoge = path.timeLeft;
        }

        if (path.timeLeft < earliestGeoge && path.resourcePool[resourceTypes.GEODE] == 0) continue;

        if (path.timeLeft <= 0) {
            path.finished = true;
            if (path.resourcePool[resourceTypes.GEODE] > maxResult) {
                maxResult = path.resourcePool[resourceTypes.GEODE];
                console.log('new max', maxResult, path);
            }
        }
        if (path.finished) continue;

        let referenceRP = path.resourcePool.slice();
        let advancedRP = advancePool(path.resourcePool, path.bots);

        let attempts = [], noBuiltOption = true;

        if (path.timeLeft > 1) {
            if (canBuildBot(resourceTypes.GEODE, referenceRP)) {
                attempts.push(resourceTypes.GEODE);
                noBuiltOption = false;
            } else if (canBuildBot(resourceTypes.OBSIDIAN, referenceRP)) {
                attempts.push(resourceTypes.OBSIDIAN);
                noBuiltOption = false;
            } else {
                if (path.bots[resourceTypes.OBSIDIAN] <= 2) {
                    if (path.timeLeft > 10) {
                        if (path.bots[resourceTypes.ORE] == 1) {
                            attempts.push(resourceTypes.ORE);
                            if (canBuildBot(resourceTypes.ORE, referenceRP)) noBuiltOption = false;
                        } else {
                            if (path.bots[resourceTypes.ORE] < 3) attempts.push(resourceTypes.ORE);
                            if (path.bots[resourceTypes.CLAY] < bp.bots[2].cost[1].amount-1) attempts.push(resourceTypes.CLAY);
                        }
                    }
                }
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

    return maxResult;
}

let res = 1;

let blueprints = getBlueprintes(input);

//run(blueprints[1], 32);

blueprints.slice(0, 3).forEach((bp, bpId) => {
    console.log('***************************** START ', bpId+1);
    let p = run(bp, 32);
    console.log('***************************** RESULT ', bpId+1, p);
    res *= p;
})

console.log('part2', res);

