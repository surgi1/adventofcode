let input = [2,20,0,4,1,17];

const run = stopNr => {
    let data = input.slice(), len = data.length, history = Array(stopNr); // initializing the array with fixed size rather than history=[] cuts down the execution time dramatically, from minutes to seconds for part 2

    data.map((d,i) => history[d] = [i]);

    let last = data.pop();
    for (let i = len; i < stopNr; i++) {
        let num = 0;
        if (history[last].length > 1) num = history[last][1]-history[last].shift();
        if (!history[num]) history[num] = [];
        history[num].push(i);
        last = num;
    }

    return last;
}

console.log('part 1', run(2020));
console.log('part 2', run(30000000));