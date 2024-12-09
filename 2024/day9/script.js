const init = (input, arr = []) => {
    input.split('').map(Number).forEach((v, i) => {
        for (let n = 0; n < v; n++) arr.push( (i % 2 == 0) ? i/2: undefined)
    })
    return arr;
}

const checksum = arr => arr.reduce((a, v, i) => a + (v !== undefined ? v*i : 0), 0)

const p1 = (arr) => {
    let head = 0, tail = arr.length-1;

    while (head < tail) {
        while (arr[tail] === undefined) tail--; // seek tail to first non-empty space
        while (arr[head] !== undefined) head++; // seek head to first empty space
        if (head < tail) {
            arr[head] = arr[tail];
            arr[tail] = undefined;
        }
    }
    return checksum(arr);
}

const p2 = (arr) => {
    let tail = arr.length-1, seen = {};

    while (tail > 0) {
        while (arr[tail] === undefined) tail--; // seek tail to first non-empty space
        let len = 0, id = arr[tail];
        while (arr[tail-len] == id) len++; // get its length

        if (seen[id] === undefined) {
            let head = 0;
            while (head < tail-len) {
                while (arr[head] !== undefined) head++; // first empty space
                let emptyLen = 0; // get its length
                while (arr[head+emptyLen] === undefined) emptyLen++;
                if (head > tail-len) break; // no move, new position would be worse
                if (emptyLen >= len) {
                    for (let ptr = 0; ptr < len; ptr++) {
                        arr[head+ptr] = id;
                        arr[tail-ptr] = undefined;
                    }
                    break;
                }
                head += emptyLen;
            }
            seen[id] = 1;
        }

        tail -= len;
    }
    return checksum(arr);
}


console.log('p1', p1(init(input)));

console.log('p2', p2(init(input)));