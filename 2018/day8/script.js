let nodes = [];

const addNode = (rootId) => {
    let id = nodes.length;
    nodes.push({id: id, rootId: rootId, metadata: [], subnodes: []});
    if (rootId !== undefined) nodes[rootId].subnodes.push(id);
    return id;
}

let arr = input.match(/\d+/g).map(Number);

const parseNode = (i = 0, rootId) => {
    let subnodes = arr[i], metadatas = arr[i+1];
    i += 2;
    let newId = addNode(rootId);
    for (let n = 0; n < subnodes; n++) i = parseNode(i, newId);
    for (let m = 0; m < metadatas; m++) nodes[newId].metadata.push(arr[i+m]);
    return i + metadatas;
}

const sumNodeData = id => nodes[id].metadata.reduce((a, v) => a+v, 0) + nodes[id].subnodes.map(snId => sumNodeData(snId)).reduce((a, v) => a+v, 0);

const nodeValue = id => {
    if (nodes[id] == undefined) return 0;
    if (nodes[id].subnodes.length == 0) return nodes[id].metadata.reduce((a, v) => a+v, 0);
    return nodes[id].metadata.map(mdat => mdat == 0 ? 0 : nodeValue(nodes[id].subnodes[mdat-1])).reduce((a, v) => a+v, 0);
}


parseNode();

console.log('p1', sumNodeData(0));
console.log('p2', nodeValue(0));