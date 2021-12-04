const parseInput = input => {
    const parseCardData = start => lines.slice(start, start+5).map(line => line.replace(/^\s/g, "").replace(/\s\s/g, " ").split(' ').map(n => parseInt(n)))
    let lines = input.split("\n"), cards = [], hits = lines[0].split(',').map(n => parseInt(n));
    for (let i = 0; i < (lines.length-1)/6; i++) cards.push(parseCardData(2+i*6));
    return [hits, cards];
}

const turn = nr => {
    const cardValue = cardId => cards[cardId].reduce((a, i) => a.concat(i)).reduce((a, i) => a+i);
    const checkBingo = (cardId, res = false) => {
        for (let y = 0; y < 5; y++) if ((cards[cardId][y].reduce((a, i) => a+i, 0) == 0) || (cards[cardId].reduce((a, i) => a+i[y], 0) == 0)) res = true;
        return res;
    }

    cards.map((card, cardId) => {
        if (binged.includes(cardId)) return;
        for (let x = 0;x < 5; x++) for (let y = 0; y < 5; y++) if (cards[cardId][y][x] == nr) cards[cardId][y][x] = 0;
        if (checkBingo(cardId)) {
            console.log(nr, 'BINGO', cardValue(cardId)*nr);
            binged.push(cardId);
        }
    })
}

let [hits, cards] = parseInput(input), binged = [];

hits.map(nr => turn(nr));