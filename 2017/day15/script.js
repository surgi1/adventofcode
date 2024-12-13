let mul = [16807, 48271], mod = [4, 8], last, matches;

const genValue = gen => last[gen]*mul[gen] % 2147483647;

const next = useMod => {
    for (let gen = 0; gen < 2; gen++) {
        last[gen] = genValue(gen);
        if (useMod) while ((last[gen] % mod[gen]) > 0) last[gen] = genValue(gen);
    }
    if ((last[0] & 65535) == (last[1] & 65535)) matches++;
}

const run = (iterations, useMod) => {
    last = [277, 349];
    matches = 0;
    for (let i = 0; i < iterations; i++) next(useMod);
    console.log(matches);
}

run(40000000, false); // p1
run(5000000, true); // p2