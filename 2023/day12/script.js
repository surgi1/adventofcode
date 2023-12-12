const run = (row, copies = 1) => {
    let map = [...row[0]],
        sizes = [0, ...row[1]], // dummy zero size to have an initial variants count of 1
        memo = {};

    // number of matches till pos == mapPos, used sizes till sizeId
    const getCount = (mapPos, sizeId) => memo[k(mapPos, sizeId)] || 0;
    const k = (a, b) => a+'_'+b;

    for (let i = 1; i < copies; i++) {
        map.push('?', ...row[0]);
        sizes.push(...row[1]);
    }
    map.push('.'); // so we count the end properly

    map.forEach((v, mapPos) => sizes.forEach((size, sizeId) => {
        let cnt = 0;

        // kick start with # variants of fitting all sizes up to this one exist up to current map pos -1
        if (v == '.' || v == '?') {
            if (mapPos == 0 && sizeId == 0) cnt = 1; // start with 1 variant always
            else cnt = getCount(mapPos-1, sizeId);
        };

        if (sizeId > 0) {
            let sizeFits = true;
            
            if (v == '#') sizeFits = false; // still moving forward
            else if (map.slice(mapPos - size, mapPos).includes('.')) sizeFits = false; // current size can't fit

            // add # of variants found till this size, till map pos before this size started
            if (sizeFits) {
                if (mapPos == size && sizeId == 1) cnt = 1; // couldn't fit more yet
                else cnt += getCount(mapPos - size - 1, sizeId - 1);
            }
        }

        memo[k(mapPos, sizeId)] = cnt;
    }))

    return memo[k(map.length-1, sizes.length-1)];
}

let arr = input.split("\n").map(row => {
    let tmp = row.split(' ');
    return [tmp[0].split(''), tmp[1].split(',').map(Number)];
});

console.log('p1', arr.reduce((a, row) => a + run(row, 1), 0));
console.log('p2', arr.reduce((a, row) => a + run(row, 5), 0));
