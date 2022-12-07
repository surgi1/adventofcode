const computeSizes = () => nodes.filter(n => n.type == 'dir').map(n => n.size = dirSize(n.id))
const createNode = params => nodes.push({...params, id: nodes.length})-1;
const dirSize = id => nodes[id].size || nodes.filter(n => n.parentId == id).reduce((a, n) => (n.type == 'file' ? a+n.size : a+dirSize(n.id)), 0)

const createNodeIfNotExists = (name, parentId) => {
    let tmp = nodes.filter(n => n.name == name && n.parentId == parentId && n.type == 'dir');
    if (tmp.length > 0) return tmp[0].id;
    return createNode({type: 'dir', name: name, parentId: parentId})
}

const processInput = () => {
    let ptr = createNode({type: 'dir', name: ''})

    input.split("\n").map(line => {
        let cmd = line.split(' ');
        if (cmd[0] == '$') {
            if (cmd[1] == 'cd') {
                if (cmd[2] == '..') ptr = nodes[ptr].parentId || 0;
                else if (cmd[2] == '/') ptr = 0;
                else ptr = createNodeIfNotExists(cmd[2], ptr); // cd dir
            }
        } else {
            if (cmd[0] == 'dir')
                createNodeIfNotExists(cmd[0], ptr);
            else {
                createNode({type: 'file', name: cmd[1], size: Number(cmd[0]), parentId: ptr});
            }
        }
    })
}

let nodes = [];

processInput();
computeSizes();

console.log('part 1', nodes.filter(n => n.type == 'dir' && n.size <= 100000).reduce((a, n) => a+n.size, 0));
console.log('part 2', nodes.filter(n => n.type == 'dir' && ((70000000-nodes[0].size + n.size) >= 30000000)).sort((a,b) => a.size-b.size)[0].size);
