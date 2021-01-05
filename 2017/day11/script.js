let p = {x: 0, y: 0}, maxDist = 0;

const dist = p => Math.abs(p.x) + Math.abs(p.y);

input.split(',').map(dir => {
    switch (dir) {
        case 's': p.y += 1; break;
        case 'n': p.y -= 1; break;
        case 'nw': p.y -= 0.5;p.x -= 0.5; break;
        case 'ne': p.y -= 0.5;p.x += 0.5; break;
        case 'sw': p.y += 0.5;p.x -= 0.5; break;
        case 'se': p.y += 0.5;p.x += 0.5; break;
    }
    maxDist = Math.max(maxDist, dist(p));
})

console.log('part 1', dist(p));
console.log('part 2', maxDist);