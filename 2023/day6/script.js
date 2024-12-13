const p1 = () => {
    let arr = input.split("\n").map(line => line.match(/\d+/g).map(Number));
    return arr[0].reduce((a, v, i) => {
        let ways = 0;
        for (let j = 1; j < v-1; j++) if (j * (v-j) > arr[1][i]) ways++;
        return a*ways;
    }, 1);
}

const p2 = () => {
    let arr = input.split("\n").map(line => line.match(/\d+/g).join('')).map(Number);
    let ways = 0;
    for (let j = 1; j < arr[0]-1; j++) if (j * (arr[0]-j) > arr[1]) ways++;
    return ways;
}

console.log('p1', p1());
console.log('p2', p2());