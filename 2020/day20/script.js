const rotate = (src, out = Array.from(src)) => out.map((r,y) => r.split('').map((p,x) => src[x][src.length-1-y]).join(''))

const processImage = img => {
    const monster = ['00000000000000000010', '10000110000110000111', '01001001001001001000']
    const chars = (arr, ch = '1') => arr.join('').split('').filter(c => c == ch).length
    const monsterAt = (sx, sy) => monster.every((l,y) => l.split('').every((c,x) => '0' == c || '1' == c == img[sy+y][sx+x]))
    const monsters = () => img.filter((l,y) => img[y+2]).reduce((a,l,y) => a+l.split('').filter((c,x) => monsterAt(x,y)).length, 0)

    for (let i = 0; i < 3; i++) if (!monsters()) img = rotate(img);
    if (!monsters()) img.reverse(); // flip
    while (!monsters()) img = rotate(img);
    return chars(img)-monsters()*chars(monster); // this doesn't accommodate for overlapping monsters' pixels
}

console.log('water roughness', processImage(new TileSet(input).process()));