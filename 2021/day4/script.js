const parseInput = input => {
    const parseCardData = start => lines.slice(start, start+5).map(line => line.replace(/^\s/g, "").replace(/\s\s/g, " ").split(' ').map(n => parseInt(n)))
    let lines = input.split("\n"), cards = [], hits = lines[0].split(',').map(n => parseInt(n));
    for (let i = 0; i < (lines.length-1)/6; i++) cards.push(parseCardData(2+i*6));
    return [hits, cards];
}

const turn = nr => {
    const score = card => card.flat().reduce((a, i) => a+i);
    const checkBingo = card => Array(5).fill(1).some((v, y) => !(card[y].reduce((a, i) => a+i, 0)*card.reduce((a, i) => a+i[y], 0)))

    cards = cards.filter(c => !binged.map(f => f.v).includes(c.join())).map(card => {
        card = card.map(row => row.map(v => v == nr ? 0 : v))
        if (checkBingo(card)) binged.push({v: card.join(), score: score(card)*nr});
        return card;
    })
}

let [hits, cards] = parseInput(input), binged = [];

hits.map(turn);
console.log(binged[0].score, binged.pop().score);