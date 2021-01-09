const part1 = () => {
    let chunkSize = 25, len = data.length, ptr = chunkSize, mismatch = false;
    while (mismatch == false && ptr < len) {
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
            console.log('part 1', data[ptr]);
            mismatch = true;
        }
        ptr++;
    }
}

const part2 = () => {
    let weakness = 248131121, len = data.length, sequenceStart = 0, found = false;
    while (found == false && sequenceStart < len) {
        let sum = 0, i = sequenceStart, sequence = [];
        while (sum < weakness) {
            sum = sum + data[i];
            sequence.push(data[i]);
            i++;
        }
        if (sum == weakness) {
            console.log('part 2', Math.max(...sequence) + Math.min(...sequence));
            found = true;
        }
        sequenceStart++;
    }
}

part1();
part2();