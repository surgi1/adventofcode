// Part 2 implementation requires weight difference to be present right from the root node.
// This was sufficient for my input; should it be not the case for yours, a slight change 
// to findUnballancedNode would be required.

let nodes = {};

Array.prototype.count = value => {
    let len = this.length, count = 0;
    for (let i = 0; i < this.length; i++) {
        if (this[i] == value) count++;
    }
    return count;
}

const readInput = input => {
    input.map(line => {
        let arr = line.split(' -> ');
        let name = arr[0].split(' ')[0];
        let weight = parseInt(arr[0].match(/\d+/g)[0]);
        let subnodes = [];
        if (arr[1]) subnodes = arr[1].split(', ');
        nodes[name] = {
            weight: weight,
            subnodes: subnodes
        }
    })
}

const getParent = nodeId => {
    let found = false;
    Object.entries(nodes).some(([name, node]) => {
        if (node.subnodes.includes(nodeId)) {
            found = name;
            return true;
        }
    })
    return found;
}

const findRoot = () => {
    let k = Object.keys(nodes)[0];
    while (getParent(k)) k = getParent(k);
    return k;
}

const nodeWeight = nodeId => {
    let weight = nodes[nodeId].weight;
    for (let i = 0; i < nodes[nodeId].subnodes.length; i++) weight += nodeWeight(nodes[nodeId].subnodes[i]);
    return weight;
}

const weightOfSubnodes = nodeId => {
    let weights = [];
    for (let i = 0; i < nodes[nodeId].subnodes.length; i++) weights.push(nodeWeight(nodes[nodeId].subnodes[i]));
    return weights;
}

const findOffballanceSubnode = nodeId => {
    let subnodesWeights = weightOfSubnodes(nodeId);
    let min = Math.min(...subnodesWeights), max = Math.max(...subnodesWeights);
    if (min != max) {
        return nodes[nodeId].subnodes[ subnodesWeights.indexOf(subnodesWeights.count(min) < subnodesWeights.count(max) ? min : max) ];
    } else {
        return false;
    }
}

readInput(input);

let nodeId = findRoot(), lastId;

console.log('root node id', nodeId);

while (true) {
    lastId = nodeId;
    nodeId = findOffballanceSubnode(nodeId);
    if (nodeId == false) {
        let weights = weightOfSubnodes(getParent(lastId)), diff = Math.max(...weights) - Math.min(...weights);
        console.log('unballanced node id is', lastId, ', its weight should be', nodes[lastId].weight-diff);
        break;
    }
}
