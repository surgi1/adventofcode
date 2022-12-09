const k = p => '_'+p.join('_');
const dirs = {
    R: [1, 0],
    L: [-1, 0],
    U: [0, -1],
    D: [0, 1],
};

const simulate = knots => {
    let rope = Array.from({length: knots}, () => [0,0]), visited = {};

    input.split("\n").map(l => {
        let cmd = l.split(' '), dx, dy;
        for (let i = 0; i < Number(cmd[1]); i++) {
            // advance head
            rope[0] = rope[0].map((v, d) => v + dirs[cmd[0]][d]);
            // advance ith point of rope based on (i-1)th point
            for (let i = 1; i < knots; i++)
                if (rope[i-1].some((v, d) => Math.abs(v-rope[i][d]) > 1))
                    rope[i] = rope[i].map((v, d) => v + Math.sign(rope[i-1][d]-v))
            // mark tail
            if (!visited[k(rope[knots-1])]) visited[k(rope[knots-1])] = 1;
        }
    })

    return Object.keys(visited).length;
}
    
console.log(simulate(2));
console.log(simulate(10));