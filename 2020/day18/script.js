// part 2 utilizes tree structure
var nodes = [];

function getTopLevelOperators(s, op) {
    var positions = [], depth = 0;
    for (var i = 0; i < s.length; i++) {
        if (s[i] == '(') depth++;
        if (s[i] == ')') depth--;
        if (depth == 0 && s[i] == op) {
            positions.push(i);
            break;
        }
    }
    return positions;
}

function addNode(parentNode, value) {
    var newNodeId = nodes.length;
    var node = {
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

function cutString(s, positions) {
    // return array of positions.length+1 strings
    var arr = [];
    for (var i = 0; i <= positions.length; i++) {
        var start = 0;
        if (i > 0) start = positions[i-1]+1;
        var end = s.length;
        if (i < positions.length) end = positions[i];
        arr.push(s.slice(start, end));
    }
    return arr;
}

function getTopLevelBrackets(s, startingIndex) {
    var arr = [], depth = 0;
    if (!startingIndex) startingIndex = 0;
    for (var i = startingIndex; i < s.length; i++) {
        if (s[i] == ')') depth--;
        if (depth == 0 && (s[i] == '(' || s[i] == ')')) arr.push(i);
        if (s[i] == '(') depth++;
    }
    return arr;
}

function parse(data, parentNode) {
    for (var op of ['*', '+']) {
        var positions = getTopLevelOperators(data, op);
        if (positions.length > 0) {
            var cutOrs = cutString(data, positions);
            var node = addNode(parentNode, data[positions[0]]);
            parse(cutOrs[0], node);
            parse(cutOrs[1], node);
            return;
        }
    }

    if (data.indexOf('(') > -1) {
        var ands = getTopLevelBrackets(data);
        var cutAnds = cutString(data, ands);
        var node = addNode(parentNode, '');
        cutAnds.map(s => {
            if (s.length > 0) parse(s, node); // empoty strings not accepted
        })
        return;
    }

    addNode(parentNode, parseInt(data)); // leaf

}

function evalNode(node) {
    if (node.subnodes.length == 0) return parseInt(node.value); // leaf
    if (node.subnodes.length == 1) return evalNode(nodes[node.subnodes[0]]); // brackets
    var val0 = evalNode(nodes[node.subnodes[0]]);
    var val1 = evalNode(nodes[node.subnodes[1]]);
    switch (node.value) {
        case '+': return val0+val1; break;
        case '*': return val0*val1; break;
    }
}

// part 1 was easier to solve like this instead of modifying tree
function compute(s) {
    var i = 0;
    var tempRes = 0;
    var lastOp = '+';
    var p;
    while (i<s.length) {
        p = parseInt(s[i]);
        if (s[i] == p) {
            if (lastOp == '+') tempRes += p; else tempRes *= p;
        }
        if (s[i] == '+' || s[i] == '*') lastOp = s[i];

        if (s[i] == '(') {
            var ands = getTopLevelBrackets(s, i);
            var cutAnds = cutString(s, [ands[0], ands[1]]);
            var bracketVal = compute(cutAnds[1]);
            if (lastOp == '+') tempRes += bracketVal; else tempRes *= bracketVal;
            i = ands[1];
        }

        i++;
    }
    return tempRes;
}

var sum = 0;
input.map(s => {
    console.log('computing', s);
    
    // p1
    //var v = compute(s);
    
    // p2
    nodes = [];
    parse(s);
    var v = evalNode(nodes[0]);

    sum += v;
})

console.log('sum', sum);
