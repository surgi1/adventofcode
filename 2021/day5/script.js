let vents = input.map(l => l.split(' -> ').map(i => i.split(',').map(n => parseInt(n)))), dots;

const drawPoint = (x, y) => {
    let k = '_'+x+'_'+y;
    if (dots[k] == undefined) dots[k] = 0;
    dots[k]++;
}

const drawLine = (x1, y1, x2, y2, diagonal) => {
    let difX = x2-x1, difY = y2-y1;
    if (difY == 0) {
        for (let i = Math.min(x1, x2); i <= Math.max(x1, x2); i++) drawPoint(i, y1);
    } else if (difX == 0) {
        for (let i = Math.min(y1, y2); i <= Math.max(y1, y2); i++) drawPoint(x1, i);
    } else if (diagonal) {
        let x = x1, y = y1;
        while (x != x2) {
            drawPoint(x, y);
            x += Math.sign(difX);
            y += Math.sign(difY);
        }
        drawPoint(x, y);
    }
}

const drawVents = (diagonal = false) => {
    dots = {};
    vents.map(vent => drawLine(vent[0][0], vent[0][1], vent[1][0], vent[1][1], diagonal));
    return Object.values(dots).filter(v => v > 1).length
}

console.log(drawVents());
console.log(drawVents(true));