//let players = 9;let marbles = 25+1;
//let players = 10;let marbles = 1618+1; // 8317
let players = 465; let marbles = 7194000+1;
let board = [], score = [0], list = [];

// returns new current linked item
const insertMarble = (nr, currentItem) => {
    let ll = list.length; // id noveho clanku
    
    let tmp = {
        id: ll,
        value: nr
    }

    // 2 specials
    if (ll == 0) {
        tmp.left = 1;
        tmp.right = 1;
        list.push(tmp);
        return list[0];
    }

    if (ll == 1) {
        tmp.left = 0;
        tmp.right = 0;
        list.push(tmp)
        return list[1];
    }

    // item to the right of current
    let right1 = list[currentItem.right];
    let right2 = list[right1.right];

    right1.right = tmp.id;
    right2.left = tmp.id;

    tmp.left = right1.id;
    tmp.right = right2.id;

    list.push(tmp);

    return list[ll];
}

let currentItem = false;
currentItem = insertMarble(0, currentItem);// start the game

console.time('execute');

for (let i = 1; i < marbles; i++) {

    let playerId = ((i-1) % players)+1;
    if (!score[playerId]) score[playerId] = 0;

    if (i % 23 == 0) {
        for (let iter = 0; iter < 7; iter++) currentItem = list[currentItem.left];
        
        score[playerId] = score[playerId]+i+currentItem.value;
        
        let leftItem = list[currentItem.left];
        let rightItem = list[currentItem.right];
        
        leftItem.right = rightItem.id;
        rightItem.left = leftItem.id;

        currentItem = rightItem;
    } else {
        currentItem = insertMarble(i, currentItem);
    }
}

console.timeLog('execute');
console.log('game ended', Math.max(...score), score);

const list2array = () => {
    let arr = [];
    let startingIndex = 0;
    let startingItem = list[startingIndex];
    let cItem = list[startingIndex];
    while (cItem.right != startingIndex) {
        arr.push(cItem.value);
        cItem = list[cItem.right];
    }
    arr.push(cItem.value);
    return arr;
}
