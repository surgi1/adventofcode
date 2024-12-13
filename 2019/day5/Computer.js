class Computer {
    constructor(config) {
        this.pointer = 0;
        this.ticks = 0;
    }

    load(input) {
        this.input = input;
        this.program = this.input.slice();
    }
    
    parse(code) {
        var ins = code % 100;
        var mode = Math.floor(code/100);
        return {code:ins, mode:'0000'+mode};
    }

    get(modes, paramNum) {
        var len = modes.length;
        var mode = modes[len-paramNum];
        if (mode == 0) return this.program[this.program[this.pointer+paramNum]];
        if (mode == 1) return this.program[this.pointer+paramNum];
    }

    set(paramNum, value) {
        this.program[this.program[this.pointer+paramNum]] = value;
    }

    run(input) {
        var self = this;
        var output;
        var stop = false;
        while (!stop) {
            var op = self.parse(self.program[self.pointer]);
            switch (op.code) {
                case 1: self.set(3, self.get(op.mode, 1) + self.get(op.mode, 2)); self.pointer += 4; break;
                case 2: self.set(3, self.get(op.mode, 1) * self.get(op.mode, 2)); self.pointer += 4; break;
                case 3: self.set(1, input); self.pointer += 2; break;
                case 4: output = self.get(op.mode, 1); self.pointer += 2; break;
                case 5: if (self.get(op.mode, 1) != 0) self.pointer = self.get(op.mode, 2); else self.pointer += 3; break;
                case 6: if (self.get(op.mode, 1) == 0) self.pointer = self.get(op.mode, 2); else self.pointer += 3; break;
                case 7: self.set(3, (self.get(op.mode, 1) < self.get(op.mode, 2) ? 1 : 0)); self.pointer += 4; break;
                case 8: self.set(3, (self.get(op.mode, 1) == self.get(op.mode, 2) ? 1 : 0)); this.pointer += 4; break;
                case 99: stop = true; break;
            }
            this.ticks++;
        }
        return output;
    }

    reset() {
        this.pointer = 0;
        this.program = this.input.slice();
        this.ticks = 0;
    }

}
