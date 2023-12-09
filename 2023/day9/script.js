let arr = input.split("\n").map(line => [line.split(' ').map(Number)]);

const diffs = row => {
    let res = [];
    for (let i = 1; i < row.length; i++) res[i-1] = row[i] - row[i - 1];
    return res;
}

arr.forEach((row, i) => {
    let step = row[0].slice();
    while (step.some(v => v !== 0)) {
        step = diffs(step);
        arr[i].push(step);
    }

    row[row.length-1].unshift(0); // p2
    row[row.length-1].push(0);

    for (let i = row.length-2; i >= 0; i--) {
        row[i].unshift(row[i][0] - row[i+1][0]); // p2
        lastId = row[i].length-1;
        row[i].push(row[i][lastId] + row[i+1][lastId]);
    }
})

console.log('p1', arr.reduce((a, v) => a + v[0].pop(), 0));
console.log('p2', arr.reduce((a, v) => a + v[0][0], 0) );
