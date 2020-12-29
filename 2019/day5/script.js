const ids = {
    ac: 1,
    trc: 5
}

let comp = new Computer();

comp.load(input);

console.log(comp.run(ids.ac)); // part1
comp.reset();
console.log(comp.run(ids.trc)); // part2
