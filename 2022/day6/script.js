const compute = (packetLen, res = 0) => {
    let a = input.split('');
    a.every((v, n) => {
        if (new Set(a.slice(n, n+packetLen)).size == packetLen) {
            res = n+packetLen;
            return false;
        }
        return true;
    })
    return res;
}

console.log(compute(4));
console.log(compute(14));