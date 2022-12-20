let nodes = [];

const addNode = value => {
    nodes.push({
        id: nodes.length,
        value: value,
        leftId: nodes.length-1,
        rightId: nodes.length+1
    })
}

const left = nodeId => nodes[nodeId].leftId;
const right = nodeId => nodes[nodeId].rightId;
const byValue = value => nodes.filter(n => n.value == value)[0];

const moveNode = (node, moves) => {
    let absMoves = Math.abs(moves) % (nodes.length-1);
    if (absMoves == 0) return;
    let leftId = node.leftId, rightId = node.rightId, nodeId = node.id;
    let moveFnc = moves > 0 ? right : left;
    for (let m = 0; m < absMoves; m++) nodeId = moveFnc(nodeId);
    if (moves < 0) {
        // disconnect original node, connect it to the left of the target
        node.leftId = nodes[nodeId].leftId;
        node.rightId = nodeId;
    } else {
        node.leftId = nodeId;
        node.rightId = nodes[nodeId].rightId;
    }
    // common
    nodes[node.leftId].rightId = node.id;
    nodes[node.rightId].leftId = node.id;
    // remove original links
    nodes[leftId].rightId = rightId;
    nodes[rightId].leftId = leftId;
}

const run = (input, mult = 1, shuffles = 1) => {
    nodes = [];
    input.split("\n").map(n => addNode(Number(n)*mult))
    nodes[0].leftId = nodes.length-1;
    nodes[nodes.length-1].rightId = 0;

    while (shuffles--) input.split("\n").map((n, id) => moveNode(nodes[id], Number(n)*mult));

    return [1000, 2000, 3000].reduce((a, n) => {
        let zeroNodeId = byValue(0).id, nodeId = zeroNodeId;
        for (let i = 0; i < n; i++) nodeId = right(nodeId);
        return a + nodes[nodeId].value;
    }, 0);
}

console.log(run(input));
console.log(run(input, 811589153, 10));
