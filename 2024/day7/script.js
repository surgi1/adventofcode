const init = input => input.split("\n").map((line, y) => line.match(/\d+/g).map(Number))

const processLine1 = (cmpVal, _arr, tmpRes) => {
    let arr = [..._arr];
    if (tmpRes === undefined) tmpRes = arr.pop();
    if (arr.length == 0) return cmpVal == tmpRes;
    let n = arr.pop();
    return processLine1(cmpVal, arr, tmpRes*n) || processLine1(cmpVal, arr, tmpRes+n)
}

const processLine = (cmpVal, _arr, tmpRes) => {
    let arr = [..._arr];
    if (tmpRes === undefined) tmpRes = arr.pop();
    if (arr.length == 0) return cmpVal == tmpRes;
    let n = arr.pop();
    return processLine(cmpVal, arr, tmpRes*n) || processLine(cmpVal, arr, tmpRes+n) || processLine(cmpVal, arr, Number(tmpRes+''+n))
}

const run = (data, cmpFnc) => data.reduce((res, line) => {
    line = line.reverse();
    let cmpVal = line.pop();
    return res + (cmpFnc(cmpVal, line) ? cmpVal : 0);
}, 0)


console.log('p1', run(init(input), processLine1));
console.log('p2', run(init(input), processLine));
