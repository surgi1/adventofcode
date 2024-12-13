const readInput = input => {
    let bots = [];
    input.map(line => {
        line = line.replace('output ', '10000'); // outputs are just addressed from 100k
        let params = line.match(/\d+/g).map(d => parseInt(d));
        if (line.indexOf('value') == 0) {
            if (!bots[params[1]]) bots[params[1]] = {values: []};
            bots[params[1]].values.push(params[0]);
        } else {
            if (!bots[params[0]]) bots[params[0]] = {values: []};
            bots[params[0]].low = params[1];
            bots[params[0]].high = params[2];
            if (!bots[params[1]]) bots[params[1]] = {values: []};
            if (!bots[params[2]]) bots[params[2]] = {values: []};
        }
    })
    return bots;
}

let bots = readInput(input);

while (bots.filter((b, bi) => b.values.length == 2 && bi < 10000).length > 0) {
    bots.map((bot, bi) => {
        if (bot.values.length == 2 && bi < 10000) {
            bot.values.sort((a, b) => a-b);
            if (bot.values[0] == 17 && bot.values[1] == 61) console.log('part 1: bot index', bi, 'compares', bot.values.join(', '));
            bots[bot.low].values.push(bot.values[0]);
            bots[bot.high].values.push(bot.values[1]);
            bot.values = [];
        }
    })
}

console.log('part 2:', bots[100000].values[0]*bots[100001].values[0]*bots[100002].values[0]);