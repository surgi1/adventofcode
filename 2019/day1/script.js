const fuel = mass => Math.max(0, Math.floor(mass/3) - 2);

const fuel2 = (mass, res = fuel(mass)) => res + (fuel(res) > 0 ? fuel2(res) : 0);

let data = input.split('\n').map(Number);

console.log('p1', data.map(v => fuel(v)).reduce((a, v) => a+v, 0));
console.log('p2', data.map(v => fuel2(v)).reduce((a, v) => a+v, 0));