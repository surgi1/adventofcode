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
const duos = (a, res = []) => {
    for (let i = 0; i < a.length; i++) for (let j = 0; j<a.length; j++) if (i != j) res.push([a[i], a[j]]);
    return res
}

const sortDuos = (duos, d1, d2, t1, t2) => {
    const valueFromDuo = ([target1, target2]) => (t1-d1[target1]-1)*nodeByName[target1].rate + (t2-d2[target2]-1)*nodeByName[target2].rate
    return duos.sort((duo1, duo2) => valueFromDuo(duo1) - valueFromDuo(duo2))
}

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

console.log(nodes);

let paths = [{curr1: 'AA', curr2: 'AA', active: activeNodes().map(n => n.name), timeLeft1: 26, timeLeft2: 26, finished: false, finished1: false, finished2: false, /*steps1: [], steps2: [], */releasedPressure: 0}]

let max = 0, i = 0;

while (paths.length) {
    let path = paths.pop();

    if (path.finished) continue;

    let distances1 = distanceMap(path.curr1),
        distances2 = distanceMap(path.curr2),
        moved1 = false, moved2 = false, moved = false;

    let nextStepDuos = duos(path.active.filter(v => v != path.curr1 && v != path.curr2));

    //nextStepDuos = sortDuos(nextStepDuos, distances1, distances2, path.timeLeft1, path.timeLeft2)
    
    nextStepDuos.forEach(([act1, act2]) => {
        if (path.timeLeft1-distances1[act1] > 1) moved1 = true;
        if (path.timeLeft2-distances2[act2] > 1) moved2 = true;
        moved = moved1 || moved2;
        let tmp = {
            finished: false, finished1: false, finished2: false,
            active: path.active.filter(v => v != act1 && v != act2),
            releasedPressure: path.releasedPressure
        };

        if (moved1 && !path.finished1) {
            tmp.curr1 = act1;
            tmp.timeLeft1 = path.timeLeft1-distances1[act1]-1;
            tmp.releasedPressure += (path.timeLeft1-distances1[act1]-1)*nodeByName[act1].rate;
        } else {
            tmp.curr1 = path.curr1;
            tmp.timeLeft1 = path.timeLeft1;
            tmp.finished1 = true;
        }

        if (moved2 && !path.finished2) {
            tmp.curr2 = act2;
            tmp.timeLeft2 = path.timeLeft2-distances2[act2]-1;
            tmp.releasedPressure += (path.timeLeft2-distances2[act2]-1)*nodeByName[act2].rate;
        } else {
            tmp.curr2 = path.curr2;
            tmp.timeLeft2 = path.timeLeft2;
            tmp.finished2 = true;
        }

        paths.push(tmp);
    })
    if (!moved) path.finished = true;
    if (path.finished && path.releasedPressure > max) {
        console.log('we have a new max', path.releasedPressure/*, path.steps1.join(', '), ' | ', path.steps2.join(', ')*/, path);
        max = path.releasedPressure;
    }
    i++;
    if (i % 10000000 == 0) console.log('still on it', i/10000000);
    if (i > 60000000000) {console.log('em break'); break}
}

console.log(paths.filter(p => p.finished).sort((a, b) => b.releasedPressure-a.releasedPressure));
// 2500 too low
// 2525 