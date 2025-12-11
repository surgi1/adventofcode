let root = $('#root'), commands, comp = new Computer(), invCount, rooms, lastLoc, loc, lastExecutedCommand;
const opDir = {north: 'south', south: 'north', west: 'east', east: 'west'};
const dirs = {north: {x: 0, y: -1}, south: {x: 0, y: 1}, east: {x: 1, y: 0}, west: {x: -1, y: 0}}

const drawRooms = rooms => {
    let map = [], size = 10, pos = {x:size/2, y:size/2}, mapEl = $('.map');
    rooms.map(r => delete r.drawn);
    const col = (map, x, res = []) => map.map(line => line[x])
    const insCol = (map, x) => map.map((line, y) => map[y].splice(x, 0, undefined))
    const roomClasses = room => Object.keys(dirs).filter(k => room[k] != undefined).join(' ')
    const roomPos = id => {
        for (let y = 0; y < map.length; y++)
            for (let x = 0; x < map[y].length; x++) if (map[y][x]?.id == id) return {x: x, y: y}
    }

    const drawMap = () => {
        mapEl.empty();
        for (let y = 0; y < map.length; y++) {
            for (let x = 0; x < map[y].length; x++) {
                if (map[y] == undefined || map[y][x] == undefined || map[y][x] == '') continue;
                let el = $('<div class="mappoint">', {css: {
                    left: x*18+'px',
                    top: y*18+'px'
                }}).addClass(roomClasses(map[y][x]));
                if (map[y][x].name == loc) el.html('@');
                mapEl.append(el)
            }
        }
    }

    const drawCorridors = () => {
        rooms.map(r => {
            Object.keys(dirs).filter(k => r[k] != undefined).map(k => {
                let p1 = roomPos(r.id);
                if (r[k] > r.id) {
                    let p2 = roomPos(r[k]);
                    if (p2) mapEl.append('<svg><polyline points="'+ (p1.x*18-9) + ',' + (p1.y*18+1) +' '+ (p2.x*18-9) + ',' + (p2.y*18+1) +'"></polyline></svg>')
                }
            })
        })
    }

    for (let y = 0; y < size; y++) map[y] = [];
    let toPlace = [{room: rooms[0], fromDir: {x:0,y:0}}], ptr = 0;
    while (ptr < toPlace.length) {
        let r = toPlace[ptr], dest;
        if (r.room.drawn) {ptr++; continue}
        if (r.fromRoom) {
            let p = roomPos(r.fromRoom.id);
            dest = {x: p.x+r.fromDir.x, y: p.y+r.fromDir.y}
            if (r.fromDir.x == 0) {
                if (map[dest.y].filter(v => v != '' && v != undefined).length > 0) map.splice(dest.y, 0, []);
            } else {
                if (col(map, dest.x).filter(v => v != '' && v != undefined).length > 0) insCol(map, dest.x);
            }
        } else {
            dest = {x: pos.x+r.fromDir.x, y: pos.y+r.fromDir.y}
        }
        map[dest.y][dest.x] = r.room;
        r.room.drawn = true;
        Object.entries(dirs).map(([k, v]) => r.room[k] != undefined && r.room[k] !== 999 && toPlace.push({room: rooms[r.room[k]], fromRoom: r.room, fromDir: v}));
        ptr++;
    }

    drawMap();
    drawCorridors();
}

const str2Command = s => {
    let res = [];
    s.split('').map(c => res.push(c.charCodeAt(0)))
    res.push(10);
    lastExecutedCommand = s;
    return res;
}

const addLoc = (name, exits) => {
    if (rooms.filter(r => r.name == name).length > 0) return rooms.filter(r => r.name == name)[0].id;
    let id = rooms.length;
    let tmp = {
        id: rooms.length,
        name: name
    }
    exits.map(e => tmp[e] = 999);
    rooms.push(tmp);
    return id;
}

