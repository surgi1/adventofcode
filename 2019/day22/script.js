// part 2 felt math heavier than any other AOC puzzle, likely just me being a dummy in modular algebra

const readInput = (input) => {
    let moves = [];
    for (let i = 0; i < input.length; i++) {
        let line = input[i];
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

const initDeck = (cards) => {
    let deck = [];
    for (let i = 0; i < cards; i++) deck.push(i);
    return deck;
}

const dealIntoNewStack = (deck) => {
    let newDeck = [];
    for (let i = deck.length-1; i >= 0; i--) newDeck.push(deck[i]);
    return newDeck;
}

const cut = (deck, n) => {
    let newDeck = [];
    if (n > 0) {
        let cutCards = deck.splice(0, n);
        newDeck = deck.concat(cutCards);
    } else {
        n = Math.abs(n);
        let cutCards = deck.splice(deck.length-n, n);
        newDeck = cutCards.concat(deck);
    }
    return newDeck;
}

const dealWithIncrement = (deck, increment) => {
    let newDeck = [], len = deck.length;
    let newDeckIndex = 0, oldDeckIndex = 0;
    while (oldDeckIndex < len) {
        newDeck[newDeckIndex % len] = deck[oldDeckIndex];
        newDeckIndex += increment;
        oldDeckIndex++;
    }
    return newDeck;
}

const shuffle = (deck, moves) => {
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

const part1 = (size, i) => {
    let moves = readInput(input);
    let deck = initDeck(size);
    deck = shuffle(deck, moves);
    console.log('deck 1', deck/*, 'pos of card 2019', deck.indexOf(2019)*/);
}

let deckSize;

const tracePosDealIntoNewStack = (pos) => {
    return deckSize-pos-1n;
}

const tracePosCut = (pos, cut) => {
    if (cut > 0) {
        pos = (pos+cut) % deckSize;
    } else {
        pos = (pos + deckSize + cut) % deckSize;
    }
    return pos;
}

const tracePosDealWithIncrement = (pos, increment) => {
    if (pos % increment == 0) return pos/increment;

    for (let povlne = 1n; povlne < increment; povlne++) {
        if (increment - (povlne*deckSize % increment) == pos % increment) {
            return 1n+pos/increment+(povlne*deckSize)/increment;
        }
    }
}

const shufflePart2 = (pos, moves) => {
    for (let i = moves.length-1; i >= 0; i--) {
        let line = moves[i];
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

const part2 = (size, input, endingPos) => {
    let moves = readInput(input);

    deckSize = size;

    let pos = endingPos;

    pos = shufflePart2(pos, moves);
    console.log('on pos', endingPos, 'ends up card with number', pos);
    
    return pos;
}

let offset1 = part2(119315717514047n, input, 0n);
let slope1 = part2(119315717514047n, input, 1n)-offset1;

// finally, we need to transfer offset and slope according to the nr. of shuffles
let offset, slope;

let shuffles = 101741582076661n, shufflesBin = shuffles.toString(2);

let arr = [{offset: offset1, slope: slope1}];
for (let i = 1; i < shufflesBin.length; i++) {
    arr.push({
        offset: (arr[i-1].offset + arr[i-1].offset*arr[i-1].slope) % deckSize,
        slope: (arr[i-1].slope*arr[i-1].slope) % deckSize
    })
}

let shufflesBinReversed = shufflesBin.split('').reverse();
for (let i = 0; i < shufflesBinReversed.length; i++) {
    if (shufflesBinReversed[i] == '1') {
        if (offset == undefined) {
            offset = arr[i].offset; slope = arr[i].slope;
        } else {
            offset = (offset+arr[i].offset*slope) % deckSize;
            slope = (arr[i].slope*slope) % deckSize;
        }
    }
}

console.log('part 2 answer', (offset+slope*2020n) % deckSize);

// part1(10007, input);