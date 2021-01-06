let p, v, infectedNodes;

const key = (x, y) => 'node_'+x+'_'+y;

const init = input => {
    p = {x: (input[0].length-1)/2, y: (input.length-1)/2};
    v = {x: 0, y: -1};
    infectedNodes = {};
    input.map((line, y) => {
        line.split('').map((char, x) => {
            if (char == '#') infectedNodes[key(x,y)] = 'I';
        })
    })
}

const rotateRight = v => {
    return {x: -v.y, y: v.x}
}
const rotateLeft = v => {
    return {x: v.y, y: -v.x}
}

const burst = callback => {
    let k = key(p.x, p.y);
    let nodeStatus = infectedNodes[k] || 'C';
    callback(nodeStatus, k);
    p.x += v.x;
    p.y += v.y;
}

const part1 = () => {
    init(input);
    let newInfections = 0;
    for (let i = 0; i < 10000; i++) burst((nodeStatus, k) => {
        switch (nodeStatus) { // Clean -> Infected -> Clean
            case 'C':
                newInfections++;
                v = rotateLeft(v);
                infectedNodes[k] = 'I';
                break;
            case 'I':
                v = rotateRight(v);
                infectedNodes[k] = 'C';
                break;
        }
    });
    console.log('part 1', newInfections);
}

const part2 = () => {
    init(input);
    let newInfections = 0;
    for (let i = 0; i < 10000000; i++) burst((nodeStatus, k) => {
        switch (nodeStatus) { // Clean -> Weakened -> Infected -> Flagged -> Clean
            case 'C':
                v = rotateLeft(v);
                infectedNodes[k] = 'W';
                break;
            case 'W':
                newInfections++;
                infectedNodes[k] = 'I';
                break;
            case 'I':
                v = rotateRight(v);
                infectedNodes[k] = 'F';
                break;
            case 'F':
                v = rotateRight(rotateRight(v));
                infectedNodes[k] = 'C';
                break;
        }
    });
    console.log('part 2', newInfections);
}

part1();
part2();