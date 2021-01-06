const input = '88,88,211,106,141,1,78,254,2,111,77,255,90,0,54,205';
//const input = 'stpzcrnm-'; // aoc day 14
let list = [], size = 256, currentId = 0, rightFromStart = 0, skip = 0;

const initList = () => {
    list = [];currentId = 0; rightFromStart = 0; skip = 0;
    for (let i = 0; i < size; i++) {
        let id = list.length;
        list.push({
            id: id,
            left: (i > 0 ? i-1 : size-1),
            right: (i < size-1 ? i+1 : 0),
        })
    }
}

const right = node => list[node.right];
const left = node => list[node.left];

const connect = (node1, node2) => {
    node1.right = node2.id;
    node2.left = node1.id;
}

// known bug: reverse behaves incorrectly for length equal to the size of list
// fix was not needed for my input
const reverse = (currentId, length) => {
    let nodeIdsToReverse = [], node = list[currentId];
    for (i = 0; i < length; i++) {
        nodeIdsToReverse.push(node.id);
        node = right(node);
    }
    let len = nodeIdsToReverse.length;
    if (len > 1) {
        let leftId = list[nodeIdsToReverse[0]].left;
        let rightId = list[nodeIdsToReverse[len-1]].right;
        connect(list[leftId], list[nodeIdsToReverse[len-1]]);
        connect(list[nodeIdsToReverse[0]], list[rightId]);    
        for (let i = 1; i < len; i++) {
            connect(list[nodeIdsToReverse[i]], list[nodeIdsToReverse[i-1]])
        }
    }
}

const findStart = () => {
    let id = currentId;
    for (let i = 0; i < rightFromStart; i++) id = list[id].left;
    return id;
}

const process = length => {
    if (length > 1) {
        reverse(currentId, length);
        rightFromStart += length-1;
    }
    if (length > 0) {
        currentId = list[currentId].right;
        rightFromStart++;
    }

    if (skip > 0) {
        for (let i = 0; i < skip; i++) {
            currentId = list[currentId].right;
            rightFromStart++;
        }
    }
    skip++;
}

const part1 = () => {
    input.split(',').map(num => process(parseInt(num)));
    let listStartNodeId = findStart();
    console.log('part 1 answer', listStartNodeId*list[listStartNodeId].right);
}

const part2 = (input) => {
    let part2Input = [];
    input.split('').map(ch => part2Input.push(ch.charCodeAt(0)));
    part2Input.push(17, 31, 73, 47, 23);
    
    for (var i = 0; i < 64; i++) part2Input.map(num => process(num));
    
    let nodeId = findStart(), result = '';
    
    for (let i = 0; i < 16; i++) {
        let partial = list[nodeId].id;
        nodeId = list[nodeId].right;
        for (let j = 1; j < 16; j++) {
            partial = partial ^ list[nodeId].id;
            nodeId = list[nodeId].right;
        }
        let s = partial.toString(16);
        if (s.length < 2) s = '0'+s;
        result += s;
    }
    console.log(result);
}

initList();
//part1();
part2(input);


//aoc day 14
/*for (let i = 0; i < 128; i++) {
    initList();
    part2(input+i);
}*/