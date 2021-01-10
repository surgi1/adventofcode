const init = '.^..^....^....^^.^^.^.^^.^.....^.^..^...^^^^^^.^^^^.^.^^^^^^^.^^^^^..^.^^^.^^..^.^^.^....^.^...^^.^.';

const getRow = lastRow => {
    let row = '', len = lastRow.length;
    for (let x = 0; x < len; x++) {
        let pattern = (x > 0 ? lastRow[x-1] : '.') + lastRow[x] + (x < len-1 ? lastRow[x+1] : '.');
        row += ['.^^', '^^.', '^..', '..^'].includes(pattern) ? '^' : '.';
    }
    return row;
}

const countRow = row => row.split('').reduce((a, b) => a+(b == '.'), 0);

const countSafeTiles = rows => {
    let lastRow = init, count = countRow(lastRow);
    for (let y = 1; y < rows; y++) {
        lastRow = getRow(lastRow, y);
        count += countRow(lastRow);
    }
    return count;
}

console.log(countSafeTiles(40));
console.log(countSafeTiles(400000));
