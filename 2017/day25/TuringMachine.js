class TuringMachine {
    constructor(config) {
        this.states = config.states;
        this.state = config.start;
        this.checksumAfter = config.checksumAfter;
        this.tape = [];
        this.cursor = this.addNode();
        this.steps = 0;
    }

    addNode(params = {}) {
        let id = this.tape.length;
        this.tape.push({
            id: id,
            value: params.value || 0,
            left: params.left,
            right: params.right
        })
        return id;
    }

    set(value) {
        this.tape[this.cursor].value = value;
    }

    get() {
        return this.tape[this.cursor].value;
    }

    connect(leftId, rightId) {
        this.tape[leftId].right = rightId;
        this.tape[rightId].left = leftId;
    }

    move(direction) {
        if (this.tape[this.cursor][direction]) {
            this.cursor = this.tape[this.cursor][direction];
            return;
        }
        let id = this.addNode();
        if (direction == 'left') this.connect(id, this.cursor); else this.connect(this.cursor, id);
        this.cursor = id;
    }

    checksum() {
        let sum = 0;
        this.tape.map(node => sum += node.value);
        return sum;
    }

    step() {
        let state = this.states[this.state], val = this.get();
        this.set(state[val].write);
        this.move(state[val].move);
        this.state = state[val].next;
        this.steps++;
    }

    run() {
        if (!this.checksumAfter) return 'Not checksum requested, would run forever, halting..';
        while (this.steps < this.checksumAfter) this.step();
        return this.checksum();
    }
}
