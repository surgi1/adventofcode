const init = input => input.split("\n").map(line => line.match(/\d+/g).map(Number));

const isSafe = cols => {
    let diffs = cols.map((v, i) => !i ? cols[i+1]-v : v-cols[i-1]);
    return (Math.max(...diffs) < 0 || Math.min(...diffs) > 0) && Math.min(...diffs.map(Math.abs)) > 0 && Math.max(...diffs.map(Math.abs)) < 4
}

const run = (data, p1 = true) => data.filter(cols => isSafe(cols) || (!p1 && cols.some((_, i) => isSafe(cols.filter((_, j) => i != j))))).length

console.log('p1', run(init(input)));
console.log('p2', run(init(input), false));
