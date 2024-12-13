const compute = (a, len, res = 0) => {
    a.every((v, n) => !(new Set(a.slice(n, n+len)).size == len && (res = n+len)))
    return res;
}

console.log(compute(input.split(''), 4));
console.log(compute(input.split(''), 14));