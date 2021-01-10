let armies = [], groups = [], boost = 0;

const init = () => {
    armies = [];
    Object.entries(input).map(([armyName, unitsLiteral]) => {
        let army = new Army(armyName, unitsLiteral, armies.length);
        armies.push(army);
    })
}

const initRound = () => {
    groups = [];
    armies.map(army => groups.push(...army.getGroups('ALIVE')))

    groups.sort((a,b) => {
        if (a.effectivePower() == b.effectivePower()) {
            return b.initiative() - a.initiative();
        } else {
            return b.effectivePower() - a.effectivePower();
        }
    })
}

const round = () => {
    initRound();
    // targeting
    groups.map(group => group.pickTarget(groups.filter( g => (g.armyId != group.armyId && !g.targeted) ) ));
    // attacking, after re-sort
    groups.sort((a,b) => b.initiative() - a.initiative())
    groups.map(g => g.attack());
    // reset
    groups.map(g => g.reset());
}

const battle = () => {
    init();
    armies[0].boost(boost);
    let stop = false, defeated, lastUnits = [0, 0], units = [1, 1];

    while (!stop) {
        if (lastUnits[0] == units[0] && lastUnits[1] == units[1]) {
            console.log('Battle with Immune System army boost', boost, 'will never be over; terminating.');
            armies.map(a => a.log());
            defeated = 'Deuce'; stop = true;
        } else {
            lastUnits = units.slice();
        }
        round();
        armies.map((a, i) => {
            units[i] = a.units();
            if (units[i] == 0) {
                defeated = a.name;
                console.log('Battle with Immune System army boost', boost, 'is over,', defeated, 'lost.')
                armies.map(a => a.log());
                stop = true;
            }
        });
    }
    return defeated;
}

while (['Immune System', 'Deuce'].includes(battle())) boost++;