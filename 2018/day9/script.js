//var players = 9;var marbles = 25+1;
//var players = 10;var marbles = 1618+1; // 8317
var players = 465; var marbles = 7194000+1;
var board = [], score = [0];

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
