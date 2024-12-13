const MODULE_STATE = {
    OFF: 0,
    ON: 1
}

const PULSE_TYPE = {
    LOW: 0,
    HIGH: 1
}

const MODULE_TYPE = {
    NONE: 0,
    BUTTON: 1,
    BROADCAST: 2,
    FLIP_FLOP: 3,
    CONJUNCTION: 4,
}

const init = () => {
    let modules = {};

    input.split("\n").map(line => {
        let [from, to] = line.split(' -> ');
        let type = MODULE_TYPE.NONE;
        if (from == 'broadcaster') type = MODULE_TYPE.BROADCAST;
        if (from[0] == '%') type = MODULE_TYPE.FLIP_FLOP;
        if (from[0] == '&') type = MODULE_TYPE.CONJUNCTION;
        if (from[0] == '%' || from[0] == '&') from = from.slice(1);
        modules[from] = {
            type: type,
            outputs: to.split(', '),
            inputs: [],
            state: (type == MODULE_TYPE.FLIP_FLOP ? MODULE_STATE.OFF : ({}))
        }
    })

    // add extra outputs
    Object.entries(modules).forEach(([id, mod]) => {
        mod.outputs.forEach(out => {
            if (modules[out] === undefined) modules[out] = {
                type: MODULE_TYPE.NONE,
                outputs: [],
                inputs: [],
                state: MODULE_STATE.OFF
            }
        })
    })

    // determine inputs and set default states
    Object.entries(modules).forEach(([id, mod]) => {
        mod.outputs.forEach(out => {
            if (modules[out] === undefined) modules
            if (!modules[out].inputs.includes(id)) modules[out].inputs.push(id)
        })
    })

    Object.entries(modules).forEach(([id, mod]) => {
        if (mod.type !== MODULE_TYPE.CONJUNCTION) return true;
        mod.inputs.forEach(inp => {
            mod.state[inp] = PULSE_TYPE.LOW;
        })
    })

    return modules;
}

// flip flop receives HIGH -> ignored
// flip flop receives LOW -> if it was OFF it turns on and sends HIGH; if it was ON it turns off and sends LOW

// conjunction remembers most recent pulse from each input modules (def LOW for all). on receiving, it updates the recent from that input
// if all recent inputs are HIGH, sends LOW. otherwise sends LOW

let pulses = [0, 0], satisfied = false, sends2rxId, satisfyFromId;
let stack = [];

const sendPulse = ({targetId, senderId, pulseType}) => {
    //console.log('sending', targetId, senderId, pulseType);
    if (targetId === sends2rxId && pulseType === PULSE_TYPE.HIGH && senderId === satisfyFromId) satisfied = true; // this is just for part2

    pulses[pulseType]++;

    let mod = modules[targetId];
    
    if (mod.type === MODULE_TYPE.BROADCAST) {
        mod.outputs.forEach(out => {
            stack.push({targetId: out, senderId: targetId, pulseType: pulseType});
        })
        return;
    }

    if (mod.type === MODULE_TYPE.FLIP_FLOP) {
        if (pulseType === PULSE_TYPE.LOW) {
            if (mod.state === MODULE_STATE.OFF) {
                mod.state = MODULE_STATE.ON;
                mod.outputs.forEach(out => {
                    stack.push({targetId: out, senderId: targetId, pulseType: PULSE_TYPE.HIGH});
                })
            } else {
                mod.state = MODULE_STATE.OFF;
                mod.outputs.forEach(out => {
                    stack.push({targetId: out, senderId: targetId, pulseType: PULSE_TYPE.LOW});
                })
            }
        }
        return;
    }

    if (mod.type === MODULE_TYPE.CONJUNCTION) {
        mod.state[senderId] = pulseType;
        if (Object.values(mod.state).every(pt => pt === PULSE_TYPE.HIGH)) {
            mod.outputs.forEach(out => {
                stack.push({targetId: out, senderId: targetId, pulseType: PULSE_TYPE.LOW});
            })
        } else {
            mod.outputs.forEach(out => {
                stack.push({targetId: out, senderId: targetId, pulseType: PULSE_TYPE.HIGH});
            })
        }
    }
}

const part1 = () => {
    modules = init();
    let i = 0;
    while (i < 1000) {
        stack.push({targetId: 'broadcaster', senderId: 'button', pulseType: PULSE_TYPE.LOW});
        while (stack.length) sendPulse(stack.shift())
        i++;
    }
    console.log('p1', pulses[0]*pulses[1]);
}

part1();


/*
in my case, we are looking for number of button pushes required to send high pulses to modules.rx.inputs[0] from each of its inputs, the result will be lcm of the pushes

&pq -> vr
&fg -> vr
&dk -> vr
&fm -> vr

&vr -> rx

lcm of all times btn push is required to send high to the vr, which sends to rx
*/

const part2 = () => {
    modules = init();

    //console.log(modules.rx.inputs[0], modules[modules.rx.inputs[0]].inputs);
    sends2rxId = modules.rx.inputs[0], clicks = [];

    for (let id = 0; id < modules[sends2rxId].inputs.length; id++) {
        modules = init();

        let i = 0;
        satisfied = false;
        satisfyFromId = modules[sends2rxId].inputs[id];

        while (satisfied === false) {
            stack.push({targetId: 'broadcaster', senderId: 'button', pulseType: PULSE_TYPE.LOW});
            while (stack.length) sendPulse(stack.shift())
            i++;
        }
        clicks.push(i);
    }
    console.log('p2', lcmAll(clicks));
}


const gcd = (a, b) => b == 0 ? a : gcd(b, a % b);
const lcm = (a, b) => a / gcd(a, b) * b;
const lcmAll = arr => arr.reduce(lcm, 1);

part2();
