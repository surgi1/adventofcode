const salt = 'ngcjuoqr',
      stretchTimes = 2016;
let keyIndexes = [], fivelets = [], i = 0;

const getHash = (base, stretchTimes = 0) => {
    let hash = CryptoJS.MD5(base).toString();
    for (let reps = 0; reps < stretchTimes; reps++) hash = CryptoJS.MD5(hash).toString();
    return hash;
}

let lastIteration = undefined;
while (true) {
    let hash = getHash(salt+i, stretchTimes);
    let triplets = hash.match(/(.)\1\1/g);

    fivelets.filter(fivelet => ((fivelet.tripletFoundAt+1000) >= i) && (fivelet.foundAt === undefined)).map(fivelet => {
        if (hash.indexOf(fivelet.s) > -1) {
            keyIndexes.push(fivelet.tripletFoundAt);
            fivelet.foundAt = i;
        }
    })

    if (keyIndexes.length < 64) {
        if (triplets && triplets.length > 0) {
            fivelets.push({
                s: triplets[0][0].repeat(5),
                tripletFoundAt: i
            })
        }
    } else {
        if (lastIteration == undefined) {
            lastIteration = i+1000;
        }
    }

    i++;

    if (lastIteration !== undefined) {
        if (i > lastIteration) break;
    }
}

keyIndexes.sort((a,b) => a-b);
console.log(keyIndexes[63]);
