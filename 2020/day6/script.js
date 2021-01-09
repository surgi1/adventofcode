let count = 0;

// part 1
data.map(g => {
    let gCount = 0, gMap = {};
    g.map(s => {
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
    count += gCount;
})
console.log('part 1', count);

// part 2
count = 0;
data.map(g => {
    let gCount = 0, gMap = {};
    g.map(s => {
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
    count += gCount;
})
console.log('part 2', count);