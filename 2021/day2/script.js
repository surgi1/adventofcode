const parse = a => a.map(line => [line.split(' ')[0], parseInt(line.split(' ')[1])])

const run = (ev, o = {x:0, z:0, aim: 0}) => {
    parse(input).map(([op, val]) => ev[op](o, val))
    return o.x*o.z;
}

console.log(run({ 
    up: (o, val) => o.z  -= val,
    down: (o, val) => o.z  += val,
    forward: (o, val) => o.x  += val
}));

console.log(run({ 
    up: (o, val) => o.aim  -= val,
    down: (o, val) => o.aim  += val,
    forward: (o, val) => {o.x  += val; o.z += o.aim*val}
}));
