let tmp = input.split("\n");
let dirs = tmp.shift().split('');

tmp.shift();

let nodes = {}, currents = [];

tmp.forEach(line => {
    let arr = line.split(/ =|\(|\)|\,/g);
    nodes[arr[0]] = {L: arr[2], R: arr[3].trim()}
    if (arr[0][2] == 'A') currents.push(arr[0]);
})

const gcd = (a, b) => b == 0 ? a : gcd(b, a % b);
const lcm = (a, b) => a / gcd(a, b) * b;
const lcmAll = arr => arr.reduce(lcm, 1);

const getSteps = current => {
    let steps = 0;
    while (steps < 100000 && current[2] !== 'Z') {
        current = nodes[current][dirs[steps % dirs.length]];
        steps++;
    }
    return steps;
}

const part2 = () => lcmAll(currents.map(getSteps))

console.log('p1', getSteps('AAA'));
console.log('p2', part2());
