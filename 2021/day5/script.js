const drawVents = (diagonal = false, dots = {}) => {
    const drawPoint = (x, y) => dots['_'+x+'_'+y] = (dots['_'+x+'_'+y] || 0)+1;
    const drawLine = (x, y, x2, y2) => {
        let ix = Math.sign(x2-x), iy = Math.sign(y2-y);
        if (!diagonal && ix*iy) return;
        drawPoint(x, y);
        while (x != x2 || y != y2) drawPoint(x += ix, y += iy)
    }

    input.map(l => l.split(' -> ').map(i => i.split(',').map(Number)))
         .map(vent => drawLine(vent[0][0], vent[0][1], vent[1][0], vent[1][1]));
    return Object.values(dots).filter(v => v > 1).length
}

console.log(drawVents());
console.log(drawVents(true));