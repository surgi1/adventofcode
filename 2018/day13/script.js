// astonishing visuals!
const cartVelocity = {'^':{x:0,y:-1},'v':{x:0,y:1},'>':{x:1,y:0},'<':{x:-1,y:0}}, subSteps = 4, spriteSize = 32,
      sprites = ['top-bottom','left-right','left-top','right-top','right-bottom','left-bottom','cross'];

let carts, data, ticks = 0, camTargets = [], camTargetPtr = 0, spritesImage = new Image();

const init = input => {
    carts = [];
    data = input.split("\n");
    data.map((line, y) => {
        line.split('').map((chr, x) => {
            if (chr.match(/[\^><v]/g)) carts.push({
                id: carts.length,
                x: x, y: y,
                crossings: 0,
                v: cartVelocity[chr]
            });
        })
        data[y] = line.replaceAll(">", "-").replaceAll("<", "-").replaceAll("^", "|").replaceAll("v", "|");
    })
}

const initGraphics = () => {
    let canvas = $('#canvas')[0], ctx = canvas.getContext('2d');
    canvas.width = spriteSize*data.length;
    canvas.height = spriteSize*data[0].length;

    spritesImage.onload = () => data.map((line, y) => line.split('').map((char, x) => {
        if (char != ' ') {
            let spriteId = false;
            if (char == '|') spriteId = 0;
            if (char == '-') spriteId = 1;
            if (char == '+') spriteId = 6;
            if (char == '/') spriteId = ['-', '+'].includes(data[y][x+1]) ? 4 : 2;
            if (char == '\\') spriteId = ['-', '+'].includes(data[y][x+1]) ? 3 : 5;
            ctx.drawImage(spritesImage, spriteId*spriteSize, 0, spriteSize, spriteSize, x*spriteSize, y*spriteSize, spriteSize, spriteSize);
        }
    }))
    spritesImage.src = './rails.png';

    carts.map(cart => $('#root').append($('<div>', {id: 'cart_'+cart.id, class: 'cart'})))
}

const drawCarts = () => carts.filter(c => !(c.crashed && c.exploded)).map(cart => {
    let div = $('#cart_'+cart.id);
    if (!cart.crashed) {
        div.removeClass('vertical horizontal').addClass(!cart.v.x ? 'vertical' : 'horizontal');
        let subPx = (ticks % subSteps)*spriteSize/subSteps;
        div.css('left', (cart.x*spriteSize+subPx*cart.v.x-12)+'px');
        div.css('top', (cart.y*spriteSize+subPx*cart.v.y-22)+'px');
    } else {
        cart.exploded = true;
        $('.explosion-wrapper').css({
            visibility: 'visible',
            left: (cart.x*spriteSize-128)+'px',
            top: (cart.y*spriteSize-128)+'px'
        });
        $('.explosion').addClass('hide');
        setTimeout(() => {
            $('.explosion-wrapper').css('visibility', 'hidden');
            $('.explosion').removeClass('hide');
        }, 2000)
        setTimeout(() => div.addClass('hide'), 1000);
        setTimeout(() => camTargetPtr++, 3000);
    }
})

const moveCart = cart => {
    cart.x += cart.v.x;
    cart.y += cart.v.y;

    switch (data[cart.y][cart.x]) {
        case '\\': cart.v = {x: cart.v.y, y: cart.v.x}; break;
        case '/': cart.v = {x: -cart.v.y, y: -cart.v.x}; break;
        case '+':
            switch (cart.crossings % 3) {
                case 0: cart.v = {x: cart.v.y, y: -cart.v.x}; break; // turn cart left; x,y => y,-x
                case 2: cart.v = {x: -cart.v.y, y: cart.v.x}; break; // turn cart right; x,y -> -y,x
            }
            cart.crossings++;
            break;
    }

    detectCollision();
}

const detectCollision = () => carts.filter(c => !c.crashed).map(c1 => {
    carts.filter(c => !c.crashed && c.id != c1.id).filter(c2 => (c1.x==c2.x)&&(c1.y==c2.y)).map(c2 => {
        c1.crashed = true; c2.crashed = true;
        console.log('Collision at', c1.x, c1.y, 'carts', c1, c2);
        camTargets.push(c1.id, c2.id);
    })
})

const moveCarts = () => carts.filter(c => !c.crashed)
                             .sort((c1,c2) => (c1.y*data[0].length+c1.x) - (c2.y*data[0].length+c2.x))
                             .map(moveCart)

const tick = () => {
    ticks++;
    requestAnimationFrame(tick);
    if (ticks % subSteps == 0) moveCarts();
    drawCarts();
    let params = {behavior: 'smooth', inline: 'center', block: 'center'},
        el = document.getElementById('cart_'+camTargets[camTargetPtr]);
    if (el.scrollIntoViewIfNeeded) el.scrollIntoViewIfNeeded(params); else el.scrollIntoView(params);
}

const solve = () => {
    while (carts.filter(c => !c.crashed).length > 1) moveCarts();
    let survivor = carts.filter(c => c.crashed !== true)[0];
    camTargets.push(survivor.id);
    console.log('game ended with 1 survivor', survivor);
}

fetch('./input.txt').then(res => res.text()).then(input => run(input)).catch(error => {
    fetch('https://mazegame.org/adventofcode/2018/day13/input.txt').then(res => res.text()).then(input => run(input))
});

const run = input => {
    init(input);
    solve();

    init(input);
    initGraphics();
    setTimeout(() => tick(), 0)
}