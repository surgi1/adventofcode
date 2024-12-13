class FishTree {
    constructor(sourceArray = false) {
        this.tree = [];
        this.rootId = 0;
        sourceArray && this.fromArray(sourceArray);
    }

    addNode = params => this.tree.push({...params, id:this.tree.length})-1;
    print = (n = this.rootId) => this.tree[n].val !== undefined ? this.tree[n].val : '['+this.print(this.tree[n].left) +','+this.print(this.tree[n].right)+']'
    magnitude = (n = this.rootId) => this.tree[n].val !== undefined ? this.tree[n].val : this.magnitude(this.tree[n].left)*3 + this.magnitude(this.tree[n].right)*2
    arm = arr => this.addArray(arr).reduce().magnitude()

    fromArray = (params, parentId = false, id = false) => {
        if (Array.isArray(params)) {
            id = this.addNode({left:0, right:0, parentId: parentId === false ? undefined : parentId});
            ['left', 'right'].map((dir, i) => this.tree[id][dir] = this.fromArray(params[i], id));
        } else id = this.addNode({val: params, parentId: parentId})
        return id;
    }

    addArray = arr => {
        if (this.tree.length != 0) {
            let newRootId = this.addNode({left: this.rootId, right: false});
            this.tree[this.rootId].parentId = newRootId;
            this.tree[newRootId].right = this.fromArray(arr, newRootId);
            this.rootId = newRootId;
        } else this.fromArray(arr);
        return this;
    }

    reduce = () => {
        const reducible = (n, depth, condition, res = false) => {
            if (condition == 'DEPTH') {
                if (depth == 4 && this.tree[n].val === undefined) return n;
            } else {
                if (this.tree[n].val != undefined) return this.tree[n].val > 9 ? n : false;
            }
            ['left', 'right'].filter(dir => this.tree[n][dir] !== undefined).some(dir => {
                res = reducible(this.tree[n][dir], depth+1, condition);
                if (res !== false) return true;
            })
            return res;
        }

        const explodeNode = n => {
            // finds left/right target for explosion addition
            const traverse = (n, dir, opDir = dir == 'left' ? 'right' : 'left') => {
                let parentId = this.tree[n].parentId; // find closest parent that leads to our target
                while (parentId !== undefined && this.tree[parentId][dir] == n) {
                    n = parentId;
                    parentId = this.tree[n].parentId;
                }
                if (parentId == undefined) return false; // no valid target
                n = this.tree[parentId][dir]; // get the node closest to the original in given direction
                while (this.tree[n][opDir]) n = this.tree[n][opDir];
                return n;
            }

            ['left', 'right'].filter(dir => traverse(n, dir) !== false)
                             .map(dir => this.tree[traverse(n, dir)].val += this.tree[this.tree[n][dir]].val);
            this.tree[n] = {id: n, parentId: this.tree[n].parentId, val: 0};
        }

        const splitNode = n => {
            let val = this.tree[n].val/2;
            this.tree[n] = {
                id: this.tree[n].id, parentId: this.tree[n].parentId,
                left: this.addNode({parentId: n, val: Math.floor(val)}),
                right: this.addNode({parentId: n, val: Math.ceil(val)})
            };
        }

        const step = () => {
            let id = reducible(this.rootId, 0, 'DEPTH');
            if (id !== false) return explodeNode(id);
            id = reducible(this.rootId, 0, 'SIZE');
            if (id !== false) return splitNode(id);
            return false;
        }

        while (step() !== false) {}
        return this;
    }
}