const initSection = lit => {
    let arr = lit.split('\n').map(line => line.split(''));
    return {
        type: arr[0][0],
        val: arr[0].map((v, col) => arr.map(row => row[col]).filter(v => v == '#').length-1)
    }
}

const init = input => input.split('\n\n');

const run = (data, res = 0) => {
    data.filter(o => o.type == '#').forEach(lock => data.filter(o => o.type == '.').forEach(key => {
        if (Math.max(...lock.val.map((v, i) => v+key.val[i])) <= 5) res++
    }))
    return res;
}

console.log('p1', run(init(input).map(initSection)))
