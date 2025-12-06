const parse = input => {
    let tmp = input.split('\n');
    let ops = tmp.pop();
    return [tmp.map(line => line.match(/\d+/g).map(Number)), ops.match(/(\+|\*)/g)]
}

const transpose = arr => arr[0].map((_, i) => arr.map(row => row[i]));

const run1 = ([data, ops]) => transpose(data).reduce((res, row, i) => res + row.reduce((a, v) => ops[i] == '+' ? a+v : a*v, ops[i] == '+' ? 0 : 1 ), 0)

const parse2 = input => input.split('\n').map(line => line.split(''));

const run2 = data => {
    let ops = data.pop().join('').match(/(\+|\*)/g);

    data = transpose(data).map(row => Number(row.join('')));

    let opId = 0, res = 0,
        subRes = ops[opId] == '+' ? 0 : 1;

    for (let i = 0; i <= data.length; i++) {
        if (data[i] == 0 || i == data.length) {
            res += subRes;
            opId++;
            subRes = ops[opId] == '+' ? 0 : 1;
            continue;
        }
        subRes = ops[opId] == '+' ? subRes + data[i] : subRes * data[i];
    }
    return res;
}

console.log('p1', run1(parse(input)));
console.log('p2', run2(parse2(input)));
