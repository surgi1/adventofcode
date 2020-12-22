var input = [[28,3,35,27,19,40,14,15,17,22,45,47,26,13,32,38,43,24,29,5,31,48,49,41,25], [34,12,2,50,16,1,44,11,36,6,10,42,20,8,46,9,37,4,7,18,23,39,30,33,21]];
//var input = [[9, 2, 6, 3, 1], [5, 8, 4, 7, 10]];

/*
function deckToKey(deck) {
    var s = '';
    deck.map(n => s += n);
    return s;
}

function decksToKey(decks) {
    var k = '';
    decks.map(d => k += deckToKey(d));
    return k;
}
*/

function deckToKey(deck, maxDigits) {
    var s = '', len = deck.length;
    if (maxDigits) len = Math.min(len, maxDigits);
    for (var i = 0; i < len; i++) s += deck[i];
    return s;
}

function deckToKeyASCII(deck) {
    var s = '', len = deck.length-1;
    for (var i = 0; i < len; i++) s += String.fromCharCode(64+deck[i]);
    return s;
}

function decksToKey(decks) {
    //return deckToKey(decks[0]) + calcDeckScore(decks[1]);
    //return calcDeckScore(decks[0])*100000 + calcDeckScore(decks[1]) + parseInt( deckToKey(decks[0],3) );
    return deckToKeyASCII(decks[0]) + deckToKeyASCII(decks[1]);
}

function decksToKeyRough(decks) {
    return calcDeckScore(decks[0])*100000 + calcDeckScore(decks[1]);
}

function calcDeckScore(deck) {
    var score = 0;
    for (var i = deck.length-1; i >= 0; i--) {
        score += deck[i]*(deck.length-i);
    }
    return score;
}

function calcWinnerScore(decks) {
    console.log('calc winner score from', decks);
    return calcDeckScore(decks[0].length > decks[1].length ? decks[0] : decks[1]);
}

// match result lookup, score1, score2 => winnerid
var matchHistory = new Map();
var matchHistoryRough = [];

function playMatch(deck1, deck2, depth) {
    if (!depth) depth = 1;
    if (depth < 6) console.log(depth);
    var history = new Map();
    var historyRough = [];
    var ticks = 0;
    while (deck1.length != 0 && deck2.length != 0) {
        if (depth == 1) console.log('playing main match round', deck1, deck2);

        var keyRough = decksToKeyRough([deck1, deck2]), key = false;

        if (historyRough[keyRough]) {
            //console.log('anti-infinity rule on level', depth, deck1, deck2);
            key = decksToKey([deck1, deck2]);
            if (history[key]) {
                return [deck1, []]; // insta win player 1
            } else {
                history[key] = 1;
                historyRough[keyRough] = 1;
            }
        } else {
            historyRough[keyRough] = 1;
        }

        if (depth > 1) {
            if (matchHistoryRough[keyRough]) {
                if (!key) key = decksToKey([deck1, deck2]);
                //console.log('match result from history on level', depth);
                // result from history
                if (matchHistory[key] == 1) {
                    return [[1,2,3],[]];
                } else if (matchHistory[key] == 2) {
                    return [[],[1,2,3]];
                }
            }
        }

        var draw1 = deck1.shift(), draw2 = deck2.shift();
        if (draw1 <= deck1.length && draw2 <= deck2.length) {
            var result = playMatch(deck1.slice(), deck2.slice(), depth+1);
            if (result[0].length >= result[1].length) deck1.push(draw1, draw2); else deck2.push(draw2, draw1);
            if (depth > 1) {
                matchHistoryRough[keyRough] = (result[0].length > result[1].length ? 1 : 2);
                matchHistory[key] = (result[0].length > result[1].length ? 1 : 2);
            }
        } else {
            if (draw1 > draw2) deck1.push(draw1, draw2); else deck2.push(draw2, draw1);
        }
        ticks++;
        if (ticks % 10000 == 0) {
            console.log('handbreak on level', depth, deck1, deck2);
            return [deck1, []];
        }
    }
    return [deck1, deck2];
}

console.log(calcWinnerScore(playMatch(input[0].slice(), input[1].slice())));

//console.time('hash');for (var i = 0; i < 10000000; i++) decksToKey(input);console.timeEnd('hash')
// correct 5: 42, 34, 46, 58, 58, 45, 49, 36, 11+

// 31798 too low
// 33634 too low