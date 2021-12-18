const addNode = (tree, params) => tree.push({...params, id:tree.length})-1;
const rootId = tree => tree.filter(n => n.parentId === undefined)[0].id;

const arr2tree = (tree, params, parentId = false) => {
    let id;
    if (Array.isArray(params)) {
        id = (parentId === false) ? addNode(tree, {left:false, right:false}) : addNode(tree, {left:false, right:false, parentId: parentId})
        tree[id].left = arr2tree(tree, params[0], id);
        tree[id].right = arr2tree(tree, params[1], id);
    } else {
        id = addNode(tree, {val: params, parentId: parentId})
    }
    return id;
}

const buildTree = (arr, tree = []) => {
    arr2tree(tree, arr);
    return tree;
}

const addArr2Tree = (tree, arr) => {
    let oldRootId = rootId(tree);
    let newRootId = addNode(tree, {left: oldRootId, right: false});
    tree[oldRootId].parentId = newRootId;
    tree[newRootId].right = arr2tree(tree, arr, newRootId);
    return tree;
}

const firstDeep = (tree, nodeId, depth) => {
    if (depth == 4 && tree[nodeId].val === undefined) return nodeId;
    if (tree[nodeId].left !== undefined) {
        let res = firstDeep(tree, tree[nodeId].left, depth+1);
        if (res !== false) return res;
    }
    if (tree[nodeId].right !== undefined) {
        let res = firstDeep(tree, tree[nodeId].right, depth+1);
        if (res !== false) return res;
    }

    return false;
}

const firstBig = (tree, nodeId) => {
    if (tree[nodeId].val != undefined) return tree[nodeId].val > 9 ? nodeId : false;
    if (tree[nodeId].left !== undefined) {
        let res = firstBig(tree, tree[nodeId].left);
        if (res !== false) return res;
    }
    if (tree[nodeId].right !== undefined) {
        let res = firstBig(tree, tree[nodeId].right);
        if (res !== false) return res;
    }

    return false;
}

const traverseDownRight = (tree, nodeId) => {
    while (tree[nodeId].right) nodeId = tree[nodeId].right;
    return nodeId;
}

const traverseDownLeft = (tree, nodeId) => {
    while (tree[nodeId].left) nodeId = tree[nodeId].left;
    return nodeId;
}

const traverseUpLeft = (tree, nodeId) => {
    let parentNodeId = tree[nodeId].parentId;
    while (parentNodeId !== undefined && tree[parentNodeId].left == nodeId) {
        nodeId = parentNodeId;
        parentNodeId = tree[nodeId].parentId;
    }
    if (parentNodeId == undefined) return false;
    return traverseDownRight(tree, tree[parentNodeId].left)
}

const traverseUpRight = (tree, nodeId) => {
    let parentNodeId = tree[nodeId].parentId;
    while (parentNodeId !== undefined && tree[parentNodeId].right == nodeId) {
        nodeId = parentNodeId;
        parentNodeId = tree[nodeId].parentId;
    }
    if (parentNodeId == undefined) return false;
    return traverseDownLeft(tree, tree[parentNodeId].right)
}

const explodeNode = (tree, nodeId) => {
    let leftVal = tree[tree[nodeId].left].val;
    let rightVal = tree[tree[nodeId].right].val;
    let leftTargetNode = traverseUpLeft(tree, nodeId);
    let rightTargetNode = traverseUpRight(tree, nodeId);
    if (leftTargetNode !== false) tree[leftTargetNode].val += leftVal;
    if (rightTargetNode !== false) tree[rightTargetNode].val += rightVal;
    let tmp = {...tree[nodeId]}
    tree[nodeId] = {id: tmp.id, parentId: tmp.parentId, val: 0};
    return tree;
}

const splitNode = (tree, nodeId) => {
    let leftVal = Math.floor(tree[nodeId].val/2);
    let rightVal = Math.ceil(tree[nodeId].val/2);
    let tmp = {...tree[nodeId]}
    tree[nodeId] = {
        id: tmp.id, parentId: tmp.parentId,
        left: addNode(tree, {parentId: nodeId, val: leftVal}),
        right: addNode(tree, {parentId: nodeId, val: rightVal})
    };
    return tree;
}

const printNode = (tree, nodeId) => {
    if (tree[nodeId].val !== undefined) return tree[nodeId].val;
    return '['+printNode(tree, tree[nodeId].left) +','+printNode(tree, tree[nodeId].right)+']';
}

const nodeMagnitude = (tree, nodeId) => {
    if (tree[nodeId].val !== undefined) return tree[nodeId].val;
    return nodeMagnitude(tree, tree[nodeId].left)*3 + nodeMagnitude(tree, tree[nodeId].right)*2;
}

const reduceTree = tree => {
    let res = firstDeep(tree, rootId(tree), 0);
    if (res !== false) return explodeNode(tree, res);
    res = firstBig(tree, rootId(tree));
    if (res !== false) return splitNode(tree, res);
    return false;
}

const reduceTreeFull = tree => {
    let res = reduceTree(tree);
    while (res !== false) res = reduceTree(tree);
}

const part1 = () => {
    let tree = buildTree(input[0]);
    reduceTreeFull(tree);
    for (let i = 1; i < input.length; i++) {
        addArr2Tree(tree, input[i]);
        reduceTreeFull(tree);
    }

    console.log('reduced', printNode(tree, rootId(tree)));
    console.log('magnitude', nodeMagnitude(tree, rootId(tree)));
}

const part2 = () => {
    let largestMag = 0;
    for (let j = 0; j < input.length; j++) {
        for (let i = 0; i < input.length; i++) {
            if (i == j) continue;
            let tree = buildTree(input[j]);
            reduceTreeFull(tree);
            addArr2Tree(tree, input[i]);
            reduceTreeFull(tree);
            let mg = nodeMagnitude(tree, rootId(tree));
            if (mg > largestMag) largestMag = mg;
        }

    }
    console.log('largestMag', largestMag);

}

part1(); // pretty slow
part2();