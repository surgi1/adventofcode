const run = steps => {
    let pairs = {}, freq = {};

    for (let i = 1; i < input.length; i++) pairs[input[i-1]+input[i]] = 1;

    Object.keys(synt).map(k => pairs[k] = pairs[k] || 0);

    for (let i = 0; i < steps; i++) Object.entries(pairs).map(([k, v]) => {
        let [a, c] = k.split(''), b = synt[k];
        pairs[a+c] -= v;
        pairs[a+b] += v;
        pairs[b+c] += v;
    })

    Object.entries(pairs).map(([k, v]) => freq[k[0]] = freq[k[0]]+v || v)

    freq[input[input.length-1]]++; // last letter

    let sorted = Object.values(freq).sort((a, b) => b-a);
    return sorted[0]-sorted[sorted.length-1];
}

console.log(run(10));
console.log(run(40));