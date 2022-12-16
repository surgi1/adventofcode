let nodes = input.split("\n").map((row, id) => {
    let tmp = row.split(' ');
    return {
        id: id,
        name: tmp[1],
        rate: Number(tmp[4].match(/\d+/g)[0]),
        connections: tmp.slice(tmp.indexOf('to')+2).map(v => v.substr(0, 2))
    }
})

const nodeByName = name => nodes.filter(n => n.name == name)[0];

const distanceMap = (startName, distances = {}) => {
    const spread = (name, steps) => {
        if (distances[name] != undefined && distances[name] <= steps) return;
        distances[name] = steps;
        nodeByName(name).connections.map(n => spread(n, steps+1));
    }

    spread(startName, 0);
    
    return distances;
}

const activeNodes = () => nodes.filter(n => n.rate > 0)/*.sort((a, b) => {
    return (timeLeft-distances[b.name]-1)*b.rate - (timeLeft-distances[a.name]-1)*a.rate
})*/;

let currentNode = 'AA', timeLeft = 30;

console.log(nodes);

let distances = distanceMap(currentNode);
console.log(distances);

console.log(activeNodes().sort((a, b) => {
    return (timeLeft-distances[b.name]-1)*b.rate - (timeLeft-distances[a.name]-1)*a.rate
}))

let paths = [{curr: 'AA', active: activeNodes().map(n => n.name), timeLeft: 30, finished: false, steps: [], releasedPressure: 0}]

let max = 0;

for (let n = 0; n < paths.length; n++) {
    let path = paths[n];
    if (path.timeLeft <= 0) path.finished = true;
    if (path.finished) continue;

    let distances = distanceMap(path.curr), moved = false;
    path.active.forEach(act => {
        if (act == path.curr) return true;
        if (path.timeLeft-distances[act] <= 1) return true;
        moved = true;
        paths.push({
            curr: act,
            active: path.active.filter(v => v != act)/*.sort((na, nb) => {
                let a = nodeByName(na), b = nodeByName(nb);
                return (path.timeLeft-distances[b.name]-1)*b.rate - (path.timeLeft-distances[a.name]-1)*a.rate
            })*/,
            timeLeft: path.timeLeft-distances[act]-1,
            finished: false,
            steps: [...path.steps, act],
            releasedPressure: path.releasedPressure + (path.timeLeft-distances[act]-1)*nodeByName(act).rate
        })
    })
    if (!moved) path.finished = true;
    if (path.finished && path.releasedPressure > max) {
        console.log('we have a new max', path.releasedPressure);
        max = path.releasedPressure;
    }
}

console.log(paths.filter(p => p.finished).sort((a, b) => b.releasedPressure-a.releasedPressure));
