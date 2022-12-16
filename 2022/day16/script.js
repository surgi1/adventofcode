let nodes = input.split("\n").map((row, id) => {
    let tmp = row.split(' ');
    return {
        id: id,
        name: tmp[1],
        rate: Number(tmp[4].match(/\d+/g)[0]),
        connections: tmp.slice(tmp.indexOf('to')+2).map(v => v.substr(0, 2))
    }
})

let nodeByName = {};

nodes.map((n, i) => nodeByName[n.name] = n);

const activeNodes = () => nodes.filter(n => n.rate > 0)

const distanceMap = (startName, distances = {}) => {
    if (nodeByName[startName].distanceMap) return nodeByName[startName].distanceMap;
    const spread = (name, steps) => {
        if (distances[name] != undefined && distances[name] <= steps) return;
        distances[name] = steps;
        nodeByName[name].connections.forEach(n => spread(n, steps+1));
    }
    spread(startName, 0);
    nodeByName[startName].distanceMap = distances;
    return distances;
}

let timeLeft = 26;

let paths = [{curr: 'AA', active: activeNodes().map(n => n.name), timeLeft: timeLeft, finished: false, steps: [], releasedPressure: 0}]

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
            active: path.active.filter(v => v != act),
            timeLeft: path.timeLeft-distances[act]-1,
            finished: false,
            steps: [...path.steps, act],
            releasedPressure: path.releasedPressure + (path.timeLeft-distances[act]-1)*nodeByName[act].rate
        })
    })
    if (!moved) path.finished = true;
    if (path.finished && path.releasedPressure > max) {
        console.log('we have a new max', path.releasedPressure);
        max = path.releasedPressure;
    }
}

console.log(paths.filter(p => p.finished).sort((a, b) => b.releasedPressure-a.releasedPressure)[0]);

let tmp = [];
max = 0;

let paths2 = paths.filter(p => p.finished).sort((a, b) => b.releasedPressure-a.releasedPressure)

paths2.map((p1, i1) => {
    if (i1 % 1000 == 0) console.log('processing', i1, tmp.length);
    paths2.map(p2 => {
        if (p1.steps.every(s => !p2.steps.includes(s))) {
            if (p1.releasedPressure+p2.releasedPressure > max) {
                console.log('we have a new max', p1.releasedPressure+p2.releasedPressure);
                max = p1.releasedPressure+p2.releasedPressure;
            }
        }
    })
})
