const init = input => input.split("\n").map(line => line.match(/\d+/g).map(Number));

const isSafe = cols => {
    let inc = cols.every((v, i) => i == 0 || v > cols[i-1]),
        dec = cols.every((v, i) => i == 0 || v < cols[i-1]),
        diffs = cols.map((v, i) => i == 0 ? 1 : Math.abs(v-cols[i-1]));
    
    return ((inc || dec) && (Math.min(...diffs) > 0) && (Math.max(...diffs) < 4))
}

const run = (data, p1 = true) => data.filter(cols => isSafe(cols) || ( !p1 && cols.some((_, i) => isSafe(cols.filter((_, j) => i != j)))) ).length

console.log('p1', run(init(input)));
console.log('p2', run(init(input), false));
