let data = input.map(l => l.split('').map(n => parseInt(n))), flashes = 0, size = input.length, steps;

const every = callback => {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) callback(x, y, data[y][x])
}

const markNewFlashes = (flashable = false) => {
    every((x,y,d) => {
        if (!isNaN(d) && d > 9) {
            flashes++;
            data[y][x] = 'f';
            flashable = true;
        }
    })
    return flashable;
}

const megaFlash = () => {
    for (let y = 0; y < size; y++) for (let x = 0; x < size; x++) if (data[y][x] != 0) return false;
    return true;
}

const step = () => {
    every((x,y,d) => data[y][x]++);
    while (markNewFlashes()) {
        every((x,y,d) => {
            if (d == 'f') {
                for (let v = y-1; v <= y+1; v++) for (let u = x-1; u <= x+1; u++)
                    if (u >= 0 && v >= 0 && u < size && v < size && (u != x || v != y) && !isNaN(data[v][u])) data[v][u]++;
                data[y][x] = 'd';
            }
        })
    }
    every((x,y,d) => (d == 'd') && (data[y][x] = 0));
}

const part1 = () => {
    for (steps = 0; steps < 100; steps++) step();
    console.log(flashes);
}

const part2 = () => {
    while (!megaFlash()) {step(); steps++}
    console.log(steps);
}

part1();
part2();