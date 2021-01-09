// this is a traveling salesman problem
// still used brute-force, as was quicker to implement and runs in no time

let points = [], paths = [], minFound = false, maxFound = false

const dist = (a,b) => {
    return input.filter(line => {
        if ((line[0] == a && line[1] == b) || (line[0] == b && line[1] == a)) return true;
    })[0][2];
}

input.map(line => {
    if (!points.includes(line[0])) points.push(line[0]);
    if (!points.includes(line[1])) points.push(line[1]);
})

const progressPath = (path, missingPoints) => {
    if (missingPoints.length == 1) {
        path.push(missingPoints[0]);
        paths.push(path);
    } else missingPoints.map((mp, index) => {
        let newMPs = missingPoints.slice();
        newMPs.splice(index, 1);
        let newPath = path.slice();
        newPath.push(mp);
        progressPath(newPath, newMPs);
    })
}

points.map((p,i) => progressPath([p], points.filter((pp,ii) => ii!=i)));

paths.map(path => {
    let length = 0;
    for (let i=1; i<path.length;i++) {
        length += dist(path[i-1],path[i]);
    }
    if ((!minFound) || (length < minFound)) minFound = length;
    if ((!maxFound) || (length > maxFound)) maxFound = length;
})

console.log('shortest path length', minFound);
console.log('longest path length', maxFound);