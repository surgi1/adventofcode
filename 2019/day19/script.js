// just part 2
var map = [], size = 120, offset = {x:1509, y: 773}; // guesstimated and fine-tuned on screen

var root = $('#root');
var pre = $('<pre />');
root.append(pre);

function renderScreen() {
    pre.empty();
    for (var y = 0; y < size; y++) {
        var line = '';
        for (var x = 0; x < size; x++) {
            var tileId = map[y][x] || 0;
            var char = ' ';
            if (tileId == 1) char = '#';
            if (y < 100 && x < 100 && map[y][x] == 1) char = 'O';
            line = line+char;
        }
        pre.append(line);
        pre.append('<br>');
    }
}

function renderBeam(offset) {
    for (var y = 0; y < size; y++) {
        map[y] = [];
        for (var x = 0; x < size; x++) {
            comp.reset();
            var result = comp.run([x+offset.x,y+offset.y]);
            map[y][x] = result.output[0];
        }
    }

    renderScreen();
}

var comp = new Computer();
comp.load(input);
renderBeam(offset);