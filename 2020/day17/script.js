// just the 4-d version for part 2
let map = {}, steps = 6;

const key = (x, y, z, w) => x+'_'+y+'_'+z+'_'+w;
const setPoint = (map, x, y, z, w, state) => map[key(x, y, z, w)] = state;
const getCount = map => Object.values(map).length;

const getPoint = (map, x, y, z, w) => {
    let result = false;
    let k = key(x, y, z, w);
    if (map[k]) return map[k];
    return false;
}

const readInput = () => {
    for (let y = 0; y < input.length; y++) {
        let line = input[y];
        for (let x = 0; x < line.length; x++) {
            if (line[x] == '#') setPoint(map, x,y,0,0, true);
        }
    }
}

const getAdjacentLights = (map, xx, yy, zz, ww) => {
    let count = 0;
    for (let l = -1; l <= 1; l++) {
        let w = ww+l;
        for (let k = -1; k <= 1; k++) {
            let z = zz+k;
            for (let i = -1; i <= 1; i++) {
                let y = yy+i;
                for (let j = -1; j <= 1; j++) {
                    let x = xx+j;
                    if ((i == 0) && (j == 0) && (k == 0) && (l == 0)) continue;
                    if (getPoint(map, x,y,z,w)) count++;
                }
            }
        }
    }
    return count;
}

const size = map => {
    let min = {}, max = {}, keys = Object.keys(map), len = keys.length;
    for (let i = 0; i < len; i++) {
        if (!map[keys[i]]) continue;
        let k = keys[i].split('_');
        ['x','y','z','w'].map((coord, index) => {
            if ((min[coord] == undefined) || k[index] < min[coord]) min[coord] = parseInt(k[index]);
            if ((max[coord] == undefined) || k[index] > max[coord]) max[coord] = parseInt(k[index]);
        })
    }
    return {min:min, max:max}
}

const nextState = lastState => {
    let newState = {};
    let dim = size(lastState);

    for (let w = dim.min.w-1; w <= dim.max.w+1; w++) {
        for (let z = dim.min.z-1; z <= dim.max.z+1; z++) {
            for (let y = dim.min.y-1; y <= dim.max.y+1; y++) {
                for (let x = dim.min.x-1; x <= dim.max.x+1; x++) {
                    let lights = getAdjacentLights(lastState, x, y, z, w);
                    // GOL rules
                    if (getPoint(lastState, x,y,z,w) === true) {
                        if (lights == 3 || lights == 2) setPoint(newState, x, y, z, w, true);
                    } else {
                        if (lights == 3) setPoint(newState, x, y, z, w, true)
                    }

                }
            }
        }
    }

    return newState;
};

readInput();

let newState = map;
for (let i = 0; i < steps; i++) newState = nextState(newState);

console.log('lights on', getCount(newState));
