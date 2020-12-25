var input = [11404017, 13768789], initialSN = 7;
var loopSizes = [];

function transform(num, initSN) {
    return (num*initSN) % 20201227;
}

function getKey(num, loopSize) {
    var n = num;
    for (var i = 1; i < loopSize; i++) {
        n = transform(n, num);
    }
    return n;
}

var loopSize = 2, found = 0, n = initialSN;

while (found < 2) {

    n = transform(n, initialSN);
    if (input.includes(n)) {
        console.log('found', n, 'loopsize', loopSize);
        loopSizes[input.indexOf(n)] = loopSize;
        found++;
    }

    loopSize++;
    if (loopSize % 1000000 == 0) console.log('Mtransforms so far', loopSize/1000000);

}

console.log('enc key 1', getKey(input[0], loopSizes[1]));
console.log('enc key 2', getKey(input[1], loopSizes[0]));