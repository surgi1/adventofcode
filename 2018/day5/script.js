const processOnce = arr => {
    const reductable = (a, b) => a !== b && a.toLowerCase() === b.toLowerCase();

    let res = [], len = arr.length;

    for (let i = 0; i < len; i++) {
        if ((i+1 < len) && reductable(arr[i], arr[i+1])) {
            i++;
            continue;
        }
        res.push(arr[i]);
    }

    return res;
}

const run = (arr, len) => {
    while (len !== arr.length) {
        len = arr.length;
        arr = processOnce(arr);
    }

    return arr.length;
}

const part2 = (arr, min = Number.MAX_SAFE_INTEGER) => {
    const augmentArr = (arr, omit) => arr.filter(w => w.toUpperCase() !== omit)

    for (let l = 0; l < 26; l++)
        min = Math.min(min, run(augmentArr(arr, String.fromCharCode(65+l))))

    return min;
}

console.log('p1', run(input.split('')));

console.log('p2', part2(input.split('')));