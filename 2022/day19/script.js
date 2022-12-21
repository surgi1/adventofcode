// just part 2, for part 1 check script.part1.js

// inception! need to rewrite this, instead by stepping 1 second at a time
// we need to figure out what are all the next bots we can possibly build
// (that make also sense to build) and ffwd directly to that time (TBD)

const types = {
    ORE: 0,
    CLAY: 1,
    OBSIDIAN: 2,
    GEODE: 3
}

const getBlueprintes = input => input.split("\n").map(line => {
    let tmp = line.match(/\d+/g).map(Number), bots = [];
    bots.push({
        cost: [{
            type: types.ORE,
            amount: tmp[1]
        }]
    }, {
        cost: [{
            type: types.ORE,
            amount: tmp[2]
        }]
    }, {
        cost: [{
            type: types.ORE,
            amount: tmp[3]
        }, {
            type: types.CLAY,
            amount: tmp[4]
        }]
    }, {
        cost: [{
            type: types.ORE,
            amount: tmp[5]
        }, {
            type: types.OBSIDIAN,
            amount: tmp[6]
        }]
    })

    return bots;
})

const run = (bp, timeLeft) => {
    const getBotCost = (botType, costType) => bp[botType].cost.filter(c => c.type == costType)[0].amount
    const canBuildBot = (type, resourcePool) => bp[type].cost.every(c => resourcePool[c.type] >= c.amount)
    const buildBot = (type, resourcePool) => {
        let rp = resourcePool.slice();
        bp[type].cost.forEach(c => rp[c.type] -= c.amount)
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

        if (path.resourcePool[types.GEODE] >= 1 && path.timeLeft > earliestGeoge) {
            earliestGeoge = path.timeLeft;
        }

        if (path.timeLeft < earliestGeoge && path.resourcePool[types.GEODE] == 0) continue;

        if (path.timeLeft <= 0) {
            path.finished = true;
            if (path.resourcePool[types.GEODE] > maxResult) {
                maxResult = path.resourcePool[types.GEODE];
            }
        }
        if (path.finished) continue;

        let referenceRP = path.resourcePool.slice();
        let advancedRP = advancePool(path.resourcePool, path.bots);

        let attempts = [], noBuiltOption = true;

        if (path.timeLeft > 1) {
            if (canBuildBot(types.GEODE, referenceRP)) {
                attempts.push(types.GEODE);
                noBuiltOption = false;
            } else if (canBuildBot(types.OBSIDIAN, referenceRP)) {
                attempts.push(types.OBSIDIAN);
                noBuiltOption = false;
            } else {
                if (path.bots[types.OBSIDIAN] <= 2) {
                    if (path.timeLeft > 10) {
                        if (path.bots[types.ORE] == 1) {
                            attempts.push(types.ORE);
                            if (canBuildBot(types.ORE, referenceRP)) noBuiltOption = false;
                        } else {
                            if (path.bots[types.ORE] < 3) attempts.push(types.ORE);
                            if (path.bots[types.CLAY] < getBotCost(types.OBSIDIAN, types.CLAY)-1) attempts.push(types.CLAY);
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
            }
        })

        i++; if (i > 10000000) {console.log('em break');break}
    }

    return maxResult;
}

const part2 = blueprints => blueprints.slice(0, 3).reduce((res, bp, bpId) => res * run(bp, 32), 1)

let blueprints = getBlueprintes(input);

console.log('part2', part2(blueprints));


/*
// this branch pruning works on both parts, but just on my input

if (path.timeLeft > 1) {
    if (canBuildBot(types.GEODE, referenceRP)) {
        attempts.push(types.GEODE);
        noBuiltOption = false;
    } else if (canBuildBot(types.OBSIDIAN, referenceRP)) {
        attempts.push(types.OBSIDIAN);
        noBuiltOption = false;
    } else {
        if (path.bots[types.OBSIDIAN] <= 2) {
            if (path.timeLeft > 10) {
                if (path.bots[types.ORE] == 1) {
                    attempts.push(types.ORE);
                    if (canBuildBot(types.ORE, referenceRP)) noBuiltOption = false;
                } else {
                    if (path.bots[types.ORE] < 3) attempts.push(types.ORE);
                    if (path.bots[types.CLAY] < bp.bots[2].cost[1].amount-1) attempts.push(types.CLAY);
                }
            }
        }
    }
}
*/