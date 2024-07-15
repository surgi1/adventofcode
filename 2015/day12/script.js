let ignoreReds = false;

const getSum = node => {
    if (typeof node === 'object' && !Array.isArray(node) && node !== null) {
        // object
        let vals = Object.values(node);
        if (ignoreReds && vals.includes('red')) return 0;
        return vals.reduce((a, v) => a + getSum(v), 0);
    } else if (Array.isArray(node)) {
        // array
        return node.reduce((a, v) => a + getSum(v), 0);
    } else {
        // primitive
        if (isNaN(node)) return 0;
        return Number(node);
    }
}

console.log('p1', getSum(input));

ignoreReds = true;
console.log('p2', getSum(input));