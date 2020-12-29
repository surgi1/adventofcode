// Contains visuals and playable game. This was such a cool puzzle!!
// Comment out the last line of this file and enjoy some legacy arkanoid in ASCII!

let screen = [], score = 0, pre, timerHandle;
let comp = new Computer();

const renderScreen = () => {
    pre.empty();
    for (let y=1;y<=40;y++) {
        let line = '';
        if (!screen[y]) screen[y] = [];
        for (let x=0;x<=40;x++) {
            let tileId = screen[y][x] || 0;
            let char = ' ';
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

const getPos = tileId => {
    // id 3 paddle, id 4 ball
    for (let y=1;y<=40;y++) {
        for (let x=0;x<=40;x++) {
            if (screen[y][x] == tileId) return {x:x,y:y}
        }
    }
}

const gameTick = actionId => {
    let result = comp.run([actionId]);
    for (let i = 0; i < result.output.length/3; i++) {
        let x = result.output[i*3+0];
        let y = result.output[i*3+1];
        let tileId = result.output[i*3+2];
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

const initGame = () => {
    pre = $('<pre>');
    $('#root').append(pre);

    input[0] = 2;
    comp.load(input);

    let result = comp.run();

    for (let i = 0; i < result.output.length/3; i++) {
        let x = result.output[i*3+0];
        let y = result.output[i*3+1];
        let tileId = result.output[i*3+2];
        if (!screen[y]) screen[y] = [];
        screen[y][x] = tileId;
    }

    let keyMap = {
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

const autoPlay = () => {
    let ballPos = getPos(4);
    let paddlePos = getPos(3);
    if (ballPos.x < paddlePos.x) gameTick(-1);
    if (ballPos.x > paddlePos.x) gameTick(1);
    if (ballPos.x == paddlePos.x) gameTick(0);
}

initGame();

// comment out the line bellow and play yourself using arrows left/right/up!
timerHandle = setInterval(() => autoPlay(), 5);