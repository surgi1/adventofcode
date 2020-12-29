// p2 is pretty slow, around 7 minutes

let data = [2,20,0,4,1,17];
//let stopNr = 2020; // p1
let stopNr = 30000000; // p2

let history = [];
let len = data.length;

data.map((d,i) => history[d] = [i]);

let last = data.pop();

console.time('runtime');
for (let i = len; i < stopNr; i++) {
    let num = 0;
    if (history[last].length > 1) num = history[last][1]-history[last].shift();

    if (!history[num]) history[num] = [];
    history[num].push(i);

    last = num;
}
console.timeEnd('runtime');

console.log(last);
