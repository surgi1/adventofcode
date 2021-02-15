const rotate = (src, out = Array.from(src)) => out.map((r,y) => r.map((p,x) => src[x][src.length-1-y]))

const processImage = img => {
    const monster = ['00000000000000000010', '10000110000110000111', '01001001001001001000'].map(l => l.split(''))
    const isMonsterAt = (sx, sy) => monster.every((l,y) => l.every((c,x) => c == '0' || (c == '1' && ['1','2'].includes(img[sy+y][sx+x]))))
    const markMonsterAt = (sx, sy) => monster.map((l,y) => l.map((c,x) => img[sy+y][sx+x] = c == '1' ? '2' : img[sy+y][sx+x]))
    const monsters = () => img.filter((l,y) => img[y+2]).reduce((a,l,y) => a+l.filter((c,x) => isMonsterAt(x,y) && markMonsterAt(x,y)).length, 0)
    const genHtml = () => img.reduce((s,l,y) => s+l.reduce((s2,p,x) => s2 += p == 0 ? '' : `<div class="p t${p}" style="left:${x*6}px;top:${y*6}px"></div>`, ''), '')

    for (let i = 0; i < 3; i++) if (!monsters()) img = rotate(img);
    if (!monsters()) img.reverse(); // flip
    while (!monsters()) img = rotate(img);
    document.getElementById('root').innerHTML = genHtml();
    return img.reduce((a,l) => a+l.filter(e => e == '1').length, 0);
}

console.log('water roughness', processImage(new TileSet(input).process()));