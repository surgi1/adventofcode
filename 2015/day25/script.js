var inputRow = 2978, inputColumn = 3083;
var firstCode = 20151125;

function nextCode(code) {
    return (code*252533) % 33554393;
}

var ymax = 2, xmas = 1, lastCode = firstCode,
    x = xmas, y = ymax, stop = false;

while (!stop) {
    while (y >= 1) {
        lastCode = nextCode(lastCode);
        if (y == inputRow && x == inputColumn) {
            console.log('code', lastCode, 'row', y, 'col', x);
            stop = true;
            break;
        }
        x++;
        y--;
    }
    ymax++;
    y = ymax;
    x = 1;
}
