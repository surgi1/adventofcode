// astonishing visuals ;) slow this down on line 175 and enjoy some softcore ASCII-porn

String.prototype.replaceAt = function(index, replacement) {
    return this.substr(0, index) + replacement + this.substr(index + replacement.length);
}

let carts = [];

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

const initCarts = () => {
    data.map((line, index) => {
        for (let i=0;i<line.length;i++) {
            let chr = line[i];
            if (chr.match(/[\^><v]/g)) {
                let cart = {
                    x: i,
                    y: index,
                    crossings: 0,
                    v: cartVelocity(chr)
                }
                carts.push(cart);
            }
        }
        data[index] = line.replaceAll(">", "-").replaceAll("<", "-").replaceAll("^", "|").replaceAll("v", "|");
    })
}

initCarts();

const convertForDisplay = layout => {
    layout.map((line, index) => {
        layout[index] = line.replaceAll("I", "\\");
    })
    return layout;
}

const cartIcon = cart => {
    if (cart.v.x == 0 && cart.v.y == -1) return '^';
    if (cart.v.x == 0 && cart.v.y == 1) return 'v';
    if (cart.v.x == 1 && cart.v.y == 0) return '>';
    if (cart.v.x == -1 && cart.v.y == 0) return '<';
}

const drawCarts = (layout) => {
    carts.map((cart, index) => {
        if (cart.crashed !== true) {
            layout[cart.y] = layout[cart.y].replaceAt(cart.x, cartIcon(cart));
        }
    })
}

//console.log(data);

let rootEl = $('#root');
let preEl = $('<pre>');
rootEl.empty().append(preEl);

const drawScene = () => {
    let layout = $.extend(true, [], data);

    drawCarts(layout);    

    preEl.empty().append(convertForDisplay(layout).join("\n"));
}

const moveCart = (cart) => {
    cart.x = cart.x+cart.v.x;
    cart.y = cart.y+cart.v.y;

    // curves handling
    if (data[cart.y][cart.x] == 'I') {  // \
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

let interval = setInterval(() => {
    let nonCrashedCarts = 0;
    carts.map(c => {
        if (c.crashed !== true) nonCrashedCarts++;
    })
    if (nonCrashedCarts > 1) {
        moveCarts();
    } else {
        console.log('game ended with 1 survivor', carts);
        clearInterval(interval);
    }
    drawScene();
}, 5)

console.log('carts', carts);
