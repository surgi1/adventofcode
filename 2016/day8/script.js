let screen = [], size = {x: 50, y: 6};

for (let y = 0; y < size.y; y++) {
    screen[y] = [];
    for (let x = 0; x < size.x; x++) screen[y][x] = 0;
}

const arrayRotate = arr => {
    arr.unshift(arr.pop())
    return arr;
}

const perform = line => {
    let nums = line.match(/\d+/g);
    if (line.indexOf('rect ') > -1) {
        for (let y = 0; y < nums[1]; y++) {
            for (let x = 0; x < nums[0]; x++) screen[y][x] = 1;
        }
    } else if (line.indexOf('rotate row y') > -1) {
        let arr = screen[nums[0]].slice();
        for (let i = 0; i < nums[1]; i++) arr = arrayRotate(arr);
        screen[nums[0]] = arr;
    } else if (line.indexOf('rotate column x') > -1) {
        let arr = [];
        for (let y = 0; y < size.y; y++) arr.push(screen[y][nums[0]]);
        for (let i = 0; i < nums[1]; i++) arr = arrayRotate(arr);
        for (let y = 0; y < size.y; y++) screen[y][nums[0]] = arr[y];
    } 
}

input.map(line => perform(line));

console.log('lit pixels', screen.reduce((a, row) => a+row.reduce((a, c) => a+c, 0), 0));
console.log(screen.reduce((a, row) => a+row.reduce((a,c) => a+(c ? '#' : ' '), '') +"\n", ''));