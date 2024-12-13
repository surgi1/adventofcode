const parseInput = () => {
    let ops = {};
    input.split("\n").map(line => {
        let tmp = line.split(/step /ig);
        let [a, b] = [tmp[1][0], tmp[2][0]];
        if (ops[a] == undefined) ops[a] = {completed: false, deps: []};
        if (ops[b] == undefined) ops[b] = {completed: false, deps: []};
        ops[b].deps.push(a);
    })
    return ops;
}

const part1 = () => {
    let p1 = '', ops = parseInput();
    while (Object.values(ops).filter(o => o.completed === false).length > 0) {
        let part = [];
        Object.entries(ops).map(([k, v]) => {
            if (v.completed !== true && v.deps.filter(dep => ops[dep].completed == false).length == 0) part.push(k);
        })
        part.sort((a, b) => a.localeCompare(b));
        p1 += part[0];
        ops[part[0]].completed = true;
    }
    return p1;
}

const part2 = (workersNr, baseTime) => {
    let t = 0, ops = parseInput();
    let workers = Array.from({length:workersNr}, () => ({task: '', remainingTime: 0}));

    while (Object.values(ops).filter(o => !o.completed).length > 0) {
        let part = [];
        Object.entries(ops).forEach(([k, v]) => {
            if (!v.completed && workers.filter(w => w.task == k).length == 0 && v.deps.filter(dep => !ops[dep].completed).length == 0) part.push(k);
        })
        part.sort((a, b) => b.localeCompare(a));

        while (task = part.pop()) {
            if (w = workers.filter(w => w.remainingTime == 0)?.[0]) {
                w.remainingTime = baseTime + task.charCodeAt(0) - 'A'.charCodeAt(0);
                w.task = task;
            }
        }

        //console.log(t, workers.map(w => w.task).join('|'));

        workers.filter(w => w.remainingTime > 0).forEach(w => {
            w.remainingTime--;
            if (w.remainingTime == 0) {
                ops[w.task].completed = true;
                w.task = '';
            }
        })

        t++;
    }
    return t;
}

console.log('p1', part1());
console.log('p2', part2(5, 61)); // 2, 1 for test input
