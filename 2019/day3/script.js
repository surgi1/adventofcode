// part 2 is pretty slow

let wire1 = [[0,0]], wire2 = [[0,0]], intersections = [];

let directions = {
    'D': [0,1],
    'U': [0,-1],
    'L': [-1,0],
    'R': [1,0]
}

const readInput = (input, wire) => {
    input.map(i => {
        let num = parseInt(i.match(/\d+/g)[0])
        let start = wire[wire.length-1];
        let dirVect = directions[i[0]];
        for (let i = 1; i <= num; i++) {
            wire.push([start[0]+i*dirVect[0], start[1]+i*dirVect[1]]);
        }
    })
}

const wireDistanceToPoint = (wire, point) => {
    let dist = 0;
    while (!((wire[dist][0] == point[0]) && (wire[dist][1] == point[1]))) dist++;
    return dist;
}

const dist = (a,b) => {
    if (!b) b = {x:0,y:0};
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
}

readInput(input1, wire1);
readInput(input2, wire2);

for (let i = 1; i < wire1.length; i++) {
    let found = false;
    for (let j = 1; j < wire2.length; j++) {
        if (wire1[i][0] == wire2[j][0] && wire1[i][1] == wire2[j][1]) {
            found = true;
            break;
        }
    }
    //if (found) intersections.push(dist({x:wire1[i][0], y:wire1[i][1]})); // p1
    if (found) intersections.push(wire1[i]); // p2
}

//console.log('intersections', intersections.sort((a,b) => a-b));// p1

// p2
let distances = [];
intersections.map(a => {
    distances.push(wireDistanceToPoint(wire1, a)+wireDistanceToPoint(wire2, a));
})

console.log('distances', distances.sort((a,b) => a-b));