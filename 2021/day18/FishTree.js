class FishTree {
    constructor(sourceArray) {
        this.tree = [];
        this.fromArray(sourceArray);
    }

    addNode = params => this.tree.push({...params, id:this.tree.length})-1;
    rootId = () => this.tree.filter(n => n.parentId === undefined)[0].id;
    print = (nodeId = this.rootId()) => this.tree[nodeId].val !== undefined ? this.tree[nodeId].val : '['+this.print(this.tree[nodeId].left) +','+this.print(this.tree[nodeId].right)+']'
    magnitude = (nodeId = this.rootId()) => this.tree[nodeId].val !== undefined ? this.tree[nodeId].val : this.magnitude(this.tree[nodeId].left)*3 + this.magnitude(this.tree[nodeId].right)*2

    fromArray = (params, parentId = false, id = false) => {
        if (Array.isArray(params)) {
            id = (parentId === false) ? this.addNode({left:false, right:false}) : this.addNode({left:false, right:false, parentId: parentId});
            ['left', 'right'].map((dir, i) => this.tree[id][dir] = this.fromArray(params[i], id));
        } else id = this.addNode({val: params, parentId: parentId})
        return id;
    }

    addArray = arr => {
        let oldRootId = this.rootId(), newRootId = this.addNode({left: oldRootId, right: false});
        this.tree[oldRootId].parentId = newRootId;
        this.tree[newRootId].right = this.fromArray(arr, newRootId);
    }

    reduce = () => {
        const firstDeep = (nodeId, depth, res = false) => {
            if (depth == 4 && this.tree[nodeId].val === undefined) return nodeId;
            ['left', 'right'].some(dir => {
                if (this.tree[nodeId][dir] !== undefined) {
                    res = firstDeep(this.tree[nodeId][dir], depth+1);
                    if (res !== false) return true;
                }
            })
            return res;
        }

        const firstBig = (nodeId, res = false) => {
            if (this.tree[nodeId].val != undefined) return this.tree[nodeId].val > 9 ? nodeId : false;
            ['left', 'right'].some(dir => {
                if (this.tree[nodeId][dir] !== undefined) {
                    res = firstBig(this.tree[nodeId][dir]);
                    if (res !== false) return true;
                }
            })
            return res;
        }

        const explodeNode = nodeId => {
            // traverse+traverseDown finds left/right target for explosion addition
            const traverseDown = (nodeId, dir) => {
                while (this.tree[nodeId][dir]) nodeId = this.tree[nodeId][dir];
                return nodeId;
            }
            const traverse = (nodeId, dir) => {
                let parentId = this.tree[nodeId].parentId;
                while (parentId !== undefined && this.tree[parentId][dir] == nodeId) {
                    nodeId = parentId;
                    parentId = this.tree[nodeId].parentId;
                }
                if (parentId == undefined) return false;
                return traverseDown(this.tree[parentId][dir], dir == 'left' ? 'right' : 'left')
            }

            ['left', 'right'].map(dir => {
                let target = traverse(nodeId, dir);
                if (target !== false) this.tree[target].val += this.tree[this.tree[nodeId][dir]].val;
            });
            this.tree[nodeId] = {id: nodeId, parentId: this.tree[nodeId].parentId, val: 0};
        }

        const splitNode = nodeId => {
            let val = this.tree[nodeId].val/2, tmp = {...this.tree[nodeId]};
            this.tree[nodeId] = {
                id: tmp.id, parentId: tmp.parentId,
                left: this.addNode({parentId: nodeId, val: Math.floor(val)}),
                right: this.addNode({parentId: nodeId, val: Math.ceil(val)})
            };
        }

        const step = () => {
            let id = firstDeep(this.rootId(), 0);
            if (id !== false) return explodeNode(id);
            id = firstBig(this.rootId());
            if (id !== false) return splitNode(id);
            return false;
        }
        while (step() !== false) {}
    }
}