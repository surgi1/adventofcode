let rounds = 1000; // might require tuning for generic input

const round = (input, collide = false) => {
    let alive = input.filter(particle => !particle.destroyed);
    alive.map(particle => {
        for (let coord = 0; coord < 3; coord++) {
            particle.v[coord] += particle.a[coord];
            particle.p[coord] += particle.v[coord];
        }
    })
    if (!collide) return;
    let len = alive.length;
    for (p1 = 0; p1 < len; p1++) {
        for (p2 = p1+1; p2 < len; p2++) {
            if ((alive[p1].p[0] == alive[p2].p[0]) && (alive[p1].p[1] == alive[p2].p[1]) && (alive[p1].p[2] == alive[p2].p[2])) {
                alive[p1].destroyed = true;
                alive[p2].destroyed = true;
            }
        }
    }
}

const computeDistances = input => {
    let arr = [];
    input.map((particle, id) => {
        let distance = 0;
        for (let coord = 0; coord < 3; coord++) distance += Math.abs(particle.p[coord]);
        arr.push({id: id, distance: distance});
    })
    return arr;
}

const part1 = input => {
    for (let i = 0; i < rounds; i++) round(input);
    console.log(computeDistances(input).sort((a, b) => a.distance-b.distance)[0].id);
}

const part2 = input => {
    for (let i = 0; i < rounds; i++) round(input, true);
    console.log(input.filter(particle => !particle.destroyed).length);
}

part1(input.map(e => Object({p: e.p.slice(), v: e.v.slice(), a: e.a.slice()})));
part2(input);