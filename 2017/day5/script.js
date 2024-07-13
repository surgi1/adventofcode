const run = (p2 = false) => {
    let arr = input.split('\n').map(Number),
        ptr = 0, len = arr.length, jumps = 0;

    while (ptr >= 0 && ptr < len) {
        let oldPtr = ptr;
        ptr += arr[ptr];
        if (p2) {
            if (arr[oldPtr] >= 3) arr[oldPtr]--; else arr[oldPtr]++;
        } else 
            arr[oldPtr]++;
        jumps++;
    }
    return jumps;
}

console.log('p1', run());
console.log('p2', run(true));