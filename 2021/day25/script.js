let map = {}, rows = input.length, cols = input[0].length;

input.map((row, y) => row.split('').map((char, x) => (char != '.') && (map[y+'_'+x] = char)))

const step = (moved = 0) => {
    const moveInDir = (ch, vect, newMap = {}) => {
        Object.entries(map).map(([k, v]) => {
            if (v != ch) newMap[k] = v; else {
                let coords = k.split('_').map((n, i) => parseInt(n)+vect[i]);
                if (coords[0] > rows-1) coords[0] = 0;
                if (coords[1] > cols-1) coords[1] = 0;
                if (map[coords.join('_')] == undefined) {
                    newMap[coords.join('_')] = v;
                    moved++;
                } else newMap[k] = v;
            }
        })
        map = newMap;
    }
    moveInDir('>', [0, 1]);
    moveInDir('v', [1, 0]);
    return moved;
}

let steps = 0;
while (step() != 0) steps++;

console.log(steps+1);