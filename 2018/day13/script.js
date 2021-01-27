// astonishing visuals!
const subSteps = 4, spriteSize = 32;
let carts, data, ticks = 0, cameraTargets = [], cameraTargetId = 0, cartsInitialized = false, spritesImage;

const cartVelocity = chr => {
    switch (chr) {
        case '^': return {x: 0, y: -1};
        case 'v': return {x: 0, y: 1};
        case '>': return {x: 1, y: 0};
        case '<': return {x: -1, y: 0};
    }
}

const initSprites = () => {
    spritesImage = new Image(spriteSize*7, spriteSize);
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

const drawCarts = () => {
    initCarts();
    carts.filter(c => !(c.crashed && c.exploded)).map(cart => {
        let div = $('#cart_'+cart.id);
        if (cart.crashed !== true) {
            div.removeClass('top-bottom left-right').addClass(!cart.v.x ? 'top-bottom' : 'left-right');
            let substepPx = (ticks % subSteps)*spriteSize/subSteps
            div.css('left', (cart.x*spriteSize-12+substepPx*cart.v.x)+'px');
            div.css('top', (cart.y*spriteSize-12-10+substepPx*cart.v.y)+'px');
        } else {
            cart.exploded = true;
            // explosion
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
                left: cart.x*spriteSize+'px',
                top: cart.y*spriteSize+'px'
            }
        }).addClass('cart');
        $('#root').append(div);
    })
}

const initCanvas = () => {
    const spriteOffsets = {
        'rail-top-bottom': 0,
        'rail-left-right': spriteSize,
        'corner-left-top': 2*spriteSize,
        'corner-right-top': 3*spriteSize,
        'corner-right-bottom': 4*spriteSize,
        'corner-left-bottom': 5*spriteSize,
        'cross': 6*spriteSize
    };
    const canvas = document.getElementById('canvas');
    canvas.width = spriteSize*data.length;
    canvas.height = spriteSize*data[0].length;
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
                    sprite = ['-', '+'].includes(data[y][x+1]) ? 'corner-right-bottom' : 'corner-left-top';
                }
                if (char == '\\') {
                    // left-bottom or right-top
                    sprite = ['-', '+'].includes(data[y][x+1]) ? 'corner-right-top' : 'corner-left-bottom';
                }
                ctx.drawImage(spritesImage, spriteOffsets[sprite], 0, spriteSize, spriteSize, x*spriteSize, y*spriteSize, spriteSize, spriteSize);
            }
        })
    })
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