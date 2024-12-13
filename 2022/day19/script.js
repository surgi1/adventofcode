const types = {
    ORE: 0,
    CLAY: 1,
    OBSIDIAN: 2,
    GEODE: 3
}

const getBlueprints = input => input.split("\n").map(line => {
    let tmp = line.match(/\d+/g).map(Number);
    return [[{
        type: types.ORE,
        amount: tmp[1]
    }], [{
        type: types.ORE,
        amount: tmp[2]
    }], [{
        type: types.ORE,
        amount: tmp[3]
    }, {
        type: types.CLAY,
        amount: tmp[4]
    }], [{
        type: types.ORE,
        amount: tmp[5]
    }, {
        type: types.OBSIDIAN,
        amount: tmp[6]
    }]]
})

const run = (bp, timeLeft) => {
    const getBotCost = (botType, costType) => bp[botType].filter(c => c.type == costType)[0].amount
    const canBuildBot = (type, resourcePool) => bp[type].every(c => resourcePool[c.type] > 0)
    const buildBot = (type, resourcePool) => {
        let rp = resourcePool.slice();
        bp[type].forEach(c => rp[c.type] -= c.amount)
        return rp;
    }

    const advancePool = (resourcePool, bots, mult = 1) => {
        let rp = resourcePool.slice();
        bots.forEach((bots, type) => rp[type] += bots*mult);
        return rp;
    }

    const addBot = (type, bots) => {
        bots[type]++;
        return bots;
    }

    const spitPathIfPossible = (path, botType, minRemainingT) => {
        if (!canBuildBot(botType, path.bots)) return 0;
        let t = Math.max(0, ...bp[botType].map(c => Math.ceil((c.amount-path.resourcePool[c.type])/path.bots[c.type])))
        if (path.timeLeft - t >= minRemainingT) return paths.push({
            timeLeft: path.timeLeft-t-1,
            bots: addBot(botType, path.bots.slice()),
            resourcePool: buildBot(botType, advancePool(path.resourcePool, path.bots, t+1))
        })
        return 0;
    }

    let paths = [{bots: [1, 0, 0, 0], timeLeft: timeLeft, resourcePool: [0, 0, 0, 0]}];
    let maxResult = 0, earliestGeode = 0;

    while (paths.length) {
        let path = paths.pop();

        if (path.resourcePool[types.GEODE] > 0 && path.timeLeft > earliestGeode) earliestGeode = path.timeLeft;
        if (path.timeLeft < earliestGeode && path.resourcePool[types.GEODE] == 0) continue;

        if (path.timeLeft <= 0) {
            maxResult = Math.max(maxResult, path.resourcePool[types.GEODE]);
            continue;
        }

        let spitPaths = 0;

        spitPaths += spitPathIfPossible(path, types.GEODE, 1);
        spitPaths += spitPathIfPossible(path, types.OBSIDIAN, 4);

        if (path.bots[types.CLAY] < getBotCost(types.OBSIDIAN, types.CLAY)-1)
            spitPaths += spitPathIfPossible(path, types.CLAY, 7);
       
        if (path.bots[types.ORE] < 4)
            spitPaths += spitPathIfPossible(path, types.ORE, 16);

        if (!spitPaths) paths.push({
            timeLeft: 0,
            bots: path.bots.slice(),
            resourcePool: advancePool(path.resourcePool, path.bots, path.timeLeft)
        })
    }

    return maxResult;
}

const part1 = blueprints => blueprints.reduce((res, bp, bpId) => res + run(bp, 24)*(bpId+1), 0)
const part2 = blueprints => blueprints.slice(0, 3).reduce((res, bp, bpId) => res * run(bp, 32), 1)

let blueprints = getBlueprints(input);

console.log('part1', part1(blueprints));
console.log('part2', part2(blueprints));
