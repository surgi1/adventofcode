const bingo = card => Array(5).fill(1).some((v, y) => !(card[y].reduce((a, i) => a+i, 0)*card.reduce((a, i) => a+i[y], 0)))
const parseInput = (input, cards = []) => {
    input.split("\n").filter((l, i) => l && i).map((l, i) => (cards[~~(i/5)] = cards[~~(i/5)] || []).push(l.match(/\d+/g).map(Number)))
    return [input.split("\n")[0].split(',').map(Number), cards];
}

const turn = nr => cards = cards.filter(c => !!c).map(card => {
    card = card.map(row => row.map(v => v == nr ? 0 : v))
    if (bingo(card)) binged.push(nr*card.flat().reduce((a,i) => a+i)); else return card;
})

let [hits, cards] = parseInput(input), binged = [];

hits.map(turn);
console.log(binged[0], binged.pop());