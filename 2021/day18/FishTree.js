class FishTree {
    constructor(sourceArray) {
        this.tree = [];
        this.rootId = 0;
        this.fromArray(sourceArray);
    }

    addNode = params => this.tree.push({...params, id:this.tree.length})-1;
    print = (n = this.rootId) => this.tree[n].val !== undefined ? this.tree[n].val : '['+this.print(this.tree[n].left) +','+this.print(this.tree[n].right)+']'
    magnitude = (n = this.rootId) => this.tree[n].val !== undefined ? this.tree[n].val : this.magnitude(this.tree[n].left)*3 + this.magnitude(this.tree[n].right)*2

    fromArray = (params, parentId = false, id = false) => {
        if (Array.isArray(params)) {
            id = (parentId === false) ? this.addNode({left:false, right:false}) : this.addNode({left:false, right:false, parentId: parentId});
            ['left', 'right'].map((dir, i) => this.tree[id][dir] = this.fromArray(params[i], id));
        } else id = this.addNode({val: params, parentId: parentId})
        return id;
    }

    addArray = arr => {
        let newRootId = this.addNode({left: this.rootId, right: false});
        this.tree[this.rootId].parentId = newRootId;
        this.tree[newRootId].right = this.fromArray(arr, newRootId);
        this.rootId = newRootId;
    }

    reduce = () => {
        const firstDeep = (n, depth, res = false) => {
            if (depth == 4 && this.tree[n].val === undefined) return n;
            ['left', 'right'].some(dir => {
                if (this.tree[n][dir] !== undefined) {
                    res = firstDeep(this.tree[n][dir], depth+1);
                    if (res !== false) return true;
                }
            })
            return res;
        }

        const firstBig = (n, res = false) => {
            if (this.tree[n].val != undefined) return this.tree[n].val > 9 ? n : false;
            ['left', 'right'].some(dir => {
                if (this.tree[n][dir] !== undefined) {
                    res = firstBig(this.tree[n][dir]);
                    if (res !== false) return true;
                }
            })
            return res;
        }

        const explodeNode = n => {
            // traverse+traverseDown finds left/right target for explosion addition
            const traverseDown = (n, dir) => {
                while (this.tree[n][dir]) n = this.tree[n][dir];
                return n;
            }
            const traverse = (n, dir) => {
                let parentId = this.tree[n].parentId;
                while (parentId !== undefined && this.tree[parentId][dir] == n) {
                    n = parentId;
                    parentId = this.tree[n].parentId;
                }
                if (parentId == undefined) return false;
                return traverseDown(this.tree[parentId][dir], dir == 'left' ? 'right' : 'left')
            }

            ['left', 'right'].map(dir => {
                let target = traverse(n, dir);
                if (target !== false) this.tree[target].val += this.tree[this.tree[n][dir]].val;
            });
            this.tree[n] = {id: n, parentId: this.tree[n].parentId, val: 0};
        }

        const splitNode = n => {
            let val = this.tree[n].val/2, tmp = {...this.tree[n]};
            this.tree[n] = {
                id: tmp.id, parentId: tmp.parentId,
                left: this.addNode({parentId: n, val: Math.floor(val)}),
                right: this.addNode({parentId: n, val: Math.ceil(val)})
            };
        }

        const step = () => {
            let id = firstDeep(this.rootId, 0);
            if (id !== false) return explodeNode(id);
            id = firstBig(this.rootId);
            if (id !== false) return splitNode(id);
            return false;
        }
        while (step() !== false) {}
    }
}