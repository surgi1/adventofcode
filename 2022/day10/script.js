let mainCycles = [20, 60, 100, 140, 180, 220],
    cycle = 1, x = 1, strengths = [],
    screen = Array(6).fill().map(e => Array(40).fill(' '));

const draw = (pos, char) => screen[Math.floor((pos % 240)/40)][pos % 40] = char;

const cycleOp = () => {
    if (mainCycles.includes(cycle)) strengths.push(cycle*x);
    draw(cycle-1, Math.abs(((cycle-1) % 40) - x) <= 1 ? '#' : ' ')
}

input.split("\n").forEach(line => {
    let tmp = line.split(' ');
    cycle++;
    cycleOp();
    if (tmp[0] == 'addx') {
        x += Number(tmp[1]);
        cycle++;
        cycleOp();
    }
})

console.log(strengths.reduce((a, v) => a+v));
console.log(screen.map(e => e.join('')).join("\n"));
