/*let input = 'NNCB';
let synt = {
'CH': 'B',
'HH': 'N',
'CB': 'H',
'NH': 'C',
'HB': 'C',
'HC': 'B',
'HN': 'C',
'NN': 'C',
'BH': 'H',
'NC': 'B',
'NB': 'B',
'BN': 'B',
'BB': 'N',
'BC': 'B',
'CC': 'N',
'CN': 'C'
}
*/
let nodes = [];

const addNode = params => nodes.push({...params, id: nodes.length})-1

input.split('').map((l, i) => addNode({
    l:l,
    left: i > 0 ? i-1 : undefined,
    right: i < input.length-1 ? i+1 : undefined,
}))

const step = () => {
    let currentNode = nodes[nodes[0].right];
    while (currentNode != undefined) {
        let from = nodes[currentNode.left].l+currentNode.l;
        if (synt[from]) {
            let newNodeId = addNode({l: synt[from], left: nodes[currentNode.left].id, right: currentNode.id});
            nodes[currentNode.left].right = newNodeId;
            currentNode.left = newNodeId;
        }
        currentNode = nodes[currentNode.right];
    }
}

const freq = () => {
    let freq = {};
    nodes.forEach(n => {
        if (!freq[n.l]) freq[n.l] = {l:n.l, count:0};
        freq[n.l].count++;
    })
    console.log(Object.values(freq).sort((a, b) => a.count-b.count));
}

const display = (s = '', nId = 0) => {
    while (nodes[nId].right != undefined) {s += nodes[nId].l; nId = nodes[nId].right}
    return s+nodes[nId].l
}

for (let i = 0; i < 40; i++) step();
//freq();
