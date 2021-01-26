// astonishing visuals!
let carts, data, ticks = 0, steps = 4, cameraTargets = [], cameraTargetId = 0;

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

    imagesSrc.map((i, id) => {
        images[id] = new Image(32, 32);
        images[id].onload = imageLoaded;
        images[id].src = './'+i+'.png';
    })
}

const cartClass = cart => {
    if (cart.v.x == 0 && cart.v.y == -1) return 'top';
    if (cart.v.x == 0 && cart.v.y == 1) return 'bottom';
    if (cart.v.x == 1 && cart.v.y == 0) return 'right';
    if (cart.v.x == -1 && cart.v.y == 0) return 'left';
}

const drawCarts = () => {
    carts.map((cart, index) => {
        let div = $('#cart_'+cart.id);
        if (cart.crashed !== true) {
            div.removeClass('top bottom left right');
            div.addClass(cartClass(cart));
            let substepPx = (ticks % steps)*32/steps
            div.css('left', (cart.x*32-12+substepPx*cart.v.x)+'px');
            div.css('top', (cart.y*32-12-10+substepPx*cart.v.y)+'px');
        } else {
            if (!cart.exploded) {
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
        }
    })
}

const initCarts = () => {
    carts.map((cart, index) => {
        let div = $('<div />', {
            id: 'cart_'+cart.id,
            css: {
                left: cart.x*32+'px',
                top: cart.y*32+'px'
            }
        }).addClass('cart');
        rootEl.append(div);
    })
}

let rootEl = $('#root'), initialized = false;

let imagesSrc = [
    'rail-top-bottom',
    'rail-left-right',
    'corner-left-top',
    'corner-right-top',
    'corner-right-bottom',
    'corner-left-bottom',
    'cross',
    /*'./cart-left-right.png',
    './cart-top-bottom.png',
    './cart-left-right.png',
    './cart-top-bottom.png'*/
], images = [], loaded = 0;

const imageLoaded = () => {
    loaded++;
    if (loaded == imagesSrc.length) initCanvas();
}

const initCanvas = () => {
    const canvas = document.getElementById('canvas');
    canvas.width = 32*data.length;
    canvas.height = 32*data[0].length;
    const ctx = canvas.getContext('2d');

    data.map((line, y) => {
        line.split('').map((char, x) => {
            if (char != ' ') {
                let imgName = '';
                if (char == '|') imgName = 'rail-top-bottom';
                if (char == '-') imgName = 'rail-left-right';
                if (char == '+') imgName = 'cross';
                if (char == '/') {
                    // right-bottom or left-top
                    if (['-', '+'].includes(data[y][x+1])) imgName = 'corner-right-bottom'; else imgName = 'corner-left-top';
                }
                if (char == '\\') {
                    // left-bottom or right-top
                    if (['-', '+'].includes(data[y][x+1])) imgName = 'corner-right-top'; else imgName = 'corner-left-bottom';
                }
                let img = images[imagesSrc.indexOf(imgName)];
                ctx.drawImage(img, 0, 0, 32, 32, x*32, y*32, 32, 32);
            }
        })
    })

    console.log('background inited');
}

const initScene = () => {
    if (initialized) return;
    initialized = true;
    initCarts();
}

const drawScene = () => {
    initScene();
    drawCarts();
}

const moveCart = cart => {
    cart.x = cart.x+cart.v.x;
    cart.y = cart.y+cart.v.y;

    // curves handling
    if (data[cart.y][cart.x] == '\\') {  // \
        if (cart.v.y == 0 && cart.v.x == 1) {
            cart.v.y = 1;
            cart.v.x = 0;
        } else if (cart.v.y == -1 && cart.v.x == 0) {
            cart.v.y = 0;
            cart.v.x = -1;
        } else if (cart.v.y == 1 && cart.v.x == 0) {
            cart.v.y = 0;
            cart.v.x = 1;
        } else if (cart.v.y == 0 && cart.v.x == -1) {
            cart.v.y = -1;
            cart.v.x = 0;
        }
    };
    if (data[cart.y][cart.x] == '/') {  // /
        if (cart.v.y == 0 && cart.v.x == 1) {
            cart.v.y = -1;
            cart.v.x = 0;
        } else if (cart.v.y == -1 && cart.v.x == 0) {
            cart.v.y = 0;
            cart.v.x = 1;
        } else if (cart.v.y == 1 && cart.v.x == 0) {
            cart.v.y = 0;
            cart.v.x = -1;
        } else if (cart.v.y == 0 && cart.v.x == -1) {
            cart.v.y = 1;
            cart.v.x = 0;
        }
    };

    // crossing handling
    if (data[cart.y][cart.x] == '+') {
        let crossingMode = cart.crossings % 3; // 0 -> left, 1 -> straight, 2 -> right
        let oldX = cart.v.x;
        let oldY = cart.v.y;
        if (crossingMode == 0) {
            // turn cart left 
            // x,y => y,-x
            cart.v = {
                x: oldY,
                y: -oldX
            }
        } else if (crossingMode == 2) {
            // turn cart right
            // x,y -> -y,x
            cart.v = {
                x: -oldY,
                y: oldX
            }
        }
        cart.crossings++;
    }
}

const detectCollision = () => {
    carts.map((c1, i1) => {
        carts.map((c2, i2) => {
            if ((c1 != c2) && (c1.crashed !== true) && (c2.crashed !== true) ) {
                if ((c1.x == c2.x) && (c1.y == c2.y)) {
                    c1.crashed = true;
                    c2.crashed = true;
                    console.log('COLLISION AT', c1.x, c1.y, 'carts', c1, c2);
                    cameraTargets.push(c1.id, c2.id);
                }
            }
        })
    })
}

const moveCarts = () => {
    carts.sort((c1,c2) => {
        let s1 = c1.y*1000+c1.x;
        let s2 = c2.y*1000+c2.x;
        return s1-s2;
    }).map((cart, index) => {
        if (cart.crashed !== true) {
            moveCart(cart);
            detectCollision();
        }
    })
}

const tick = () => {
    ticks++;
    requestAnimationFrame(tick);
    if (ticks % steps == 0) moveCarts();
    drawScene();
    document.getElementById('cart_'+cameraTargets[cameraTargetId]).scrollIntoViewIfNeeded({behavior: 'smooth', inline: 'center', block: 'center'});
}

const solve = () => {
    while (carts.filter(c => c.crashed !== true).length > 1) moveCarts();
    let survivor = carts.filter(c => c.crashed !== true)[0];
    cameraTargets.push(survivor.id);
    console.log('game ended with 1 survivor', survivor);
}

//fetch('https://mazegame.org/adventofcode/2018/day13/input.txt')
fetch('./input.txt')
    .then(response => response.text())
    .then(text => run(text))

const run = input => {
    init(input);
    solve();

    init(input);
    setTimeout(() => tick(), 0)
}
