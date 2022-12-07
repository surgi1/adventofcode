let nodes = [];

const createNode = (params) => {
    let newId = nodes.length;
    nodes.push({...params, id: newId})
    return newId;
}

const createNodeIfNotExists = (name, parentId) => {
    let tmp = nodes.filter(n => n.name == name && n.parentId == parentId && n.type == 'dir');
    if (tmp.length > 0) return  tmp[0].id;
    return createNode({type: 'dir', name: name, parentId: parentId})
}

const dirSize = id => nodes.filter(n => n.parentId == id).reduce((size, n) => {
    if (n.type == 'file') return size+n.size;
    return size+dirSize(n.id);
}, 0)

createNode({type: 'dir', name: ''})

let ptr = 0;
input.split("\n").map(line => {
    let cmd = line.split(' ');
    if (cmd[0] == '$') {
        if (cmd[1] == 'cd') {
            if (cmd[2] == '..') ptr = nodes[ptr].parentId || 0;
            else if (cmd[2] == '/') ptr = 0;
            else {
                // cd dir
                ptr = createNodeIfNotExists(cmd[2], ptr);
            }
        } else if (cmd[1] == 'ls') {
            // no op
        }
    } else {
        if (cmd[0] == 'dir') {
            createNodeIfNotExists(cmd[0], ptr);
        } else {
            // file in ptr node
            createNode({type: 'file', name: cmd[1], size: Number(cmd[0]), parentId: ptr});
        }
    }
})

let res = 0;
nodes.forEach(n => {
    if (n.type == 'dir') {
        let size = dirSize(n.id);
        if (size < 100000) res += size;
        nodes[n.id].size = size;
    }
})

console.log('part 1', res);

let freeSpace = 70000000 - nodes[0].size;

console.log('part 2', nodes.filter(n => n.type == 'dir' && ((freeSpace + n.size) >= 30000000)).sort((a,b) => a.size-b.size)[0].size);
