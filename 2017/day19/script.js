let path = '', val = '|', ticks = 0, v = {x: 0, y: 1},
    p = {x: input[0].indexOf(val), y: 0};

const rotate = v => {
    return {x: -v.y, y: v.x}
}

while (val != ' ') {
    p.x += v.x;
    p.y += v.y;
    ticks++;
    val = input[p.y][p.x];
    if (val.match(/[A-Z]/g)) {
        path += val;
    } else if (val == '+') {
        v = rotate(v);
        if (input[p.y+v.y][p.x+v.x] == ' ') v = rotate(rotate(v));
    }
}

console.log(path, ticks);