const processOutput = s => {
    let enabled = ['inv'], arr = [], items = false, drops = false, bruteEnabled = false;
    loc = false;
    s.split("\n").map(line => {
        if (line.indexOf('==') > -1) {
            loc = line.substr(3, line.length-6);
            line = '<h3>'+loc+'</h3>';
            enabled = ['inv'];
            if (loc == 'Security Checkpoint') bruteEnabled = true;
        }

        if (line.indexOf('You take the') > -1) invCount++;
        if (line.indexOf('You drop the') > -1) invCount--;

        if (['Doors here lead:', 'Command?'].includes(line));
        else if (line == 'Items here:') items = [];
        else if (['- north', '- south', '- east', '- west'].includes(line)) enabled.push(line.substr(2));
        else if (items !== false && line != '') items.push(line.substr(2));
        else if (drops !== false && line != '') drops.push(line.substr(2));
        else if (line != '') arr.push(line);

        if (line == 'Items in your inventory:') drops = [];
    })

    if (loc !== false) {
        $('[data-action=direct]').attr('disabled', true);
        enabled.map(id => $('#'+id).removeAttr('disabled'));
        let id = addLoc(loc, enabled.filter(d => d != 'inv'));

        // connect lastLoc
        if (lastLoc !== false && loc != lastLoc) {
            let lastLocId = rooms.filter(r => r.name == lastLoc)[0].id;
            rooms[lastLocId][lastExecutedCommand] = id;
            rooms[id][opDir[lastExecutedCommand]] = lastLocId;
        }

        lastLoc = loc;
        drawRooms(rooms);
    }

    if (bruteEnabled) $('#brute').removeAttr('disabled'); else $('#brute').attr('disabled', true);

    let buttons = [];

    if (items !== false) items.forEach(i => {
        let btn = $('<button>', {
            text: i+' (take)',
            class: 'temp',
            id: 'clickMeBtn'
        });
        btn.on('click', function () {
            command('take '+i);
            btn.attr('disabled', 'disabled');
        });
        buttons.push(btn);
    })

    if (drops !== false) drops.forEach(i => {
        let btn = $('<button>', {
            text: i+' (drop)',
            class: 'temp'
        });
        btn.on('click', function () {
            command('drop '+i);
            btn.attr('disabled', 'disabled');
        });
        buttons.push(btn);
    })

    $('#inv').html('Inventory (' + invCount + ')');

    if (arr.length == 0 && buttons.length == 0) return '';

    let div = $('<div>', {
        class: 'output generated'
    });

    div.append(arr.join("<br>"));

    buttons.forEach(btn => div.append(btn));

    return div;
}

const tick = pars => {
    if (!pars) pars = [];
    let res = comp.run(pars), s = '';
    res.output.map(code => s += String.fromCharCode(code));
    root.prepend(processOutput(s));
}

const command = com => {
    if (!Array.isArray(com)) com = [com];
    commands.push(...com);
    com.map(c => tick(str2Command(c)))
}

const initGUI = () => {
    $('[data-action=direct]').map((b, el) => $(el).on('click', e => command($(el).attr('id'))))
    $('#brute').on('click', useBruteForce)
    $('#load').on('click', e => run(input))

    let keyMap = {
        ArrowLeft: 'west',
        ArrowRight: 'east',
        ArrowUp: 'north',
        ArrowDown: 'south'
    };

    window.addEventListener('keyup', e => (keyMap[e.key] !== undefined) && $('#'+keyMap[e.key]).click());
    window.addEventListener('keydown', e => (keyMap[e.key] !== undefined) && e.preventDefault());
}

const useBruteForce = () => {
    let secRoom = rooms.filter(r => r.name == loc)[0], exit;
    Object.entries(dirs).map(([k, v]) => {
        if (secRoom[k] == 999) exit = k;
    });
    command(generateVariantsCommands(commands, exit));
}

const generateVariantsCommands = (baseCommands, exit) => {
    let items = [];
    baseCommands.filter(com => com.indexOf('take ') > -1).map(com => {
        let item = com.substr(5);
        if (items.indexOf(item) == -1) items.push(com.substr(5))
    })

    let dropCommands = [];
    items.map(i => dropCommands.push('drop '+i));

    let variantCommands = [];
    for (let variant = 1; variant < Math.pow(2, items.length); variant++) {
        let s = variant.toString(2);
        while (s.length < items.length) s = '0'+s;
        let takeCommands = [];
        for (let i = 0; i < s.length; i++) {
            if (s[i] == 1) takeCommands.push('take '+items[i]);
        }
        variantCommands.push(...dropCommands, ...takeCommands, exit);
    }
    return variantCommands;
}

const run = input => {
    let customInput = $('#intcode').val();
    if (customInput != '') input = customInput.split(',').map(i => parseInt(i));
    commands = []; invCount = 0; rooms = []; lastLoc = false; loc = false;
    $('.generated').remove();
    comp.load(input);
    comp.reset();
    tick();
}

initGUI();
run(input);
