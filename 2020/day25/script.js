let input = [11404017, 13768789], initialSN = 7,
    loopSizes = [], loopSize = 2, found = 0, n = initialSN;

const transform = (num, initSN) => (num*initSN) % 20201227;

const getKey = (num, loopSize) => {
    let n = num;
    for (let i = 1; i < loopSize; i++) n = transform(n, num);
    return n;
}

while (found < 2) {
    n = transform(n, initialSN);
    if (input.includes(n)) {
        loopSizes[input.indexOf(n)] = loopSize;
        found++;
    }
    loopSize++;
}

console.log('enc key', getKey(input[0], loopSizes[1]));