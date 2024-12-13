class Computer {
    constructor(config) {
        this.pointer = 0;
        this.relativeBase = 0;
        this.ticks = 0;
        return this;
    }

    load(input) {
        this.input = input;
        this.program = this.input.slice();
        return this;
    }
    
    parse(code) {
        var ins = code % 100;
        var mode = Math.floor(code/100);
        return {code:ins, mode:'0000'+mode};
    }

    get(modes, paramNum) {
        var len = modes.length;
        var mode = modes[len-paramNum];
        if (mode == 0) return this.program[this.program[this.pointer+paramNum]] || 0;
        if (mode == 1) return this.program[this.pointer+paramNum] || 0;
        if (mode == 2) return this.program[this.relativeBase+this.program[this.pointer+paramNum]] || 0;
    }

    // set needs to take into account relative mode as well
    set(modes, paramNum, value) {
        var len = modes.length;
        var mode = modes[len-paramNum];
        if (mode == 0) this.program[this.program[this.pointer+paramNum]] = value;
        if (mode == 2) this.program[this.relativeBase+this.program[this.pointer+paramNum]] = value;
    }

    run(inputs) {
        var self = this;
        if (!inputs) inputs = [];
        var output = [];
        var stop = false;
        var inputPointer = 0;
        var exitCode; // 1: normal, 2: waiting for input
        while (!stop) {
            var op = self.parse(self.program[self.pointer]);
            switch (op.code) {
                case 1: self.set(op.mode, 3, self.get(op.mode, 1) + self.get(op.mode, 2)); self.pointer += 4; break;
                case 2: self.set(op.mode, 3, self.get(op.mode, 1) * self.get(op.mode, 2)); self.pointer += 4; break;
                case 3: 
                    if (inputPointer < inputs.length) {
                        self.set(op.mode, 1, inputs[inputPointer]);
                        inputPointer++;
                        self.pointer += 2;
                    } else {
                        //console.log('exit, waiting for more input', inputs);
                        stop = true;
                        exitCode = 2;
                    }
                    break;
                case 4: output.push(self.get(op.mode, 1)); self.pointer += 2; break;
                case 5: if (self.get(op.mode, 1) != 0) self.pointer = self.get(op.mode, 2); else self.pointer += 3; break;
                case 6: if (self.get(op.mode, 1) == 0) self.pointer = self.get(op.mode, 2); else self.pointer += 3; break;
                case 7: self.set(op.mode, 3, (self.get(op.mode, 1) < self.get(op.mode, 2) ? 1 : 0)); self.pointer += 4; break;
                case 8: self.set(op.mode, 3, (self.get(op.mode, 1) == self.get(op.mode, 2) ? 1 : 0)); this.pointer += 4; break;
                case 9: self.relativeBase += self.get(op.mode, 1); this.pointer += 2; break;
                case 99: stop = true; exitCode = 1; break;
            }
            this.ticks++;
        }
        return {output: output, code: exitCode};
    }

    reset() {
        this.pointer = 0;
        this.relativeBase = 0;
        this.program = this.input.slice();
        this.ticks = 0;
    }

}
