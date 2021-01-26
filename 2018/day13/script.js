// astonishing visuals!
let carts, data, ticks = 0, subSteps = 4, cameraTargets = [], cameraTargetId = 0, cartsInitialized = false, spritesImage;

const cartVelocity = chr => {
    let v = {};
    switch (chr) {
        case '^': v = {x: 0, y: -1}; break;
        case 'v': v = {x: 0, y: 1}; break;
        case '>': v = {x: 1, y: 0}; break;
        case '<': v = {x: -1, y: 0}; break;
    }
    return v;
}

const initSprites = () => {
    spritesImage = new Image(32*7, 32);
    spritesImage.onload = initCanvas;
    spritesImage.src = './rails.png';
}

const init = input => {
    carts = [];
    data = input.split("\n");
    data.map((line, index) => {
        for (let i=0;i<line.length;i++) {
            let chr = line[i];
            if (chr.match(/[\^><v]/g)) {
                let id = carts.length;
                let cart = {
                    x: i,
                    y: index,
                    id: id,
                    crossings: 0,
                    v: cartVelocity(chr)
                }
                carts.push(cart);
            }
        }
        data[index] = line.replaceAll(">", "-").replaceAll("<", "-").replaceAll("^", "|").replaceAll("v", "|");
    })
}

const cartClass = cart => {
    if (cart.v.x == 0 && cart.v.y == -1) return 'top';
    if (cart.v.x == 0 && cart.v.y == 1) return 'bottom';
    if (cart.v.x == 1 && cart.v.y == 0) return 'right';
    if (cart.v.x == -1 && cart.v.y == 0) return 'left';
}

const drawCarts = () => {
    initCarts();
    carts.map((cart, index) => {
        let div = $('#cart_'+cart.id);
        if (cart.crashed !== true) {
            div.removeClass('top bottom left right');
            div.addClass(cartClass(cart));
            let substepPx = (ticks % subSteps)*32/subSteps
            div.css('left', (cart.x*32-12+substepPx*cart.v.x)+'px');
            div.css('top', (cart.y*32-12-10+substepPx*cart.v.y)+'px');
        } else {
            if (cart.exploded) return;
            cart.exploded = true;
            // explosion
            let ex = $('.explosion-wrapper');
            ex.css('visibility', 'visible');
            ex.css('left', (cart.x*32-128)+'px');
            ex.css('top', (cart.y*32-128)+'px');
            $('.explosion').addClass('hide');
            setTimeout(() => {
                ex.css('visibility', 'hidden');
                $('.explosion').removeClass('hide');
            }, 2000)
            setTimeout(() => div.addClass('hide'), 1000);
            setTimeout(() => cameraTargetId++, 3000);
        }
    })
}

const initCarts = () => {
    if (cartsInitialized) return;
    cartsInitialized = true;
    carts.map((cart, index) => {
        let div = $('<div />', {
            id: 'cart_'+cart.id,
            css: {
                left: cart.x*32+'px',
                top: cart.y*32+'px'
            }
        }).addClass('cart');
        $('#root').append(div);
    })
}

const initCanvas = () => {
    const spriteOffsets = {
        'rail-top-bottom': 0,
        'rail-left-right': 32,
        'corner-left-top': 64,
        'corner-right-top': 96,
        'corner-right-bottom': 128,
        'corner-left-bottom': 160,
        'cross': 192
    };
    const canvas = document.getElementById('canvas');
    canvas.width = 32*data.length;
    canvas.height = 32*data[0].length;
    const ctx = canvas.getContext('2d');

    data.map((line, y) => {
        line.split('').map((char, x) => {
            if (char != ' ') {
                let sprite = '';
                if (char == '|') sprite = 'rail-top-bottom';
                if (char == '-') sprite = 'rail-left-right';
                if (char == '+') sprite = 'cross';
                if (char == '/') {
                    // right-bottom or left-top
                    if (['-', '+'].includes(data[y][x+1])) sprite = 'corner-right-bottom'; else sprite = 'corner-left-top';
                }
                if (char == '\\') {
                    // left-bottom or right-top
                    if (['-', '+'].includes(data[y][x+1])) sprite = 'corner-right-top'; else sprite = 'corner-left-bottom';
                }
                let offset = spriteOffsets[sprite];
                ctx.drawImage(spritesImage, offset, 0, 32, 32, x*32, y*32, 32, 32);
            }
        })
    })

    console.log('background inited');
}

const moveCart = cart => {
    cart.x += cart.v.x;
    cart.y += cart.v.y;

    // curves handling
    if (data[cart.y][cart.x] == '\\') {
        cart.v = {x: cart.v.y, y: cart.v.x}
    } else if (data[cart.y][cart.x] == '/') {
        cart.v = {x: -cart.v.y, y: -cart.v.x}
    };

    // crossing handling
    if (data[cart.y][cart.x] == '+') {
        let crossingMode = cart.crossings % 3; // 0 -> left, 1 -> straight, 2 -> right
        if (crossingMode == 0) {
            cart.v = {x: cart.v.y, y: -cart.v.x} // turn cart left; x,y => y,-x
        } else if (crossingMode == 2) {
            cart.v = {x: -cart.v.y, y: cart.v.x} // turn cart right; x,y -> -y,x
        }
        cart.crossings++;
    }

    detectCollision();
}

const detectCollision = () => {
    carts.filter(c => !c.crashed).map(c1 => {
        carts.filter(c => !c.crashed && c.id != c1.id).filter(c2 => (c1.x==c2.x)&&(c1.y==c2.y)).map(c2 => {
            c1.crashed = true; c2.crashed = true;
            console.log('Collision at', c1.x, c1.y, 'carts', c1, c2);
            cameraTargets.push(c1.id, c2.id);
        })
    })
}

const moveCarts = () => {
    carts.filter(c => !c.crashed).sort((c1,c2) => {
        let s1 = c1.y*data[0].length+c1.x;
        let s2 = c2.y*data[0].length+c2.x;
        return s1-s2;
    }).map(moveCart)
}

const tick = () => {
    ticks++;
    requestAnimationFrame(tick);
    if (ticks % subSteps == 0) moveCarts();
    drawCarts();
    document.getElementById('cart_'+cameraTargets[cameraTargetId]).scrollIntoViewIfNeeded({behavior: 'smooth', inline: 'center', block: 'center'});
}

const solve = () => {
    while (carts.filter(c => !c.crashed).length > 1) moveCarts();
    let survivor = carts.filter(c => c.crashed !== true)[0];
    cameraTargets.push(survivor.id);
    console.log('game ended with 1 survivor', survivor);
}

//fetch('https://mazegame.org/adventofcode/2018/day13/input.txt')
fetch('./input.txt')
    .then(res => res.text()).then(input => run(input))

const run = input => {
    init(input);
    solve();

    init(input);
    initSprites();
    setTimeout(() => tick(), 0)
}
