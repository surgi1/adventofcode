//var input = '80871224585914546619083218645595';
var part2Input = '';
var part2Copies = 1;
for (var i = 0; i < part2Copies; i++) {
    part2Input += input;
}
input = part2Input;
var phases = 100;

function mask(repeats, index) {
    // repeat = 1 => 1,0,-1,0,1,0,-1, ...
    // repeat = 2 => 0,1,1,0,0,-1,-1,0,0,1,1,0,0,-1,-1
    // repeat = 3 => 0,0,1,1,1,0,0,0,-1,-1,-1,0,0,0,1,1,1,0,0,0,-1,-1,-1
    // repeat = n => (n-1) * 0, n * 1, n * 0, n * -1, n * 0, ...
     var base = [1,0,-1, 0];

    if (repeats-1 > index) return 0;
    index -= repeats-1;

    if (index < repeats) return 1; // base[0]
    if (index < repeats << 1) return 0;
    if (index < repeats*3) return -1;
    if (index < repeats << 2) return 0;

    //if (repeats == 1) return base[index % 4];

    return base[Math.floor(index/repeats) % 4];
}

function applyMask(arr, index) {
    var output = 0, len = arr.length;

    for (var i = 0; i < len; i++) {
        var m = mask(index+1, i);
        if (m == 0) continue;
        if (m == 1) output += arr[i];
        if (m == -1) output -= arr[i];
    }

    return Math.abs(output) % 10;
}

function phase(arr) {
    var output = [], len = arr.length;

    for (var i = 0; i < len; i++) {
        output.push(applyMask(arr, i))
    }

    return output;
}

var res = input.match(/\d/g);
for (var i = 0; i < res.length; i++) {
    res[i] = parseInt(res[i]);
}
console.time('phasing');
for (var i = 0; i < phases; i++) {
    res = phase(res);
}
console.timeEnd('phasing');

var answer = '';
for (var i = 0; i < 8; i++) {
    answer += res[i];
}

console.log(answer); // part 1