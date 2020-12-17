var wire1 = [[0,0]];
var wire2 = [[0,0]];

var directions = {
    'D': [0,1],
    'U': [0,-1],
    'L': [-1,0],
    'R': [1,0]
}

function readInput(input, wire) {
    input.map(i => {
        var num = parseInt(i.match(/\d+/g)[0])
        var start = wire[wire.length-1];
        var dirVect = directions[i[0]];
        for (var i = 1; i <= num; i++) {
            wire.push([start[0]+i*dirVect[0], start[1]+i*dirVect[1]]);
        }
    })
}

function wireDistanceToPoint(wire, point) {
    var dist = 0;
    while (!((wire[dist][0] == point[0]) && (wire[dist][1] == point[1]))) dist++;
    return dist;
}

function dist(a,b) {
    if (!b) b = {x:0,y:0};
    return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);
}

readInput(input1, wire1);
readInput(input2, wire2);

console.log(wire1, wire2);

var intersections = [];

for (var i = 1; i < wire1.length; i++) {
    var found = false;
    for (var j = 1; j < wire2.length; j++) {
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
var distances = [];
intersections.map(a => {
    distances.push(wireDistanceToPoint(wire1, a)+wireDistanceToPoint(wire2, a));
})

console.log('distances', distances.sort((a,b) => a-b));