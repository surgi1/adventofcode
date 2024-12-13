let list = [], steps = 363, currentId = 1;

const addNode = (params = {}) => {
    let id = list.length;
    list.push({
        id: id,
        left: params.left,
        right: params.right
    })
    return id;
}

const initList = () => {
    list = []; currentId = 1;
    addNode({left: 1, right: 1});
    addNode({left: 0, right: 0});
}

const right = node => list[node.right];
const left = node => list[node.left];

const connect = (nodeId1, nodeId2) => {
    list[nodeId1].right = nodeId2;
    list[nodeId2].left = nodeId1;
}

const process = iterations => {
    for (var i = 0; i < iterations-1; i++) {
        if (i % 100000 == 99999) console.log('MTicks', (i+1)/1000000);
        for (k = 0; k < steps; k++) currentId = list[currentId].right;
        let newNodeId = addNode();
        connect(newNodeId, list[currentId].right);
        connect(currentId, newNodeId);
        currentId = newNodeId;
    }
}

const part1 = () => {
    initList();
    process(2017);
    console.log(right(list[currentId]).id);
}

// ugly brute-force for now
// the optimal solution would be to figure out where we can stop processing since there is no chance that 0 will become currentId again
// still finishes in couple of minutes
const part2 = () => {
    initList();
    process(50000000);
    console.log(list[0].right);
}

part1();
//part2();