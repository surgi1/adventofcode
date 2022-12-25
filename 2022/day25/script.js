const snafuVals = {'2': 2, '1': 1, '0': 0, '-': -1, '=': -2}
const snafuVal = d => Object.entries(snafuVals).filter(([k, v]) => v == d)[0][0]
const snafu2dec = snafu => snafu.split('').reverse().reduce((a, v, i) => a+Math.pow(5, i)*snafuVals[v], 0)
const maxSnafu = i => snafu2dec('2'.repeat(i+1))

const dec2snafu = (dec, i, j, snafu = '') => {
    while (dec != 0) {
        j = i;
        i = 0;
        while (maxSnafu(i) < Math.abs(dec)) i++;
        let inc = Math.round(dec/Math.pow(5, i));
        snafu += '0'.repeat(Math.max(0, j-i-1)) + snafuVal(inc);
        dec -= inc*Math.pow(5, i)
    }
    return snafu+'0'.repeat(i);
}

console.log(dec2snafu(input.split("\n").reduce((a, v) => a+snafu2dec(v), 0)));