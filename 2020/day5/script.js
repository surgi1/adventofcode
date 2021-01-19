let min = Math.min(...data),
    max = Math.max(...data);

console.log('part 1', max);
console.log('part 2', data.filter(a => a > min && a < max && !data.includes(a+1))[0]+1);