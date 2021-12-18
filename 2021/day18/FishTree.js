class FishTree {
    constructor(sourceArray) {
        this.tree = [];
        this.fromArray(sourceArray);
    }

    addNode = params => this.tree.push({...params, id:this.tree.length})-1;
    rootId = () => this.tree.filter(n => n.parentId === undefined)[0].id;
    reduce = () => { while (this.reduceStep() !== false) {} }

    fromArray = (params, parentId = false, id = false) => {
        if (Array.isArray(params)) {
            id = (parentId === false) ? this.addNode({left:false, right:false}) : this.addNode({left:false, right:false, parentId: parentId})
            this.tree[id].left = this.fromArray(params[0], id);
            this.tree[id].right = this.fromArray(params[1], id);
        } else id = this.addNode({val: params, parentId: parentId})
        return id;
    }

    addArray = arr => {
        let oldRootId = this.rootId(), newRootId = this.addNode({left: oldRootId, right: false});
        this.tree[oldRootId].parentId = newRootId;
        this.tree[newRootId].right = this.fromArray(arr, newRootId);
    }

    firstDeep = (nodeId, depth) => {
        if (depth == 4 && this.tree[nodeId].val === undefined) return nodeId;
        if (this.tree[nodeId].left !== undefined) {
            let res = this.firstDeep(this.tree[nodeId].left, depth+1);
            if (res !== false) return res;
        }
        if (this.tree[nodeId].right !== undefined) {
            let res = this.firstDeep(this.tree[nodeId].right, depth+1);
            if (res !== false) return res;
        }
        return false;
    }

    firstBig = nodeId => {
        if (this.tree[nodeId].val != undefined) return this.tree[nodeId].val > 9 ? nodeId : false;
        if (this.tree[nodeId].left !== undefined) {
            let res = this.firstBig(this.tree[nodeId].left);
            if (res !== false) return res;
        }
        if (this.tree[nodeId].right !== undefined) {
            let res = this.firstBig(this.tree[nodeId].right);
            if (res !== false) return res;
        }
        return false;
    }

    traverseUp = (nodeId, dir) => {
        let parentNodeId = this.tree[nodeId].parentId;
        while (parentNodeId !== undefined && this.tree[parentNodeId][dir] == nodeId) {
            nodeId = parentNodeId;
            parentNodeId = this.tree[nodeId].parentId;
        }
        if (parentNodeId == undefined) return false;
        return this.traverseDown(this.tree[parentNodeId][dir], dir == 'left' ? 'right' : 'left')
    }

    traverseDown = (nodeId, dir) => {
        while (this.tree[nodeId][dir]) nodeId = this.tree[nodeId][dir];
        return nodeId;
    }

    explodeNode = nodeId => {
        let leftVal = this.tree[this.tree[nodeId].left].val,
            rightVal = this.tree[this.tree[nodeId].right].val,
            leftTargetNode = this.traverseUp(nodeId, 'left'),
            rightTargetNode = this.traverseUp(nodeId, 'right');

        if (leftTargetNode !== false) this.tree[leftTargetNode].val += leftVal;
        if (rightTargetNode !== false) this.tree[rightTargetNode].val += rightVal;
        this.tree[nodeId] = {id: nodeId, parentId: this.tree[nodeId].parentId, val: 0};
    }

    splitNode = nodeId => {
        let val = this.tree[nodeId].val/2, tmp = {...this.tree[nodeId]};
        this.tree[nodeId] = {
            id: tmp.id, parentId: tmp.parentId,
            left: this.addNode({parentId: nodeId, val: Math.floor(val)}),
            right: this.addNode({parentId: nodeId, val: Math.ceil(val)})
        };
    }

    print = nodeId => {
        if (nodeId == undefined) nodeId = this.rootId();
        if (this.tree[nodeId].val !== undefined) return this.tree[nodeId].val;
        return '['+this.print(this.tree[nodeId].left) +','+this.print(this.tree[nodeId].right)+']';
    }

    getMagnitude = nodeId => {
        if (nodeId == undefined) nodeId = this.rootId();
        if (this.tree[nodeId].val !== undefined) return this.tree[nodeId].val;
        return this.getMagnitude(this.tree[nodeId].left)*3 + this.getMagnitude(this.tree[nodeId].right)*2;
    }

    reduceStep = () => {
        let id = this.firstDeep(this.rootId(), 0);
        if (id !== false) return this.explodeNode(id);
        id = this.firstBig(this.rootId());
        if (id !== false) return this.splitNode(id);
        return false;
    }
}