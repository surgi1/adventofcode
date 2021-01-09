let input = [[28,3,35,27,19,40,14,15,17,22,45,47,26,13,32,38,43,24,29,5,31,48,49,41,25], [34,12,2,50,16,1,44,11,36,6,10,42,20,8,46,9,37,4,7,18,23,39,30,33,21]];

const calcDeckScore = deck => {
    let score = 0, len = deck.length;
    deck.map((n, i) => score += n*(len-i));
    return score;
}

const calcWinnerScore = decks => calcDeckScore(decks[0].length ? decks[0] : decks[1]);

const playMatch = (deck1, deck2) => {
    let history = {};

    while (deck1.length != 0 && deck2.length != 0) {
        let key = deck1.join('') + '_' + deck2.join('');
        if (history[key]) return [deck1, []]; else history[key] = 1;

        let draw1 = deck1.shift(), draw2 = deck2.shift();

        if (draw1 <= deck1.length && draw2 <= deck2.length) {
            let subMatchResult = playMatch(deck1.slice(0, draw1), deck2.slice(0, draw2));
            if (subMatchResult[0].length >= subMatchResult[1].length) deck1.push(draw1, draw2); else deck2.push(draw2, draw1);
        } else {
            if (draw1 > draw2) deck1.push(draw1, draw2); else deck2.push(draw2, draw1);
        }
    }
    return [deck1, deck2];
}

const playMatchPart1 = (deck1, deck2) => {
    while (deck1.length != 0 && deck2.length != 0) {
        let draw1 = deck1.shift(), draw2 = deck2.shift();
        if (draw1 > draw2) deck1.push(draw1, draw2); else deck2.push(draw2, draw1);
    }
    return [deck1, deck2];
}

console.log(calcWinnerScore(playMatchPart1(input[0].slice(), input[1].slice()))); // part 1
console.log(calcWinnerScore(playMatch(input[0].slice(), input[1].slice()))); // part 2
