const dirSize = id => nodes[id].size || nodes.filter(n => n.parentId == id).reduce((a, n) => (n.type == 'file' ? a+n.size : a+dirSize(n.id)), 0)
const computeSizes = () => nodes.filter(n => n.type == 'dir').map(n => n.size = dirSize(n.id))

const processInput = (nodes = []) => {
    const createNode = params => nodes.push({...params, id: nodes.length})-1;
    const cDir = (name, parentId) => {
        let tmp = nodes.filter(n => n.name == name && n.parentId == parentId && n.type == 'dir');
        return tmp.length > 0 ? tmp[0].id : createNode({
            type: 'dir',
            name: name,
            parentId: parentId
        })
    }

    let ptr = createNode({type: 'dir', name: ''});
    input.split("\n").forEach(line => {
        let cmd = line.split(' ');
        if (cmd[0] == '$') {
            if (cmd[1] == 'cd' && cmd[2] != '/')
                ptr = cmd[2] == '..' ? nodes[ptr].parentId || 0 : cDir(cmd[2], ptr);
        } else if (cmd[0] !== 'dir') createNode({
            type: 'file',
            name: cmd[1],
            size: Number(cmd[0]),
            parentId: ptr
        });
    })
    return nodes;
}

let nodes = processInput();
computeSizes();

console.log(nodes.filter(n => n.type == 'dir' && n.size <= 1e5).reduce((a, n) => a+n.size, 0));
console.log(nodes.filter(n => n.type == 'dir' && 4e7 + n.size >= nodes[0].size).sort((a,b) => a.size-b.size)[0].size);
