const SIZE = 0;
const USED = 1;
const AVAIL = 2;

const part1 = () => {
    let count = 0;
    for (let i1 = 0; i1 < input.length; i1++) {
        if (input[i1].data[USED] == 0) continue;
        for (let i2 = 0; i2 < input.length; i2++) {
            if (i1 == i2) continue;
            if (input[i1].data[USED] <= input[i2].data[AVAIL]) count++;
        }
    }
    console.log('Viable pairs count', count);
}

const canMoveTo = (map, x, y) => map[y] !== undefined && map[y][x] == '.';

const spread = (map, distanceMap, x, y, dist) => {
    if ((map[y] == undefined) || (map[y][x] == undefined)) return;
    if (!distanceMap[y]) distanceMap[y] = [];
    if (!(distanceMap[y][x]) || (distanceMap[y][x] > dist)) {
        distanceMap[y][x] = dist;
        if (canMoveTo(map, x-1, y)) spread(map, distanceMap, x-1, y, dist+1);
        if (canMoveTo(map, x+1, y)) spread(map, distanceMap, x+1, y, dist+1);
        if (canMoveTo(map, x, y-1)) spread(map, distanceMap, x, y-1, dist+1);
        if (canMoveTo(map, x, y+1)) spread(map, distanceMap, x, y+1, dist+1);
    }
}

const generateDistanceMap = (map, start) => {
    let dm = [];
    spread(map, dm, start.x, start.y, 0);
    return dm;
}

const part2 = () => {
    let map = [], size = {x: 0, y: 0};
    let minSize = 100, maxData = 0, emptyNode;

    for (let i = 0; i < input.length; i++) {
        let node = input[i];
        if (!map[node.y]) map[node.y] = [];
        size.y = Math.max(size.y, node.y+1);
        size.x = Math.max(size.x, node.x+1);
        let ch = '.';
        if (node.data[SIZE] < 100) {
            if (node.data[SIZE] < minSize) minSize = node.data[SIZE];
            if (node.data[USED] > maxData) maxData = node.data[USED];
        } else {
            ch = '#'; // effectively a wall
        }
        if (node.data[USED] == 0) emptyNode = node;
        map[node.y][node.x] = ch;
    }

    if (maxData > minSize) {
        console.log('Data fitting issue; more sophisticated solution needed.');
        return;
    }

    let dm = generateDistanceMap(map, emptyNode);
    console.log('Fewest nr. of steps to move data from [x,y]', size.x-1, 0, 'to', 0, 0, ':', dm[SIZE][size.x-1]+5*(size.x-2));
}

part1();
part2();