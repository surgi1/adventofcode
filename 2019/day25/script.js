// play the text game, it is lot of fun!
// find 8 items, navigate to final location, export your journey up to that point into baseCommands, then power up the brute-force

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

const processOutput = s => {
    let enabled = ['inv'], arr = [], items = false, drops = false, locChanged = false;
    s.split("\n").map(line => {
        if (line.indexOf('==') > -1) {
            locChanged = true;
            line = '<h3>'+line+'</h3>';
        }

        if (['Doors here lead:', 'Command?'].includes(line));
        else if (line == 'Items here:') items = [];
        else if (['- north', '- south', '- east', '- west'].includes(line)) enabled.push(line.substr(2));
        else if (items !== false && line != '') items.push(line.substr(2));
        else if (drops !== false && line != '') drops.push(line.substr(2));
        else if (line != '') arr.push(line);

        if (line == 'Items in your inventory:') drops = [];
    })

    if (locChanged) {
        $('[data-action=direct]').attr('disabled', true);
        enabled.map(id => $('#'+id).removeAttr('disabled'));
    }
    if (items !== false) items.map(i => arr.push(`<button onclick="command('take `+i+`')">`+i+` (take)</button>`))
    if (drops !== false) drops.map(i => arr.push(`<button onclick="command('drop `+i+`')">`+i+` (drop)</button>`))
    return '<div class="output">'+arr.join("<br>")+'</div>';
}

const tick = pars => {
    if (!pars) pars = [];
    let res = comp.run(pars);
    let s = '';
    res.output.map(code => s += String.fromCharCode(code));
    pre.prepend(processOutput(s));
}

const command = com => {
    if (!Array.isArray(com)) com = [com];
    commands.push(...com);
    com.map(c => tick(str2Command(c)))
}

const initGUI = () => {
    let root = $('#root');
    pre = $('<div>');
    root.append(pre);
    $('[data-action=direct]').map((b, el) => $(el).on('click', e => command($(el).attr('id'))))
    $('#export').on('click', e => console.log('path so far', commands))
}

const generateVariantsCommands = baseCommands => {
    // distill the items
    let items = [];
    baseCommands.filter(com => com.indexOf('take ') > -1).map(com => items.push(com.substr(5)))

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

//command([...baseCommands, ...generateVariantsCommands(baseCommands)]); // uncomment once you have the base commands ready
