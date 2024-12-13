let map = {}, dim = [input.length, input[0].length], steps = 0, root = document.getElementById('root');

input.map((r, y) => r.split('').map((c, x) => (c != '.') && (map[y+'_'+x] = c)))

const drawInit = (a = [], s = '') => {
    for (let y = 0; y < dim[0]; y++) for (let x = 0; x < dim[1]; x++)
        s +=  `<div id="${y}_${x}" class="pt" style="left:${x*7}px;top:${y*7}px"></div>`;
    root.innerHTML = s;
}

const draw = () => {
    Array.from(document.getElementsByClassName('pt1')).forEach(e => map[e.id] != 'v' && e.classList.remove('pt1'))
    Array.from(document.getElementsByClassName('pt2')).forEach(e => map[e.id] != '>' && e.classList.remove('pt2'))
    Object.entries(map).map(([k, v]) => document.getElementById(k).classList.add('pt'+(v == 'v' ? '1' : '2')))
}

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

const tick = () => {
    draw(); steps++;
    if (step() != 0) setTimeout(tick, 0); else console.log(steps);
}

drawInit();
tick();