// just part 2
let map = [], size = 120, offset = {x:1509, y: 773}; // guesstimated and fine-tuned on screen

let root = $('#root');
let pre = $('<pre />');
root.append(pre);

const renderScreen = () => {
    pre.empty();
    for (let y = 0; y < size; y++) {
        let line = '';
        for (let x = 0; x < size; x++) {
            let tileId = map[y][x] || 0;
            let char = ' ';
            if (tileId == 1) char = '#';
            if (y < 100 && x < 100 && map[y][x] == 1) char = 'O';
            line = line+char;
        }
        pre.append(line);
        pre.append('<br>');
    }
}

const renderBeam = (offset) => {
    for (let y = 0; y < size; y++) {
        map[y] = [];
        for (let x = 0; x < size; x++) {
            comp.reset();
            let result = comp.run([x+offset.x,y+offset.y]);
            map[y][x] = result.output[0];
        }
    }

    renderScreen();
}

let comp = new Computer();
comp.load(input);
renderBeam(offset);