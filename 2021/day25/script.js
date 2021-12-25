let map = {}, dim = [input.length, input[0].length], steps = 0;

input.map((r, y) => r.split('').map((c, x) => (c != '.') && (map[y+'_'+x] = c)))

const step = (moved = 0) => {
    const moveInDir = (c, vect, newMap = {}) => {
        const move = (n, i) => n*1+vect[i] > dim[i]-1 ? 0 : n*1+vect[i];
        Object.entries(map).map(([k, v]) => {
            if (v == c) {
                let k2 = k.split('_').map(move).join('_');
                if (!map[k2]) { k = k2; moved++ }
            }
            newMap[k] = v;
        })
        map = newMap;
    }
    moveInDir('>', [0, 1]);
    moveInDir('v', [1, 0]);
    return moved;
}

while (step() != 0) steps++;

console.log(steps+1);