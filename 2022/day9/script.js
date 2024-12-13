const dirs = {
    R: [1, 0],
    L: [-1, 0],
    U: [0, -1],
    D: [0, 1],
};

const simulate = knots => {
    let rope = Array.from({length: knots}, () => [0,0]), visited = new Set();

    input.split("\n").map(l => {
        let [dir, steps] = l.split(' ');
        while (steps--) {
            // advance head
            rope[0] = rope[0].map((v, d) => v + dirs[dir][d]);
            // advance ith point of rope based on (i-1)th point
            for (let i = 1; i < knots; i++)
                if (rope[i-1].some((v, d) => Math.abs(v-rope[i][d]) > 1))
                    rope[i] = rope[i].map((v, d) => v + Math.sign(rope[i-1][d]-v))
            // mark tail
            visited.add(rope[knots-1].join('_'));
        }
    })

    return visited.size;
}
    
console.log(simulate(2));
console.log(simulate(10));