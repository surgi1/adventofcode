const key = (x,y) => '_'+x+'_'+y;
const run = steps => {
    const step = () => {
        let newMap = {};
        for (let y = min;y <= max; y++) for (let x = min; x <= max; x++) {
            let s = '';
            for (let i = -1; i <= 1; i++) for (let j = -1; j <= 1; j++) s += (map[key(x+j, y+i)] == 1) ? '1' : '0';
            let patternIndex = parseInt(s, 2);
            if (pattern[patternIndex] == '#') newMap[key(x, y)] = 1;
        }
        min -= 1; max += 1;
        map = newMap;
    }

    let map = {}, min = -100, max = input.length+100, sum = 0;

    input.map((line, y) => line.split('').map((d, x) => map[key(x,y)] = (d == '#' ? 1 : undefined)))

    for (let i = 0; i < steps; i++) step();
    for (let y = -steps;y < input.length+steps; y++) for (let x = -steps; x < input.length+steps; x++) if (map[key(x,y)] == 1) sum++;
    console.log(sum);
}

run(2)
run(50)