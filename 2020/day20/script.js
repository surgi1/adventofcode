const rotateImage = data => {
    let newData = [], len = data.length;
    for (let i = 0; i < len; i++) newData[i] = [];
    for (let y = 0; y < len; y++)
        for (let x = 0; x < len; x++) newData[x][(len-1)-y] = data[y][x];
    return newData.map(line => line.join(''));
}

const processImageData = imageData => {
    const monster = ['00000000000000000010', '10000110000110000111', '01001001001001001000']
    const countChars = (arr, ch = '1') => arr.join('').split('').filter(c => c == ch).length
    const matchMonsterLine = (line, mId) => {
        let re, result = [];
        if (mId == 1) re = /1\d{4}11\d{4}11\d{4}111/g;
        if (mId == 2) re = /\d1\d\d1\d\d1\d\d1\d\d1\d\d1\d{3}/g;
        while (match = re.exec(line)) result.push(match.index);
        return result;
    }

    const countMonsters = () => {
        let monsters = 0;
        for (let i = 2; i < imageData.length; i++)
            if (matchMonsterLine(imageData[i], 2).length > 0)
                matchMonsterLine(imageData[i-1], 1).map(line1Id => imageData[i-2][line1Id+18] == '1' && monsters++)
        return monsters;
    }

    for (let i = 0; i < 3; i++) if (countMonsters() == 0) imageData = rotateImage(imageData);
    if (countMonsters() == 0) imageData.reverse(); // flip
    for (let i = 0; i < 3; i++) if (countMonsters() == 0) imageData = rotateImage(imageData);

    return countChars(imageData)-countMonsters()*countChars(monster);
}

console.log('water roughness', processImageData(new TileSet(input).process()));