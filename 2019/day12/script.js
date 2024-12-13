// Pretty visuals available!
// The trick for part 2 was to realize that the coordinates are independent of each other (facepalm)
let ticks = 500000;

let bodiesBase = [
    {pos:{x:5, y:-1, z:5}, v:{x:0, y:0, z:0}},
    {pos:{x:0, y:-14, z:2}, v:{x:0, y:0, z:0}},
    {pos:{x:16, y:4, z:0}, v:{x:0, y:0, z:0}},
    {pos:{x:18, y:1, z:16}, v:{x:0, y:0, z:0}},
]

let bodies = $.extend(true, [], bodiesBase);

const gcd = (a, b) => a ? gcd(b % a, a) : b;
const lcm = (a, b) => a * b / gcd(a, b);
const lcmArr = arr => arr.reduce(lcm);

const applyGravityPair = (id1, id2) => {
    ['x', 'y', 'z'].map(coord => {
        let diff = bodies[id2].pos[coord]-bodies[id1].pos[coord];
        if (diff != 0) {
            bodies[id1].v[coord] += Math.sign(diff);
            bodies[id2].v[coord] -= Math.sign(diff);
        }
    })
}

const moveBody = (id) => {
    ['x', 'y', 'z'].map(coord => {
        bodies[id].pos[coord] += bodies[id].v[coord];
    })
}

const applyGravity = () => {
    applyGravityPair(0,1);
    applyGravityPair(0,2);
    applyGravityPair(1,2);
    applyGravityPair(0,3);
    applyGravityPair(1,3);
    applyGravityPair(2,3);
}

const bodyEnergy = (id) => {
    let potential = 0, kinetic = 0;
    ['x', 'y', 'z'].map(coord => {
        potential += Math.abs(bodies[id].pos[coord]);
        kinetic += Math.abs(bodies[id].v[coord]);
    })
    return potential*kinetic;
}

const cmpVect = (v1, v2) => {
    let match = true;
    ['x', 'y', 'z'].some(coord => {
        if (v1[coord] != v2[coord]) {
            match = false;
            return true;
        }
    })
    return match;
}

let root = $('#root');

const drawBody = (id) => {
    if (!bodies[id].div) {
        let div = $('<div id="body'+id+'" class="planet" />').html('');
        bodies[id].div = div;
        root.append(div);
    }
    $('#body'+id).css({
        top: 500+bodies[id].pos.y/2+'px',
        left: 1200+bodies[id].pos.x/2+'px'
    })
}

const tick = () => {
    applyGravity();
    bodies.map((b, id) => moveBody(id));
    bodies.map((b, id) => drawBody(id));
}

const part2 = () => {
    let t = 0, matches = [];
    while (t < ticks) {
        applyGravity();
        bodies.map((b, id) => moveBody(id));

        t++;

        ['x', 'y', 'z'].map((coord, coordId) => {
            let match = true;
            bodies.some((b, id) => {
                if (b.pos[coord] != bodiesBase[id].pos[coord] || b.v[coord] != bodiesBase[id].v[coord]) {
                    match = false;
                    return true;
                }
            })
            if (match) {
                console.log('coord',coord,'matched for all bodies on', t);
                if (!matches[coordId]) matches[coordId] = t;
            }
        })
        if (matches.filter(m => m != undefined).length == 3) break;
    }

    let totalEnergy = 0;
    bodies.map((b, id) => {
        totalEnergy += bodyEnergy(id);
    })

    console.log('total system energy after', ticks, 'ticks', totalEnergy);
    console.log('solution for part 2 is Least Common Multiple of lowest coords x, y and z matches:', matches.join(', '), ':', lcmArr(matches));
}

part2();

let timerHandle = setInterval(() => tick(), 20);
