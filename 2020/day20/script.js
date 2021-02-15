const rotate = (src, out = Array.from(src)) => out.map((r,y) => r.map((p,x) => src[x][src.length-1-y]))

const processImage = img => {
    const monster = ['00000000000000000010', '10000110000110000111', '01001001001001001000'].map(l => l.split(''))
    const chars = (arr, ch = '1') => arr.join('').split('').filter(c => c == ch).length
    const isMonsterAt = (sx, sy) => monster.every((l,y) => l.every((c,x) => '0' == c || ('1' == c && ['1','2'].includes(img[sy+y][sx+x]))))
    const colorMonsterAt = (sx, sy) => monster.map((l,y) => l.map((c,x) => img[sy+y][sx+x] = c == '1' ? '2' : img[sy+y][sx+x]))
    const monsters = () => img.filter((l,y) => img[y+2]).reduce((a,l,y) => a+l.filter((c,x) => isMonsterAt(x,y) && colorMonsterAt(x,y)).length, 0)
    const drawImage = (s = '') => {
        img.map((l,y) => l.map((p,x) => s += p == 0 ? '' : `<div class="point type_${p}" style="left:${x*6}px;top:${y*6}px"> </div>`))
        document.getElementById('root').innerHTML = s;
    }

    for (let i = 0; i < 3; i++) if (!monsters()) img = rotate(img);
    if (!monsters()) img.reverse(); // flip
    while (!monsters()) img = rotate(img);
    drawImage();
    return chars(img);
}

console.log('water roughness', processImage(new TileSet(input).process()));