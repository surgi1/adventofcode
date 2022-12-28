const minFloor = 1, maxFloor = 4;
let baseState = [
    {type: 'generator', element: 'promethium', floor: 1},
    {type: 'microchip', element: 'promethium', floor: 1},
    {type: 'generator', element: 'cobalt', floor: 2},
    {type: 'generator', element: 'curium', floor: 2},
    {type: 'generator', element: 'ruthenium', floor: 2},
    {type: 'generator', element: 'plutonium', floor: 2},
    {type: 'microchip', element: 'cobalt', floor: 3},
    {type: 'microchip', element: 'curium', floor: 3},
    {type: 'microchip', element: 'ruthenium', floor: 3},
    {type: 'microchip', element: 'plutonium', floor: 3},
    {type: 'elevator', floor: 1}
]
baseState.forEach((item, id) => item.id = id);

const cloneState = state => state.map(e => ({...e}))
const generatorFor = (element, state) => state.filter(i => i.type == 'generator' && i.element == element)[0]
const generators = (state, floor) => state.filter(i => i.type == 'generator' && (floor === undefined ? true : i.floor == floor) );
const chips = (state, shielded) => state.filter(i => i.type == 'microchip' && (shielded === undefined ? true : i.shielded === shielded) );
const elevator = state => state.filter(i => i.type == 'elevator')[0];
const itemsOnFloor = (state, floor) => state.filter(i => i.type != 'elevator' && i.floor == floor);
const allOnTop = state => state.every(i => i.floor == maxFloor)
const byFloor = (a, b) => a.floor - b.floor;

const validate = state => {
    // power-up microchip shields first
    chips(state).forEach(m => {
        m.shielded = (generatorFor(m.element, state).floor == m.floor);
    })

    return chips(state, false).every(m => generators(state, m.floor).length == 0)
}

const getItemCombinations = availableItemIds => {
    let itemCombinations = availableItemIds.map(i => [i]);
    for (let i = 0; i < availableItemIds.length; i++)
        for (let j = i+1; j < availableItemIds.length; j++)
            itemCombinations.push([availableItemIds[i], availableItemIds[j]]);
    return itemCombinations;
}

const constructNextStates = (state, floor, combs) => combs.map(idsToMove => {
    let nextState = cloneState(state);
    elevator(nextState).floor = floor;
    idsToMove.forEach(id => nextState[id].floor = floor);
    return nextState;
}).filter(s => validate(s))

const nextStates = state => {
    let nextStates = [], elFloor = elevator(state).floor,
        itemCombination = getItemCombinations(itemsOnFloor(state, elFloor).map(i => i.id));

    if (elFloor < maxFloor) nextStates.push(...constructNextStates(state, elFloor+1, itemCombination));
    if (elFloor > minFloor) nextStates.push(...constructNextStates(state, elFloor-1, itemCombination));

    return nextStates;
}

// this is the trick: state reduction; as lots of them are in fact the same
const footprint = state => elevator(state).floor
        + generators(state).sort(byFloor).map(i => i.floor).join('_')
        + chips(state).sort(byFloor).map(i => i.floor).join('_');

const run = () => {
    let statesReached = new Set(),
        paths = [{ticks: 0, state: cloneState(baseState)}];

    while (true) {
        let path = paths.shift();
        let k = footprint(path.state);
        if (statesReached.has(k)) continue;
        statesReached.add(k);

        if (allOnTop(path.state)) return path;

        nextStates(path.state).forEach(state => paths.push({ticks: path.ticks+1, state: state}))
    }
}

const part2 = () => {
    baseState.push(
        {type: 'generator', element: 'elerium', floor: 1},
        {type: 'microchip', element: 'elerium', floor: 1},
        {type: 'generator', element: 'dilithium', floor: 1},
        {type: 'microchip', element: 'dilithium', floor: 1}
    )
    baseState.forEach((item, id) => item.id = id);
    return run();
}

console.log('part 1', run().ticks);
console.log('part 2', part2().ticks);