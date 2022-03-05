const run = (steps, pairs = {}, freq = {}) => {
    Object.keys(synt).map(k => pairs[k] = 1*input.includes(k));

    while (steps--) Object.entries(pairs).map(([k, v]) => {
        let [a, c] = k.split(''), b = synt[k];
        pairs[a+c] -= v;
        pairs[a+b] += v;
        pairs[b+c] += v;
    })

    Object.entries(pairs).map(([k, v]) => freq[k[0]] = freq[k[0]]+v || v)

    freq[input[input.length-1]]++; // last letter

    let sorted = Object.values(freq).sort((a, b) => b-a);
    return sorted[0]-sorted.pop();
}

console.log(run(10));
console.log(run(40));