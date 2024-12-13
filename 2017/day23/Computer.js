class Computer {
    constructor(config = {}) {
        this.pointer = 0;
        this.ticks = 0;
        this.regs = {};
        for (let i = 0; i < 26; i++) this.regs[String.fromCharCode('a'.charCodeAt(0)+i)] = 0;
        this.regs.p = config.programId || 0;
    }

    set(regName, v) {
        this.regs[regName] = v;
        return this;
    }

    get(v) {
        if (this.regs[v] !== undefined) return this.regs[v];
        return parseInt(v);
    }

    load(input) {
        this.program = input.slice();
        return this;
    }

    run(inputs = []) {
        let self = this, output = [], stop = false, inputPointer = 0;
        let exitCode = 1; // 1: normal, 2: waiting for input
        let special = 0;
        while (!stop && self.program[self.pointer]) {
            let params = self.program[self.pointer].split(' ');
            switch (params[0]) {
                case 'snd': output.push(self.get(params[1]));self.pointer++; break;
                case 'set': self.regs[params[1]] = self.get(params[2]);self.pointer++; break;
                case 'add': self.regs[params[1]] += self.get(params[2]);self.pointer++; break;
                case 'sub': self.regs[params[1]] -= self.get(params[2]);self.pointer++; break;
                case 'mul': self.regs[params[1]] *= self.get(params[2]);special++;self.pointer++; break;
                case 'mod': self.regs[params[1]] = self.get(params[1]) % self.get(params[2]);self.pointer++; break;
                case 'rcv':
                    if (inputs[inputPointer] !== undefined) {
                        self.regs[params[1]] = inputs[inputPointer];
                        inputPointer++;
                        self.pointer++;
                    } else {
                        exitCode = 2;
                        stop = true;
                    }
                    break;
                case 'jgz': if (self.get(params[1]) > 0) self.pointer += self.get(params[2]); else self.pointer++; break;
                case 'jnz': if (self.get(params[1]) != 0) self.pointer += self.get(params[2]); else self.pointer++; break;
                default:
                    console.log('unsupported instruction', params);
                    exitCode = 3;
                    stop = true;
                    break;
            }
            self.ticks++;
            if (self.ticks % 1000000 == 0) console.log('MTicks', self.ticks/1000000, 'regs.h', self.regs.h);
        }
        return {output: output, code: exitCode, special: special};
    } 
}
