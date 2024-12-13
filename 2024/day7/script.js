const init = input => input.split("\n").map((line, y) => line.match(/\d+/g).map(Number))

const processLine1 = (cmpVal, _arr, tmpRes) => {
    let arr = [..._arr];
    if (tmpRes === undefined) tmpRes = arr.shift();
    if (arr.length == 0) return cmpVal == tmpRes ? cmpVal : 0;
    let n = arr.shift();
    return processLine1(cmpVal, arr, tmpRes*n) || processLine1(cmpVal, arr, tmpRes+n)
}

const processLine = (cmpVal, _arr, tmpRes) => {
    let arr = [..._arr];
    if (tmpRes === undefined) tmpRes = arr.shift();
    if (arr.length == 0) return cmpVal == tmpRes ? cmpVal : 0;
    let n = arr.shift();
    return processLine(cmpVal, arr, tmpRes*n) || processLine(cmpVal, arr, tmpRes+n) || processLine(cmpVal, arr, Number(tmpRes+''+n))
}

const run = (data, cmpFnc) => data.reduce((a, line) => a + cmpFnc(line.shift(), line), 0)

console.log('p1', run(init(input), processLine1));
console.log('p2', run(init(input), processLine));
