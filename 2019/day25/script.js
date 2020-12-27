// play the text game, it is lot of fun!
// find 8 items, navigate to final location, export your journey up to that point, then power up the automatization

let pre, commands = [];
const comp = new Computer();

const str2Command = s => {
    let res = [];
    for (let i = 0; i < s.length; i++) {
        res.push(s.charCodeAt(i));
    }
    res.push(10);
    return res;
}

const tick = pars => {
    if (!pars) pars = [];
    let res = comp.run(pars);
    let s = '';
    res.output.map(code => s += String.fromCharCode(code));
    pre.append(s);
}

const command = com => {
    commands.push(...com);
    if (Array.isArray(com)) {
        com.map(c => {
            tick(str2Command(c));
        })
    } else {
        tick(str2Command(com));
    }
}

const commandValue = () => {
    return $('#command').val().split(/\n/).filter(l => l.length != 0)
}

const initGUI = () => {
    let root = $('#root');
    pre = $('<pre>');
    root.append(pre);

    $('#send').on('click', e => {
        command(commandValue());
        window.scrollTo(0, document.body.scrollHeight);
        $('#command').val('').focus();
    })

    $('#command').keypress(event => {
        let keycode = (event.keyCode ? event.keyCode : event.which);
        if (keycode == '13') $('#send').click();
    });

    $('#export').on('click', e => {
        console.log('path so far', commands);
    })
}

const generateVariantsCommands = () => {
    let items = ['mouse', 'whirled peas', 'planetoid', 'klein bottle', 'mutex', 'dark matter', 'fuel cell', 'antenna'];

    let dropCommands = [];
    items.map(i => dropCommands.push('drop '+i));

    let variantCommands = [];
    for (let variant = 1; variant <= 255; variant++) {
        let s = variant.toString(2);
        while (s.length < 8) s = '0'+s;
        let takeCommands = [];
        for (let i = 0; i < s.length; i++) {
            if (s[i] == 1) takeCommands.push('take '+items[i]);
        }
        variantCommands.push(...dropCommands, ...takeCommands, 'north');
    }
    return variantCommands;
}

initGUI();

comp.load(input);
tick();

let baseCommands = ['west','take mouse','west','west','east','south','take dark matter','north','east','north','east','take klein bottle','west','south','west','east','east','south','take fuel cell','north','north','west','south','take planetoid','west', 'take antenna', 'east','east','take mutex','east','west','south','take whirled peas', 'south', 'east']

//command([...baseCommands, ...generateVariantsCommands()]); // uncomment once you have the base commands ready
