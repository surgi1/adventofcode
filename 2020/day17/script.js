const key = p => p.join('_');
const setPoint = (map, p, state) => map[key(p)] = state;
const getCount = map => Object.values(map).length;
const getPoint = (map, p) => map[key(p)] ? map[key(p)] : false

const init = (input, map = {}) => {
    input.map((line, y) => line.split('').map((v, x) => setPoint(map, [x,y,0,0], v == '#')))
    return map;
}

const getAdjacentLights = (map, p, count = 0) => {
    for (let w = -1; w <= 1; w++)
        for (let z = -1; z <= 1; z++)
            for (let y = -1; y <= 1; y++)
                for (let x = -1; x <= 1; x++) {
                    if ((y == 0) && (x == 0) && (z == 0) && (w == 0)) continue;
                    if (getPoint(map, [p[0]+x, p[1]+y, p[2]+z, p[3]+w])) count++;
                }
    return count;
}

const getActiveBox = (map, dimensions) => {
    let min = [], max = [];
    Object.keys(map).filter(k => map[k] !== false).map(k => {
        k.split('_').map(n => parseInt(n)).map((v, index) => {
            if ((min[index] == undefined) || v < min[index]) min[index] = v;
            if ((max[index] == undefined) || v > max[index]) max[index] = v;
        })
    })
    if (dimensions < 4) {min[3] = 1; max[3] = -1}
    if (dimensions < 3) {min[2] = 1; max[2] = -1}
    return {min:min, max:max}
}

const nextState = (lastState, dimensions) => {
    let newState = {}, box = getActiveBox(lastState, dimensions);
    for (let w = box.min[3]-1; w <= box.max[3]+1; w++)
        for (let z = box.min[2]-1; z <= box.max[2]+1; z++)
            for (let y = box.min[1]-1; y <= box.max[1]+1; y++)
                for (let x = box.min[0]-1; x <= box.max[0]+1; x++) {
                    let lights = getAdjacentLights(lastState, [x,y,z,w]);
                    if (getPoint(lastState, [x,y,z,w]) === true) {
                        if (lights == 3 || lights == 2) setPoint(newState, [x,y,z,w], true);
                    } else {
                        if (lights == 3) setPoint(newState, [x,y,z,w], true);
                    }
                }
    return newState;
};

const gameOfLife = (input, dimensions, steps = 6) => {
    let newState = init(input);
    for (let y = 0; y < steps; y++) newState = nextState(newState, dimensions);
    return getCount(newState);
}

console.log('part 1', gameOfLife(input, 3));
console.log('part 2', gameOfLife(input, 4));