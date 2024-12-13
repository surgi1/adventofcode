let size = 150, root = document.getElementById('root'), map = [], comp = new Computer().load(input);
let paintbot = {
    pos: {}, dir: {},
    rotate: mode => {
        let a = 180*mode-90;
        let sin = Math.round(Math.sin(a*(Math.PI/180))), cos = Math.round(Math.cos(a*(Math.PI/180)));
        paintbot.dir = {x: paintbot.dir.x*cos-paintbot.dir.y*sin, y: paintbot.dir.x*sin+paintbot.dir.y*cos}
    },
    move: () => {
        paintbot.pos.x += paintbot.dir.x;
        paintbot.pos.y += paintbot.dir.y;
    },
    look: () => map[paintbot.pos.y][paintbot.pos.x] || 0,
    paint: color => map[paintbot.pos.y][paintbot.pos.x] = color
}

const renderMap = (map, skipDraw = false, count = 0) => {
    map.map((row, y) => row.map((ch, x) => {
        if (ch != undefined) count++;
        if (ch == 1 && skipDraw !== true) root.innerHTML += '<div class="point" style="left:'+x*3+'px;top:'+y*3+'px;"> </div>';
    }))
    return count;
}

const run = startingColor => {
    for (let y = 0; y < size; y++) map[y] = [];
    comp.reset();
    paintbot.pos = {x:size/2,y:size/2};
    paintbot.dir = {x:0,y:-1};
    paintbot.paint(startingColor);
    while (true) {
        let result = comp.run([paintbot.look()]);
        if (result.code == 1) break;
        paintbot.paint(result.output[0]);
        paintbot.rotate(result.output[1]);
        paintbot.move();
    }
    return map;
}

console.log('part 1', renderMap(run(0), true));
renderMap(run(1));