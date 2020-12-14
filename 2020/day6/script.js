var count = 0;

// part 1
/*data.forEach(g => {
    var gCount = 0, gMap = {};
    g.forEach(s => {
        for (var i=0; i< s.length; i++) {
            var char = s[i];
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
    var gCount = 0, gMap = {};
    g.forEach(s => {
        for (var i=0; i< s.length; i++) {
            var char = s[i];
            if (!gMap[char]) {
                gMap[char] = 1;
            } else {
                gMap[char]++;
            }
        }
    })
    var gSize = g.length;
    Object.entries(gMap).map(([q, cnt]) => {
        if (cnt == gSize) gCount++;
    })
    count = count + gCount;
})


console.log('total count', count);