// so the trick for part 2 was to realize that the coordinates are independent of each other (facepalm)
let ticks = 1000000;

let bodiesBase = [
    {pos:{x:5, y:-1, z:5}, v:{x:0, y:0, z:0}, lastVMatch: 0, lastPMatch: 0},
    {pos:{x:0, y:-14, z:2}, v:{x:0, y:0, z:0}, lastVMatch: 0, lastPMatch: 0},
    {pos:{x:16, y:4, z:0}, v:{x:0, y:0, z:0}, lastVMatch: 0, lastPMatch: 0},
    {pos:{x:18, y:1, z:16}, v:{x:0, y:0, z:0}, lastVMatch: 0, lastPMatch: 0},
]

let bodies = $.extend(true, [], bodiesBase);

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
        top: 500+bodies[id].pos.y+'px',
        left: 1200+bodies[id].pos.x+'px'
    })
}

let t = 0;

const tick = () => {
    if (t < ticks) {
        applyGravity();
        bodies.map((b, id) => moveBody(id));
        bodies.map((b, id) => drawBody(id));

        t++;
        bodies.map((b, id) => {
            if (cmpVect(bodiesBase[id].pos, bodies[id].pos)) {
                console.log('time', t, 'body', id, 'POS is match after', t-bodies[id].lastPMatch, 'cycles');
                bodies[id].lastPMatch = t;
            }
            if (cmpVect(bodiesBase[id].v, bodies[id].v)) {
                console.log('time', t, 'body', id, 'VELOCITY is match after', t-bodies[id].lastVMatch, 'cycles');
                bodies[id].lastVMatch = t;
            }

        })
    }
    if (t % 10000 == 0) console.log(t, 'time has passed');

}

//let timerHandle = setInterval(() => tick(), 20); // do this is you want some pretty visuals

while (t < ticks) {
    applyGravity();
    bodies.map((b, id) => moveBody(id));

    t++;

    ['x', 'y', 'z'].map(coord => {
        let match = true;
        bodies.some((b, id) => {
            if (b.pos[coord] != bodiesBase[id].pos[coord] || b.v[coord] != bodiesBase[id].v[coord]) {
                match = false;
                return true;
            }
        })
        if (match) console.log('coord',coord,'matched for all bodies on', t);
    })

}

let totalEnergy = 0;
bodies.map((b, id) => {
    totalEnergy += bodyEnergy(id);
})

console.log('total system energy after', ticks, 'ticks', totalEnergy);
