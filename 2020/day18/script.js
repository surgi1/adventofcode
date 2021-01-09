// part 2 utilizes tree structure
let nodes = [];

const getTopLevelOperators = (s, op) => {
    let positions = [], depth = 0;
    for (let i = 0; i < s.length; i++) {
        if (s[i] == '(') depth++;
        if (s[i] == ')') depth--;
        if (depth == 0 && s[i] == op) {
            positions.push(i);
            break;
        }
    }
    return positions;
}

const addNode = (parentNode, value) => {
    let newNodeId = nodes.length;
    let node = {
        value: value,
        id: newNodeId,
        parentId: parentNode?.id,
        subnodes: []
    };
    nodes.push(node);
    if (parentNode) {
        parentNode.subnodes.push(newNodeId);
    }
    return node;
}

const cutString = (s, positions) => {
    // return array of positions.length+1 strings
    let arr = [];
    for (let i = 0; i <= positions.length; i++) {
        let start = 0;
        if (i > 0) start = positions[i-1]+1;
        let end = s.length;
        if (i < positions.length) end = positions[i];
        arr.push(s.slice(start, end));
    }
    return arr;
}

const getTopLevelBrackets = (s, startingIndex) => {
    let arr = [], depth = 0;
    if (!startingIndex) startingIndex = 0;
    for (let i = startingIndex; i < s.length; i++) {
        if (s[i] == ')') depth--;
        if (depth == 0 && (s[i] == '(' || s[i] == ')')) arr.push(i);
        if (s[i] == '(') depth++;
    }
    return arr;
}

const parse = (data, parentNode) => {
    for (let op of ['*', '+']) {
        let positions = getTopLevelOperators(data, op);
        if (positions.length > 0) {
            let cutOrs = cutString(data, positions);
            let node = addNode(parentNode, data[positions[0]]);
            parse(cutOrs[0], node);
            parse(cutOrs[1], node);
            return;
        }
    }

    if (data.indexOf('(') > -1) {
        let ands = getTopLevelBrackets(data);
        let cutAnds = cutString(data, ands);
        let node = addNode(parentNode, '');
        cutAnds.map(s => {
            if (s.length > 0) parse(s, node); // empty strings not accepted
        })
        return;
    }

    addNode(parentNode, parseInt(data)); // leaf
}

const evalNode = node => {
    if (node.subnodes.length == 0) return parseInt(node.value); // leaf
    if (node.subnodes.length == 1) return evalNode(nodes[node.subnodes[0]]); // brackets
    let val0 = evalNode(nodes[node.subnodes[0]]);
    let val1 = evalNode(nodes[node.subnodes[1]]);
    switch (node.value) {
        case '+': return val0+val1; break;
        case '*': return val0*val1; break;
    }
}

// part 1 was easier to solve like this instead of modifying tree
const compute = s => {
    let i = 0;
    let tempRes = 0;
    let lastOp = '+';
    let p;
    while (i<s.length) {
        p = parseInt(s[i]);
        if (s[i] == p) {
            if (lastOp == '+') tempRes += p; else tempRes *= p;
        }
        if (s[i] == '+' || s[i] == '*') lastOp = s[i];

        if (s[i] == '(') {
            let ands = getTopLevelBrackets(s, i);
            let cutAnds = cutString(s, [ands[0], ands[1]]);
            let bracketVal = compute(cutAnds[1]);
            if (lastOp == '+') tempRes += bracketVal; else tempRes *= bracketVal;
            i = ands[1];
        }
        i++;
    }
    return tempRes;
}

const part1 = () => {
    let sum = 0;
    input.map(s => sum += compute(s));
    console.log('part 1', sum);
}

const part2 = () => {
    let sum = 0;
    input.map(s => {
        nodes = [];
        parse(s);
        sum += evalNode(nodes[0]);
    })
    console.log('part 2', sum);
}

part1();
part2();