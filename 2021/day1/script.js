const compute = a => a.reduce((r, v, i) => r += (i > 0 && v > a[i-1]), 0)
const map2Thrices = a => a.map((v, i) => i < a.length-2 ? v+a[i+1]+a[i+2] : 0)

console.log(compute(input));
console.log(compute(map2Thrices(input)));