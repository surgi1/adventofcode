// p1
/*
let chunkSize = 25, len = data.length;
let ptr = chunkSize;

let mismatch = false;

while (mismatch == false && ptr < len) {
    //data[ptr] must be constructed from last 25 nrs
    let found = false, chunk = data.slice(ptr-chunkSize, ptr);
    chunk.some((c1, i1) => {
        return chunk.some((c2, i2) => {
            if ((i1 != i2) && ((c1+c2) == data[ptr])) {
                found = [c1,c2];
                return true;
            }
            return false;
        })
    })

    if (!found) {
        console.log('found mismatch', data[ptr], chunk); // 248131121
        mismatch = true;
    }
    ptr++;
}
*/

// p2

let weakness = 248131121, len = data.length, sequenceStart = 0;

let found = false;

while (found == false && sequenceStart < len) {
    let sum = 0, i = sequenceStart, sequence = [];
    while (sum < weakness) {
        sum = sum + data[i];
        sequence.push(data[i]);
        i++;
    }
    if (sum == weakness) {
        console.log('found match starting at', sequenceStart, ' | ', weakness, sum, sequence, 'solution', Math.max(...sequence) + Math.min(...sequence));
        found = true;
    } else {
        console.log('overshot mismatch starting at', sequenceStart, ' | ', weakness, sum, sequence);
    }
    sequenceStart++;
}