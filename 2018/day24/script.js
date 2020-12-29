// automatization of the final step missing as I loved to watch the battles play out

let armies = [];
let groups = [];
let timerHandle;

const init = () => {
    Object.entries(input).map(([armyName, unitsLiteral]) => {
        let army = new Army(armyName, unitsLiteral, armies.length);
        armies.push(army);
    })
}

const initRound = () => {
    groups = []
    armies.map(army => {
        groups.push(...army.getGroups('ALIVE'))
    })

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
    groups.sort((a,b) => {
        return b.initiative() - a.initiative();
    })
    groups.map(g => g.attack());

    // reset
    groups.map(g => g.reset());
}

init();

// phase 2, boost immune system
armies[0].boost(36); // 35 -> inf wins, 36 -> immune wins 5252 => yay

armies.map(a => a.log());

let ticks = 1;
let stop = false;

const tick = () => {
    round();
    console.log('Round', ticks, 'ended.');
    armies.map(a => {
        a.log();
        if (a.units() == 0) stop = true;
    });
    if (!stop) timerHandle = setTimeout(() => tick(), 10);
    ticks++;
}

tick();
