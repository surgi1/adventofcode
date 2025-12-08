const parse = input => input.split('\n').map(line => line.split(',').map(Number))

const dist = (a, b) => a.reduce((res, v, i) => res + Math.pow(v - b[i], 2), 0); // squared

const run = (data, maxConnections) => {
    let distances = []; // {i1, i2, d}
    data.forEach((p1, i1) => data.forEach((p2, i2) => {
        if (i2 > i1) distances.push({
            i1: i1,
            i2: i2,
            d: dist(p1, p2)
        })
    }));

    distances.sort((a, b) => a.d - b.d);

    let groups = [], ptr = 0, p2result = false,
        lastConnection = [], touched = new Set();

    if (maxConnections === undefined) maxConnections = distances.length;

    while (ptr < maxConnections) {
        let i1 = distances[ptr].i1,
            i2 = distances[ptr].i2;

        touched.add(i1);
        touched.add(i2);

        if (groups.some(g => g.includes(i1) && g.includes(i2))) {
            // the points are part of a group already, no connection necessary
            ptr++;
            continue;
        }

        let g1Id = -1, g2Id = -1;
        groups.forEach((g, gId) => {
            if (g.includes(i1)) g1Id = gId;
            if (g.includes(i2)) g2Id = gId;
        })

        if (g1Id == -1 && g2Id == -1) {
            groups.push([i1, i2]);
        } else if (g1Id > -1 && g2Id == -1) {
            groups[g1Id].push(i2);
        } else if (g1Id == -1 && g2Id > -1) {
            groups[g2Id].push(i1);
        } else {
            // both are in groups, we need to create a new group
            groups.push([...groups[g1Id], ...groups[g2Id]]);
            groups = groups.filter((g, id) => id != g1Id && id != g2Id);
        }

        lastConnection = [i1, i2];

        if (groups.length == 1 && touched.size == data.length) {
            p2result = data[lastConnection[0]][0] * data[lastConnection[1]][0];
            break;
        }

        ptr++;
    }

    if (maxConnections == distances.length) return p2result;

    groups.sort((a, b) => b.length - a.length);

    return groups[0].length * groups[1].length * groups[2].length;
}

console.log('p1', run(parse(input), 1000));
console.log('p2', run(parse(input)));
