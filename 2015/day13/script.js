let people = {}, paths = [], minFound = false, maxFound = false;

input.map(line => {
    let arr = line.split(' ');
    if (!people[arr[0]]) people[arr[0]] = {};
    people[arr[0]][arr[2]] = parseInt(arr[1]);
})

let names = Object.keys(people);

// p2: add Myself
people['Myself'] = {};
names.map(n => {
    people[n]['Myself'] = 0;
    people['Myself'][n] = 0;
})
names = Object.keys(people); // comment out for part 1 result

const progressPath = (path, missingPoints) => {
    if (missingPoints.length == 1) {
        path.push(missingPoints[0]);
        paths.push(path);
    } else {
        missingPoints.map((mp, index) => {
            let newMPs = missingPoints.slice();
            newMPs.splice(index, 1);
            let newPath = path.slice();
            newPath.push(mp);
            progressPath(newPath, newMPs);
        })
    }
}

const scorePath = path => {
    let score = 0;
    for (let i=0;i<path.length;i++) {
        let leftIndex = i-1, rightIndex = i+1;
        if (leftIndex < 0) leftIndex = path.length-1;
        if (rightIndex > path.length-1) rightIndex = 0;
        score += people[path[i]][path[leftIndex]];
        score += people[path[i]][path[rightIndex]];
    }
    return score;
}

names.map((p,i) => progressPath([p], names.filter((pp,ii) => ii!=i)))

paths.map(path => {
    let length = scorePath(path);
    if ((!minFound) || (length < minFound)) minFound = length;
    if ((!maxFound) || (length > maxFound)) maxFound = length;
})

console.log('happiness for optimal seating', maxFound);
