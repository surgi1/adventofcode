let data = input.map(l => l.split('').map(n => parseInt(n))), flashes = 0, size = input.length, steps = 0;

const every = (callback, box = {y:[0, size-1], x:[0, size-1]}) => {
    for (let y = box.y[0]; y <= box.y[1]; y++) for (let x = box.x[0]; x <= box.x[1]; x++)
        (x >= 0 && y >= 0 && x < size && y < size) && callback(x, y, data[y][x])
}

const markNewFlashes = (flashable = false) => {
    every((x,y,d) => {
        if (isNaN(d) || d <= 9) return;
        flashes++;
        data[y][x] = 'f';
        flashable = true;
    })
    return flashable;
}

const megaFlash = () => data.flat().every(e => e == 0)

const step = () => {
    every((x,y) => data[y][x]++);
    while (markNewFlashes()) every((x,y,d) => {
        if (d != 'f') return;
        every((u,v,q) => !isNaN(q) && data[v][u]++, {x:[x-1, x+1], y:[y-1, y+1]})
        data[y][x] = 'd';
    })
    every((x,y,d) => (d == 'd') && (data[y][x] = 0));
    if (++steps == 100) console.log(flashes); // p1
}

while (!megaFlash()) step();

console.log(steps); // p2