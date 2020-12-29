let count = 0;

// part 1
/*data.forEach(g => {
    let gCount = 0, gMap = {};
    g.forEach(s => {
        for (let i=0; i< s.length; i++) {
            let char = s[i];
            if (!gMap[char]) {
                gMap[char] = 1;
                gCount++;
            } else {
                gMap[char]++;
            }
        }
    })
    count = count + gCount;
})*/

// part 2
data.forEach(g => {
    let gCount = 0, gMap = {};
    g.forEach(s => {
        for (let i=0; i< s.length; i++) {
            let char = s[i];
            if (!gMap[char]) {
                gMap[char] = 1;
            } else {
                gMap[char]++;
            }
        }
    })
    let gSize = g.length;
    Object.entries(gMap).map(([q, cnt]) => {
        if (cnt == gSize) gCount++;
    })
    count = count + gCount;
})


console.log('total count', count);