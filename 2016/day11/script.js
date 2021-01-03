const minFloor = 1, maxFloor = 4;
let baseState = [];

baseState.push(
    {type: 'generator', element: 'promethium', floor: 1},
    {type: 'microchip', element: 'promethium', floor: 1},
    {type: 'generator', element: 'elerium', floor: 1},
    {type: 'microchip', element: 'elerium', floor: 1},
    {type: 'generator', element: 'dilithium', floor: 1},
    {type: 'microchip', element: 'dilithium', floor: 1},
    {type: 'generator', element: 'cobalt', floor: 2},
    {type: 'generator', element: 'curium', floor: 2},
    {type: 'generator', element: 'ruthenium', floor: 2},
    {type: 'generator', element: 'plutonium', floor: 2},
    {type: 'microchip', element: 'cobalt', floor: 3},
    {type: 'microchip', element: 'curium', floor: 3},
    {type: 'microchip', element: 'ruthenium', floor: 3},
    {type: 'microchip', element: 'plutonium', floor: 3},
    {type: 'elevator', floor: 1}
)
baseState.map((item, id) => item.id = id);

const getGeneratorFor = (element, state) => {
    return state.filter(item => item.type == 'generator' && item.element == element)[0];
}

const validate = state => {
    let valid = true;
    // power-up microchip shields first
    state.filter(item => item.type == 'microchip').map(microchip => {
        microchip.shielded = (getGeneratorFor(microchip.element, state).floor == microchip.floor);
    })

    state.filter(item => item.type == 'microchip' && !item.shielded).some(microchip => {
        if (state.filter(item => item.type == 'generator' && item.floor == microchip.floor).length > 0) {
            valid = false;
            return true;
        }
    })
    return valid;
}

const footprint = state => {
    let fp = '';
    state.map(item => fp += item.floor);
    return parseInt(fp);
}

const getItemCombinations = (availableItemIds, includeDuos = true) => {
    let itemCombinations = [];
    availableItemIds.map(itemId => itemCombinations.push([itemId]));
    if (!includeDuos) return itemCombinations;
    for (let i = 0; i < availableItemIds.length; i++) {
        for (let j = i; j < availableItemIds.length; j++) {
            if (i != j) itemCombinations.push([availableItemIds[i], availableItemIds[j]]);
        }
    }
    return itemCombinations;
}

const constructNextStates = (state, floor, movedItemIdsArr) => {
    let nextStates = [];
    movedItemIdsArr.map(idsToMove => {
        let nextState = $.extend(true, [], state);
        nextState.filter(i => i.type == 'elevator')[0].floor = floor;
        idsToMove.map(idToMove => nextState[idToMove].floor = floor);
        nextStates.push(nextState);
    })
    return nextStates.filter(st => validate(st));
}

const nextStates = (state, significantStateMode) => {
    let nextStates = [];
    let elevator = state.filter(item => item.type == 'elevator')[0];

    let availableItemIds = [];
    state.filter(item => item.type != 'elevator' && item.floor == elevator.floor).map(item => availableItemIds.push(item.id));
    let itemCombinationsUp = getItemCombinations(availableItemIds);
    let itemCombinationsDown;

    if (significantStateMode == 'all') {
        availableItemIds = [];
        state.filter(item => item.type == 'microchip' && item.floor == elevator.floor).map(item => availableItemIds.push(item.id));
        itemCombinationsDown = getItemCombinations(availableItemIds, false);
    } else {
        itemCombinationsDown = itemCombinationsUp;
    }

    if (elevator.floor < maxFloor) {
        nextStates.push(...constructNextStates(state, elevator.floor+1, itemCombinationsUp));
    }
    if (elevator.floor > minFloor) {
        nextStates.push(...constructNextStates(state, elevator.floor-1, itemCombinationsDown));
    }
    return nextStates;
}

const significantState = (state, floor, count, mode) => {
    let valid = true;
    if (mode == 'generators') {
        let generatorsOnTop = state.filter(item => item.type == 'generator' && item.floor >= floor).length;
        if (generatorsOnTop < count) valid = false;
    } else {
        let itemsOnTop = state.filter(item => item.floor >= maxFloor).length;
        if (itemsOnTop < state.length) valid = false;
    }
    return valid;
}

let statesReached = [],
    stop = false,
    paths = [{ticks: 0, state: $.extend(true, [], baseState)}],
    pathsIterFrom = 0, pathsIterTo = paths.length,
    endingPath = false,
    floorToFill = maxFloor-1,
    generatorsToFill = 1,
    significantStateMode = 'generators';

while (true) {

    while (!stop && paths.length > pathsIterFrom) {
        pathsIterTo = paths.length;
        for (let pathId = pathsIterFrom; pathId < pathsIterTo; pathId++) {
            let path = paths[pathId];
            let fp = footprint(path.state);
            if (statesReached[fp] !== undefined && statesReached[fp] < path.ticks) {
                continue;
            } else {
                statesReached[fp] = path.ticks;
            }
            if (significantState(path.state, floorToFill, generatorsToFill, significantStateMode)) {
                if (significantStateMode != 'all') console.log('Significant state reached', path, 'with', generatorsToFill, 'generators on the floor nr.', floorToFill);
                endingPath = $.extend(true, {}, path);
                stop = true;
                break;
            }
            nextStates(path.state, significantStateMode).map(ns => {
                let newPath = $.extend(true, {}, path);
                newPath.state = ns;
                newPath.ticks += 1;
                paths.push(newPath);
            })
        }
        pathsIterFrom = pathsIterTo;
    }

    if (significantStateMode == 'all') {
        console.log('All items are on the max floor', endingPath, '! The job took', endingPath.ticks, 'elevator rides.');
        break;
    }

    paths = [endingPath];
    pathsIterFrom = 0;
    stop = false;

    generatorsToFill++;
    if (generatorsToFill > baseState.filter(item => item.type == 'generator').length) {
        generatorsToFill = 1;
        floorToFill++;
    }

    if (floorToFill > maxFloor) {
        console.log('All generators are on the max floor', endingPath, ', moving the microchips now...');
        significantStateMode = 'all';
    }

}
