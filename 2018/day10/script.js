let stars = input.split("\n").map(line => {
    let tmp = line.split(/<|>|,/g).map(Number);
    return {
        p: {x: tmp[1], y: tmp[2]},
        v: {x: tmp[4], y: tmp[5]},
    }
});

const moveStars = (t = 1) => {
    stars.forEach(star => {
        star.p.x += t * star.v.x;
        star.p.y += t * star.v.y;
    })
}

const getRange = () => Math.max(...stars.map(star => star.p.x)) - Math.min(...stars.map(star => star.p.x));

// at what time will it get to approx proximmity of [0, 0]
let t = Math.abs(Math.floor(stars[0].p.x / stars[0].v.x)) - 50,
    r = Number.POSITIVE_INFINITY;

moveStars(t);

while (getRange() < r) {
    t++;
    r = getRange();
    moveStars();
}

moveStars(-1);

console.log('p2', t-1);

let shift = {x: Math.min(...stars.map(star => star.p.x)), y: Math.min(...stars.map(star => star.p.y))};
document.getElementById('root').innerHTML = stars.reduce((a, v) => a + '<div class="star" style="left:' + (v.p.x-shift.x)*3 + 'px;top:' + (v.p.y-shift.y)*3 + 'px;"></div>', ''); // p1 is readable on screen