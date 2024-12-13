let limits = {red: 12, green: 13, blue: 14}, part1 = 0, part2 = 0;

input.split("\n").forEach(l => {
    let tmp = l.split(': '),
        id = Number(tmp[0].split(' ')[1]),
        max = {red: 0, green: 0, blue: 0};

    tmp[1].split('; ').forEach(reveal => reveal.split(', ').forEach(pair => {
        let t = pair.split(' ');
        max[t[1]] = Math.max(max[t[1]], Number(t[0]));
    }))

    if (max.red <= limits.red && max.blue <= limits.blue && max.green <= limits.green) part1 += id;
    part2 += max.green*max.red*max.blue;
})

console.log(part1);
console.log(part2);