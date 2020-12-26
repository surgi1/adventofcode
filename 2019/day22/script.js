// part 2 felt math heavier than any other AOC puzzle, likely just me being a dummy in modular algebra
// resulting equation has to be solved with wolframalpha.com for now

function readInput(input) {
    var moves = [];
    for (var i = 0; i < input.length; i++) {
        var line = input[i];
        if (line == 'deal into new stack') {
            moves.push({action: 1});
        } else if (line.indexOf('deal with increment') > -1) {
            moves.push({action: 2, num: BigInt(line.match(/-?\d+/g)[0])});
        } else if (line.indexOf('cut') > -1) {
            moves.push({action: 3, num: BigInt(line.match(/-?\d+/g)[0])});
        }
    }
    return moves;
}

function initDeck(cards) {
    var deck = [];
    for (var i = 0; i < cards; i++) deck.push(i);
    return deck;
}

function dealIntoNewStack(deck) {
    var newDeck = [];
    for (var i = deck.length-1; i >= 0; i--) newDeck.push(deck[i]);
    return newDeck;
}

function cut(deck, n) {
    var newDeck = [];
    if (n > 0) {
        var cutCards = deck.splice(0, n);
        newDeck = deck.concat(cutCards);
    } else {
        n = Math.abs(n);
        var cutCards = deck.splice(deck.length-n, n);
        newDeck = cutCards.concat(deck);
    }
    return newDeck;
}

function dealWithIncrement(deck, increment) {
    var newDeck = [], len = deck.length;
    var newDeckIndex = 0, oldDeckIndex = 0;
    while (oldDeckIndex < len) {
        newDeck[newDeckIndex % len] = deck[oldDeckIndex];
        newDeckIndex += increment;
        oldDeckIndex++;
    }
    return newDeck;
}

function shuffle(deck, moves) {
    moves.map(line => {
        if (line == 'deal into new stack') {
            deck = dealIntoNewStack(deck);
        } else if (line.indexOf('deal with increment') > -1) {
            deck = dealWithIncrement(deck, parseInt(line.match(/-?\d+/g)[0]));
        } else if (line.indexOf('cut') > -1) {
            deck = cut(deck, parseInt(line.match(/-?\d+/g)[0]));
        }
    })
    return deck;
}

function part1(size, i) {
    var moves = readInput(input);
    var deck = initDeck(size);
    deck = shuffle(deck, moves);
    console.log('deck 1', deck/*, 'pos of card 2019', deck.indexOf(2019)*/);
}

var deckSize;

function tracePosDealIntoNewStack(pos) {
    return deckSize-pos-1n;
}

function tracePosCut(pos, cut) {
    if (cut > 0) {
        pos = (pos+cut) % deckSize;
    } else {
        pos = (pos + deckSize + cut) % deckSize;
    }
    return pos;
}

function tracePosDealWithIncrement(pos, increment) {
    if (pos % increment == 0) return pos/increment;

    for (var povlne = 1n; povlne < increment; povlne++) {
        if (increment - (povlne*deckSize % increment) == pos % increment) {
            return 1n+pos/increment+(povlne*deckSize)/increment;
        }
    }
}

function shufflePart2(pos, moves) {
    for (var i = moves.length-1; i >= 0; i--) {
        var line = moves[i];
        if (line.action == 1) {
            pos = tracePosDealIntoNewStack(pos);
        } else if (line.action == 2) {
            pos = tracePosDealWithIncrement(pos, line.num);
        } else {
            pos = tracePosCut(pos, line.num);
        }
    }
    return pos;
}

function part2(size, input, endingPos) {
    var moves = readInput(input);
    //119315717514047 deck size
    //101741582076661 nr of times to shuffle

    deckSize = size;

    var pos = endingPos;

    pos = shufflePart2(pos, moves);
    console.log('on pos', endingPos, 'ends up card with number', pos);
    
    return pos;
}

var offset = part2(119315717514047n, input, 0n);
var direction = part2(119315717514047n, input, 1n)-offset;

console.log('solve with Wolfram Alpha: (', offset, '+', direction, '*X) mod', deckSize, '=2020');

// part1(10007, input);