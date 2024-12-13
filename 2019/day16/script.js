// just part 1 here; for part 2 solution see script-part2.js

let part2Input = '';
let part2Copies = 1;
for (let i = 0; i < part2Copies; i++) {
    part2Input += input;
}
input = part2Input;
let phases = 100;

const mask = (repeats, index) => {
     let base = [1,0,-1, 0];

    if (repeats-1 > index) return 0;
    index -= repeats-1;

    if (index < repeats) return 1; // base[0]
    if (index < repeats << 1) return 0;
    if (index < repeats*3) return -1;
    if (index < repeats << 2) return 0;

    return base[Math.floor(index/repeats) % 4];
}

const applyMask = (arr, index) => {
    let output = 0, len = arr.length;

    for (let i = 0; i < len; i++) {
        let m = mask(index+1, i);
        if (m == 0) continue;
        if (m == 1) output += arr[i];
        if (m == -1) output -= arr[i];
    }

    return Math.abs(output) % 10;
}

const phase = arr => {
    let output = [], len = arr.length;

    for (let i = 0; i < len; i++) {
        output.push(applyMask(arr, i))
    }

    return output;
}

let res = input.match(/\d/g);
for (let i = 0; i < res.length; i++) {
    res[i] = parseInt(res[i]);
}
console.time('phasing');
for (let i = 0; i < phases; i++) {
    res = phase(res);
}
console.timeEnd('phasing');

let answer = '';
for (let i = 0; i < 8; i++) {
    answer += res[i];
}

console.log(answer); // part 1