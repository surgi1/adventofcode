var players = 9;var marbles = 25+1;
var players = 10;var marbles = 1618+1; // 8317
//var players = 17;var marbles = 1104+1; // 2764
var players = 30;var marbles = 5807+1; // 37305
//var players = 465; var marbles = 71940+1;
var players = 465; var marbles = 71940+1;
var players = 465; var marbles = 7194000+1;
var board = [], score = [0];
/*
// returns new currentMarbleIndex value
function insertMarble(nr, index) {
    var bl = board.length;

    if (bl < 2) {
        board.push(nr);
        index = board.length-1;
    } else {
        // move 2 to the right of the current marble
        if (index+2 == bl) {
            // inserting at the end of board
            board.push(nr);
            index = board.length-1;
        } else if (index+2 > bl) {
            // na misto board[1]
            board = [].concat([board[0], nr], board.slice(1));
            index = 1;
        } else {
            board = [].concat(board.slice(0,index+2), [nr], board.slice(index+2));
            index = index+2;
        }
    }
    return index;

}

var currentMarbleIndex;
var lastMaxScore = 0;

// init game
insertMarble(0);
console.time('execute');
for (var i = 1; i < marbles; i++) {
    var playerId = ((i-1) % players)+1;
    if (!score[playerId]) score[playerId] = 0;

    if (i % 23 == 0) {
        // magic
        // find marble board.indexOf(currentMarble)-7 and remove it, add to score
        var index = currentMarbleIndex-7;
        if (index < 0) index = board.length+index;
        score[playerId] = score[playerId]+i+board[index];
        board.splice(index,1);
        var newCurrentMarbleIndex = index;
        if (newCurrentMarbleIndex == board.length) newCurrentMarbleIndex = 0;
        currentMarbleIndex = newCurrentMarbleIndex;
        //if (Math.max(...score) > lastMaxScore) {lastMaxScore = Math.max(...score);console.log(i, lastMaxScore);}
    } else {
        currentMarbleIndex = insertMarble(i, currentMarbleIndex);
    }

}
console.timeLog('execute');
console.log('game ended', Math.max(...score), score);

*/

// predelavka do linked listu
var list = [];

// returns new current linked item
function insertMarble(nr, currentItem) {
    var ll = list.length; // id noveho clanku
    
    var tmp = {
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
    var right1 = list[currentItem.right];
    var right2 = list[right1.right];

    right1.right = tmp.id;
    right2.left = tmp.id;

    tmp.left = right1.id;
    tmp.right = right2.id;

    list.push(tmp);

    return list[ll];

}

var currentItem = false;
currentItem = insertMarble(0, currentItem);// start the game

console.time('execute');

for (var i = 1; i < marbles; i++) {

    var playerId = ((i-1) % players)+1;
    if (!score[playerId]) score[playerId] = 0;

    if (i % 23 == 0) {
        // magic

        // 7 to the left
        for (var iter = 0; iter < 7; iter++) currentItem = list[currentItem.left];
        
        score[playerId] = score[playerId]+i+currentItem.value;
        
        var leftItem = list[currentItem.left];
        var rightItem = list[currentItem.right];
        
        leftItem.right = rightItem.id;
        rightItem.left = leftItem.id;

        currentItem = rightItem;
    } else {
        currentItem = insertMarble(i, currentItem);
    }
}

console.timeLog('execute');
console.log('game ended', Math.max(...score), score);

function list2array() {
    var arr = [];
    var startingIndex = 0;
    var startingItem = list[startingIndex];
    var cItem = list[startingIndex];
    while (cItem.right != startingIndex) {
        arr.push(cItem.value);
        cItem = list[cItem.right];
    }
    arr.push(cItem.value);
    return arr;
}

//console.log(list2array(), list);

// p2 quess: 3844750000 too high
// p2 guess: 3044750000 too low
// p2 guess: 3494750000 too high
