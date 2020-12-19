// Contains visuals and playable game. This was such a cool puzzle!!
// Comment out the last line of this file and enjoy some legacy arkanoid in ASCII!

var screen = [], score = 0, pre, timerHandle;
var comp = new Computer();

function renderScreen() {
    pre.empty();
    for (var y=1;y<=40;y++) {
        var line = '';
        if (!screen[y]) screen[y] = [];
        for (var x=0;x<=40;x++) {
            var tileId = screen[y][x] || 0;
            var char = ' ';
            if (tileId == 1) char = '|';
            if (tileId == 2) char = '#';
            if (tileId == 3) char = '&mdash;';
            if (tileId == 4) char = 'o';
            line = line+char;
        }
        pre.append(line);
        pre.append('<br>');
    }
}

function getPos(tileId) {
    // id 3 paddle, id 4 ball
    for (var y=1;y<=40;y++) {
        for (var x=0;x<=40;x++) {
            if (screen[y][x] == tileId) return {x:x,y:y}
        }
    }
}

function gameTick(actionId) {
    var result = comp.run([actionId]);
    for (var i = 0; i < result.output.length/3; i++) {
        var x = result.output[i*3+0];
        var y = result.output[i*3+1];
        var tileId = result.output[i*3+2];
        if (x == -1 && y == 0) {
            score = tileId;
            console.log('score changed to', score);
            $('#score').text('SCORE: '+score);
            if (score == 0) {
                console.log('Game over.');
                if (timerHandle) clearInterval(timerHandle);
            }
        } else {
            if (!screen[y]) screen[y] = [];
            screen[y][x] = tileId;
        }
    }
    renderScreen();
}

function initGame() {
    pre = $('<pre>');
    $('#root').append(pre);

    input[0] = 2;
    comp.load(input);

    var result = comp.run();

    for (var i = 0; i < result.output.length/3; i++) {
        var x = result.output[i*3+0];
        var y = result.output[i*3+1];
        var tileId = result.output[i*3+2];
        if (!screen[y]) screen[y] = [];
        screen[y][x] = tileId;
    }

    var keyMap = {
        ArrowLeft: -1,
        ArrowRight: 1,
        ArrowUp: 0
    };

    $(document).keyup(function(e) {
        if (keyMap[e.key] !== undefined) {
            gameTick(keyMap[e.key]);
        }
    });

    renderScreen();
}

function autoPlay() {
    var ballPos = getPos(4);
    var paddlePos = getPos(3);
    if (ballPos.x < paddlePos.x) gameTick(-1);
    if (ballPos.x > paddlePos.x) gameTick(1);
    if (ballPos.x == paddlePos.x) gameTick(0);
}

initGame();

// comment out the line bellow and play yourself using arrows left/right/up!
timerHandle = setInterval(() => autoPlay(), 5);