let cycle = 0, x = 1, strengths = [],
    screen = Array(6).fill().map(e => Array(40).fill(' '));

const draw = (pos, char) => screen[Math.floor(pos/40)][pos % 40] = char;
const tick = () => {
    cycle++;
    if ((cycle-20) % 40 == 0) strengths.push(cycle*x);
    draw(cycle-1, Math.abs(((cycle-1) % 40) - x) <= 1 ? '█' : ' ')
}

input.split("\n").forEach(line => {
    let cmd = line.split(' ');
    tick();
    if (cmd[0] == 'addx') {
        tick();
        x += Number(cmd[1]);
    }
})

console.log(strengths.reduce((a, v) => a+v));
document.getElementById('root').innerHTML = screen.map(e => e.join('')).join("\n");
