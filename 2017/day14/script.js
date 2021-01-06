let map = [], size = input.length;

const init = input => {
    input.map((line, y) => {
        map[y] = [];
        let x = 0;
        line.split('').map(ch => {
            let bin = parseInt(ch, 16).toString(2);
            while (bin.length < 4) bin = '0'+bin;
            for (let i = 0; i < 4; i++) {
                map[y][x] = parseInt(bin[i]);x++;
            }
        })
    })
}

const canMoveTo = (x, y) => {
    return map[y] !== undefined && map[y][x] === 1;
}

const spread = (x, y, dist = 2) => {
    map[y][x] = dist;
    if (canMoveTo(x-1, y)) spread(x-1, y);
    if (canMoveTo(x+1, y)) spread(x+1, y);
    if (canMoveTo(x, y-1)) spread(x, y-1);
    if (canMoveTo(x, y+1)) spread(x, y+1);
}

const iterMap = callback => {
    for (let y = 0; y < size; y++) {
        for (let x = 0; x < size; x++) {
            callback(x, y, map[y][x]);
        }
    }
}

const part1 = () => {
    let used = 0;
    iterMap((x, y, value) => used += (value == 1))
    console.log('part 1', used);
}

const part2 = () => {
    let regions = 0;
    iterMap((x, y, value) => {
        if (value == 1) {
            spread(x, y);
            regions++;
        }
    })
    console.log('part 2', regions);
}

init(input);
part1();
part2();