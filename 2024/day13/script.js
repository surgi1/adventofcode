const init = input => input.split("\n\n").map(lit => lit.match(/\d+/g).map(Number));

/*
system of 2 linear equations for 2 unknowns; a, b = button presses for a, b
a*ax + b*bx = px
a*ay + b*by = py

b = (py - a*ay)/by
a = (px - py*bx/by)/(ax - ay*bx/by)
*/

const run = (machines, shift = 0) => machines.reduce((res, [ax, ay, bx, by, px, py]) => {
    px += shift;
    py += shift;
    if (by == 0 || ax == ay*bx/by) return res; // let's not divide by 0 pls
    let a = (px - py*bx/by)/(ax - ay*bx/by),
        b = (py - a*ay)/by;
    let ra = Math.round(a), rb = Math.round(b);
    if (ra*ax+rb*bx == px && ra*ay+rb*by == py && ra >= 0 && rb >= 0) res += a*3+b;
    return res;
}, 0)

console.log('p1', run(init(input)));
console.log('p2', run(init(input), 10000000000000));
