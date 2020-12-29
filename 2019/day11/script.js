let map = [], size = 150;

let paintbot = {
    pos: {x:size/2,y:size/2},
    dir: {x:0,y:-1},
    rotate: mode => {
        let a = 180*mode-90;
        let sin = Math.round(Math.sin(a*(Math.PI/180)));
        let cos = Math.round(Math.cos(a*(Math.PI/180)));
        let dir = {};
        dir.x = paintbot.dir.x*cos-paintbot.dir.y*sin;
        dir.y = paintbot.dir.x*sin+paintbot.dir.y*cos;
        paintbot.dir = dir;
    },
    move: () => {
        paintbot.pos.x += paintbot.dir.x;
        paintbot.pos.y += paintbot.dir.y;
    },
    look: () => {
        return map[paintbot.pos.y][paintbot.pos.x] || 0;
    },
    paint: (color) => {
        map[paintbot.pos.y][paintbot.pos.x] = color;
    }
}

for (let y = 0; y < size; y++) map[y] = [];

let comp = new Computer();

comp.load(input);

let stop = false;
let result;

paintbot.paint(1); // part 2

while (!stop) {
    result = comp.run([paintbot.look()]);
    if (result.code == 1) {
        stop = true;
    } else {
        paintbot.paint(result.output[0]);
        paintbot.rotate(result.output[1]);
        paintbot.move();
    }
}

let root = $('#root');
let count = 0;
const renderMap = () => {
    for (let y=0;y<size;y++) {
        for (let x=0;x<size;x++) {
            if (map[y][x] === 0 || map[y][x] === 1) count++;
            if (!map[y][x]) continue;
            let div = $('<div style="position:absolute;background-color:#333;width:3px;height:3px;left:'+x*3+'px;top:'+y*3+'px;">').text('')
            root.append(div);
        }
    }
}

renderMap();

console.log('finished', result, count);
console.log(map)