let inputRow = 2978, inputColumn = 3083, firstCode = 20151125,
    ymax = 2, xmas = 1, lastCode = firstCode, x = xmas, y = ymax, stop = false;

const nextCode = code => (code*252533) % 33554393;

while (!stop) {
    while (y > 0) {
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
