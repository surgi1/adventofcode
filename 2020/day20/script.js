const rotateImage = data => {
    let newData = [], len = data.length;
    for (let i = 0; i < len; i++) newData[i] = [];
    for (let y = 0; y < len; y++)
        for (let x = 0; x < len; x++) newData[x][(len-1)-y] = data[y][x];
    return newData.map(line => line.join(''));
}

const processImageData = img => {
    const monster = ['00000000000000000010', '10000110000110000111', '01001001001001001000']
    const countChars = (arr, ch = '1') => arr.join('').split('').filter(c => c == ch).length
    const monsterAt = (sx, sy) => monster.every((l, y) => l.split('').every((c, x) => c == '0' || (c == '1' && img[sy+y][sx+x] == '1')))
    const countMonsters = () => img.filter((l, y) => y < img.length-2).reduce((a, l, y) => a+l.split('').filter((c, x) => monsterAt(x,y)).length, 0)

    for (let i = 0; i < 3; i++) if (countMonsters() == 0) img = rotateImage(img);
    if (countMonsters() == 0) img.reverse(); // flip
    for (let i = 0; i < 3; i++) if (countMonsters() == 0) img = rotateImage(img);

    return countChars(img)-countMonsters()*countChars(monster);
}

console.log('water roughness', processImageData(new TileSet(input).process()));