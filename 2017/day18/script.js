const part1 = () => {
    console.log(new Computer().load(input).run().output.pop());
}

const part2 = () => {
    let comp = [], res = [], p1Outputs = 0;
    for (let i = 0; i < 2; i++) comp[i] = new Computer({programId:i}).load(input);
    while (true) {
        comp.map((c, i) => res[i] = c.run(res[i == 0 ? 1 : 0]?.output));
        p1Outputs += res[1].output.length;
        if (res[0].output.length == 0 && res[1].output.length == 0) break;
    }
    console.log(p1Outputs);
}

part1();
part2();