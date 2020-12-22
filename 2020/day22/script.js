var input = [[28,3,35,27,19,40,14,15,17,22,45,47,26,13,32,38,43,24,29,5,31,48,49,41,25], [34,12,2,50,16,1,44,11,36,6,10,42,20,8,46,9,37,4,7,18,23,39,30,33,21]];
//var input = [[9, 2, 6, 3, 1], [5, 8, 4, 7, 10]];

function deckToKey(deck) {
    var s = '', len = deck.length;
    for (var i = 0; i < len; i++) s += deck[i];
    return s;
}

function decksToKey(decks) {
    return deckToKey(decks[0]) + '_' + deckToKey(decks[1]);
}

function calcDeckScore(deck) {
    var score = 0, len = deck.length, j = 1;
    for (var i = len-1; i >= 0; i--) {
        score += deck[i]*j;
        j++;
    }
    return score;
}

function calcWinnerScore(decks) {
    return calcDeckScore(decks[0].length > decks[1].length ? decks[0] : decks[1]);
}

function playMatch(deck1, deck2, depth) {
    if (!depth) depth = 1;
    var history = {};

    while (deck1.length != 0 && deck2.length != 0) {
        var key = decksToKey([deck1, deck2]);

        if (history[key]) {
            return [deck1, []]; // insta win player 1
        } else {
            history[key] = 1;
        }

        var draw1 = deck1.shift(), draw2 = deck2.shift();

        if (draw1 <= deck1.length && draw2 <= deck2.length) {
            var result = playMatch(deck1.slice(0,draw1), deck2.slice(0,draw2), depth+1);
            if (result[0].length >= result[1].length) deck1.push(draw1, draw2); else deck2.push(draw2, draw1);
        } else {
            if (draw1 > draw2) deck1.push(draw1, draw2); else deck2.push(draw2, draw1);
        }
    }
    return [deck1, deck2];
}

console.log(calcWinnerScore(playMatch(input[0].slice(), input[1].slice())));