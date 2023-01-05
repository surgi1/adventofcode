const moves = {
    '<': [-1, 0],
    '^': [0, -1],
    'wait': [0, 0],
    '>': [1, 0],
    'v': [0, 1]
}
const elfSpriteIds = {
    '^': 0,
    '<': 1,
    'v': 2,
    'wait': 2,
    '>': 3
}

const ACTION = {
    WALK: 0,
    SPELLCAST: 1,
    HURT: 2,
}

const keyMap = {
    ArrowLeft: '<',
    ArrowRight: '>',
    ArrowUp: '^',
    ArrowDown: 'v',
    KeyA: '<',
    KeyD: '>',
    KeyW: '^',
    KeyS: 'v',
    Space: ACTION.SPELLCAST,
    KeyQ: ACTION.HURT
};

const gruesCount = 5;
const mapSize = 50;

let map = [], graves = [], grues = [], dirs = Object.values(moves), movesEntries = Object.entries(moves),
    autoRun = false, elf = {}, start, end,
    canvas = document.getElementById('canvas'), ctx = canvas.getContext('2d'),
    drawing = false, frame = 0, keysPressed = {},
    actionParams = [{
        name: 'walk',
        frames: 8,
        speed: 0.25
    }, {
        name: 'spellcast',
        frames: 6,
        speed: 0.05,
        mustFinish: true
    }, {
        name: 'hurt',
        frames: 5,
        speed: 0.05,
        mustFinish: true,
        oneD: true
    }],
    resources = {
        human: {actionable: true, url: 'BODY_male.png'},
        skeleton: {actionable: true, url: 'BODY_skeleton.png'},
        hood: {actionable: true, url: 'HEAD_robe_hood.png'},
        hood_chain: {actionable: true, url: 'HEAD_chain_armor_hood.png'},
        hair: {actionable: true, url: 'HEAD_hair_blonde.png'},
        hat: {actionable: true, url: 'HEAD_leather_armor_hat.png'},
        helm_chain: {actionable: true, url: 'HEAD_chain_armor_helmet.png'},
        helm_plate: {actionable: true, url: 'HEAD_plate_armor_helmet.png'},
        torso_robe: {actionable: true, url: 'TORSO_robe_shirt_brown.png'},
        torso_plate: {actionable: true, url: 'TORSO_plate_armor_torso.png'},
        torso_leather: {actionable: true, url: 'TORSO_leather_armor_torso.png'},
        torso_chain: {actionable: true, url: 'TORSO_chain_armor_torso.png'},
        torso_purple_jacket: {actionable: true, url: 'TORSO_chain_armor_jacket_purple.png'},
        torso_shirt: {actionable: true, url: 'TORSO_leather_armor_shirt_white.png'},
        shoulders_plate: {actionable: true, url: 'TORSO_plate_armor_arms_shoulders.png'},
        shoulders_leather: {actionable: true, url: 'TORSO_leather_armor_shoulders.png'},
        bracers: {actionable: true, url: 'TORSO_leather_armor_bracers.png'},
        legs_robe: {actionable: true, url: 'LEGS_robe_skirt.png'},
        legs_leather: {actionable: true, url: 'LEGS_pants_greenish.png'},
        legs_plate: {actionable: true, url: 'LEGS_plate_armor_pants.png'},
        gloves_plate: {actionable: true, url: 'HANDS_plate_armor_gloves.png'},
        shoes: {actionable: true, url: 'FEET_shoes_brown.png'},
        shoes_plate: {actionable: true, url: 'FEET_plate_armor_shoes.png'},
        belt: {actionable: true, url: 'BELT_leather.png'},
        belt_rope: {actionable: true, url: 'BELT_rope.png'},

        grue: {url: './resources/Grue.png'},
        sprites: {url: './resources/spritesheet.png'},
        terrain: {url: './resources/terrain_3.png'}
    };

// idea: skeletons (maybe resurrected from the grave?) that would attract the grues in the area

const drawPlayer = (spriteId, [_x, _y]) => {
    let x = _x - 32, y = _y - 32;
    let animId = elf.animationId === false ? ACTION.WALK : elf.animationId;

    ctx.drawImage(resources.human.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.hair.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);

    ctx.drawImage(resources.shoes.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.legs_leather.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);

    ctx.drawImage(resources.torso_chain.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    //ctx.drawImage(resources.torso_purple_jacket.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.shoulders_plate.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.belt.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);



    // full metal
/*    ctx.drawImage(resources.human.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.helm_plate.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.shoes_plate.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.legs_plate.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.torso_plate.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.shoulders_plate.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);
    ctx.drawImage(resources.gloves_plate.action[animId].data, spriteId[0]*64, spriteId[1]*64, 64, 64, x, y, 64, 64);*/


}

const drawElf = () => {
    let animId = elf.animationId === false ? ACTION.WALK : elf.animationId;
    let actParams = actionParams[animId];
    //drawElfSprite([elf.action == 'wait' ? 0 : Math.round(frame/4) % 8, elf.spriteId], [elf.x, elf.y]);
    drawPlayer([(elf.action == 'wait' && animId == ACTION.WALK) ? 0 : 1+Math.floor((frame-elf.animationStart)*actParams.speed) % actParams.frames, actParams.oneD ? 0 : elf.spriteId], [elf.x, elf.y]);

    if (elf.animationId !== false && ( 1+Math.round((frame-elf.animationStart)*actParams.speed) ) > actParams.frames ) {
        elf.animationId = false;
    }
    
    // scroll page into elf view, update hp
    const params = {behavior: 'smooth', inline: 'center', block: 'center'};
    let el = document.getElementById('elf');
    el.style.left = (elf.x - 128)+'px';
    el.style.top = (elf.y - 90)+'px';
    el.innerHTML = '❤'+elf.hp;//❤★
    if (el.scrollIntoViewIfNeeded) el.scrollIntoViewIfNeeded(params); else el.scrollIntoView(params);
}

const createPlane = src => {
    let e = document.createElement('canvas');
    e.width = src.width;
    e.height = src.height;
    return e;
}

const drawTerrainSprite = (ctx, spriteId, [x, y]) => ctx.drawImage(resources.terrain.data, spriteId[0]*32, spriteId[1]*32, 32, 32, x*32, y*32, 32, 32);

const gmap = (y, x) => {
    if (x >= 0 && y >= 0 && x < map[0].length && y < map.length) return map[y][x];
    return '#'; // outside the map are only walls
}

const initPlanes = () => {
    canvas.planes = {
        walls: createPlane(canvas),
        ground: createPlane(canvas)
    };
    
    for (let y = 0; y < map.length; y++) for (let x = 0; x < map[0].length; x++) {
        let v = map[y][x];
        // allways draw ground
        drawTerrainSprite(canvas.planes.ground.getContext('2d'), [ Math.random() < 0.05 ? 28 : 24+((x*y) % 4), 18], [x, y]);

        if (v == '#') {
            let mat = [6, 0]; // coordinates of the material in the terrain png; x, y
            let pos = [0, 0]; // sprite position relative to the material; x, y

            if (x > 0 && y > 0 && x < map[0].length-1 && y < map.length-1) mat = [5, 0]; // inner wall material

            if (![gmap(y-1, x-1), gmap(y-1, x), gmap(y-1, x+1), gmap(y, x-1), gmap(y, x+1), gmap(y+1, x-1), gmap(y+1, x), gmap(y+1, x+1)].includes('#')) {
                // sole hole
                drawTerrainSprite(canvas.planes.walls.getContext('2d'), [mat[0]*3, Math.round(mat[1]*6+Math.random())], [x, y]);
            } else {

                if (gmap(y-1, x) != '#') pos[1] = 2;
                else if (gmap(y+1, x) != '#') pos[1] = 4;
                else pos[1] = 3;

                if (gmap(y, x-1) != '#') pos[0] = 0;
                else if (gmap(y, x+1) != '#') pos[0] = 2;
                else pos[0] = 1;

                if (pos[0] == 1 && pos[1] == 3) {
                    // this might be a middle sprite
                    if (gmap(y-1, x-1) != '#') pos = [2, 1];
                    else if (gmap(y-1, x+1) != '#') pos = [1, 1];
                    else if (gmap(y+1, x-1) != '#') pos = [2, 0];
                    else if (gmap(y+1, x+1) != '#') pos = [1, 0];
                    else {
                        // it is a middle sprite
                        if (Math.random() < 0.2) {
                            drawTerrainSprite(canvas.planes.walls.getContext('2d'), [mat[0]*3+pos[0], mat[1]*6+pos[1]], [x, y]);
                            pos = [Math.floor(3*Math.random()), 5]; // extra graphics for breaking the still
                        }
                    }
                }

                drawTerrainSprite(canvas.planes.walls.getContext('2d'), [mat[0]*3+pos[0], mat[1]*6+pos[1]], [x, y]);
            }
        } else {
            // randoms
            if (Math.random() < 0.005)
                drawTerrainSprite(canvas.planes.ground.getContext('2d'), [30, 15], [x, y]);
            if (Math.random() < 0.01)
                drawTerrainSprite(canvas.planes.ground.getContext('2d'), [22, 5], [x, y]);
        }
    }
}

const advanceBlizzards = blizs => blizs.map(b => {
    b.x += moves[b.t][0];
    b.y += moves[b.t][1];
    if (b.y < -32) b.y = map.length*32;
    if (b.x < -32) b.x = map[0].length*32;
    if (b.y > map.length*32) b.y = -32;
    if (b.x > map[0].length*32) b.x = -32;
    return b;
})

const drawSprite = (spriteId, [x, y]) => ctx.drawImage(resources.sprites.data, spriteId*32, 0, 32, 32, x, y, 32, 32);
//const drawElfSprite = (spriteId, [x, y]) => ctx.drawImage(resources.elfSprites.data, spriteId[0]*24, spriteId[1]*32, 24, 32, x+4, y, 24, 32);

const drawBlizzards = () => {
    blizs.forEach(b => {
        let spriteId = '<^v>'.indexOf(b.t);
        drawSprite(spriteId, [b.x, b.y]);
    })
}

const drawGrue = (spriteId, [x, y]) => ctx.drawImage(resources.grue.data, spriteId*57, 0, 57, 71, x-28, y-35, 57, 71);

const drawGrues = animFrame => {
    ctx.save();
    ctx.globalAlpha = 0.6;
    grues.forEach(g => {
        let spriteId = '>^<v'.indexOf(g.t[0]);
        if (spriteId == -1) spriteId = 3;
        drawGrue(spriteId, [g.x, g.y]);
    })
    ctx.restore();
}

const determineGrueAction = ({x, y, t}, blzs) => {
    let moves = [];
    if (Math.abs(elf.x-x)+Math.abs(elf.y-y) < 1000) {
        if (Math.abs(elf.x-x) > 5) moves.push(elf.x > x ? '>' : '<');
        if (Math.abs(elf.y-y) > 5) moves.push(elf.y > y ? 'v' : '^');
    } else {
        if (frame % 64 == Math.floor(32*Math.random())) moves = ['<>^v'.charAt(Math.floor(4*Math.random()))];
        else moves = t;
    }

    if (x < 32) moves = ['>'];
    if (y < 32) moves = ['v'];
    if (y > 32*(map.length-2)) moves = ['^'];
    if (x > 32*(map[0].length-2)) moves = ['<'];

    if (blzs.length > 0) {
        if (blzs.filter(b => b.t == moves[0]).length > 0) return [moves[0]];
        if (moves[1] && blzs.filter(b => b.t == moves[1]).length > 0) return [moves[1]];
        return [blzs[Math.floor(blzs.length*Math.random())].t];
    }

    if (moves.length == 0) moves = ['wait'];

    return moves;
}

const draw = () => {
    if (drawing) return;
    drawing = true;

    blizs = advanceBlizzards(blizs);

    grues.forEach(g => {
        let move = [0, 0];
        g.t.forEach(k => {
            move[0] += moves[k][0];
            move[1] += moves[k][1];
        })
        let moveNorm = Math.sqrt(move[0]*move[0]+move[1]*move[1]);

        if (moveNorm > 0) {
            move[0] = 1.5*move[0]/moveNorm;
            move[1] = 1.5*move[1]/moveNorm;
        }

        g.x += move[0];
        g.y += move[1];

        let blzs = blizs.filter(b => Math.abs(b.x+16-(g.x+28)) <= 28 && Math.abs(b.y+16-(g.y+35)) <= 35);
        g.t = determineGrueAction(g, blzs);
        if (Math.abs(elf.x-g.x)+Math.abs(elf.y-g.y) <= 12) if (frame % 10 == 0) elf.hp -= 1;
    })

    if ((elf.y < 32 || elf.y > 32*(map.length-1)) && elf.hp < 100) if (frame % 3 == 0) elf.hp++;
    
    if (elf.hp <= 0) {
        elf.hp = 0;
        if (elf.animationId !== ACTION.HURT && !elf.dying) {
            elf.dying = true;
            elf.animationId = ACTION.HURT;
            elf.animationStart = frame;
        }
        if (elf.animationId === false && elf.dying) {
            graves.push({...elf})
            restart();
        }
    }

    if (elf.animationId == ACTION.SPELLCAST && frame-elf.animationStart == 50) {
        blizs.push({x: elf.x-16, y: elf.y, t: '>'});
        blizs.push({x: elf.x-16, y: elf.y, t: '<'});
        blizs.push({x: elf.x-16, y: elf.y, t: '^'});
        blizs.push({x: elf.x-16, y: elf.y, t: 'v'});
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear
    ctx.drawImage(canvas.planes.ground, 0, 0);
    ctx.drawImage(canvas.planes.walls, 0, 0);
    graves.forEach(g => drawSprite(5, [g.x, g.y]));
    drawElf();
    drawBlizzards();
    drawGrues();

    // apply controls
    let keys = Object.entries(keysPressed).filter(([k, v]) => v === true);
    if (keys.length > 0) {
        let v = keyMap[keys[0][0]];

        if (!isNaN(v)) {
            if (elf.animationId === false || actionParams[elf.animationId].mustFinish !== true) {
                elf.animationId = v;
                elf.animationStart = frame;
            }
        } else if (elf.animationId === false) {
            // move
            let move = [0, 0];
            keys.forEach(k => {
                let w = keyMap[k[0]];
                if (actionParams[w]) return true;
                move[0] += moves[w][0];
                move[1] += moves[w][1];
            })
            let moveNorm = Math.sqrt(move[0]*move[0]+move[1]*move[1]);
            move[0] = 1.3*move[0]/moveNorm;
            move[1] = 1.3*move[1]/moveNorm;

            elf.spriteId = elfSpriteIds[v];
            let mapY = Math.round((elf.y+move[1])/32),
                mapX = Math.round((elf.x+move[0])/32),
                mapYo = Math.round(elf.y/32),
                mapXo = Math.round(elf.x/32);

            if (gmap(mapYo, mapX) != '#') {
                elf.x += move[0];
                elf.action = v;
            }
            if (gmap(mapY, mapXo) != '#') {
                elf.y += move[1];
                elf.action = v;
            }
        }

    } else elf.action = 'wait'; // idle

    frame++;
    drawing = false;
}

const restart = () => {
    map = inputGame.split("\n").map(l => [...l.split('').slice(0, mapSize-2), ...l.split('').slice(-2)]);
    start = {x: map[0].indexOf('.'), y: 0};
    end = {x: map[map.length-1].indexOf('.'), y: map.length-1};
    elf = {x: 32+start.x*32, y: 32+start.y*32, spriteId: 2, action: 'wait', animationId: ACTION.SPELLCAST, animationStart: frame, hp: 100}
    blizs = [];
    map.forEach((row, y) => row.forEach((v, x) => {
        if ('<>^v'.indexOf(v) == -1) return true;
        if ((x*y) % 50 == Math.floor(50*Math.random())) blizs.push({x:x*32, y:y*32, t:v});
    }));

    grues = [];
    for (let i = 0; i < gruesCount; i++) grues.push({
        x: Math.floor(32*map[0].length*Math.random()),
        y: Math.floor(32*map.length*Math.random()),
        t: ['v']
    })
}

const initUI = () => {
    window.addEventListener('keyup', e => {
        if (keyMap[e.code] !== undefined) keysPressed[e.code] = false;
    });
    window.addEventListener('keydown', e => {
        if (keyMap[e.code] !== undefined) {
            keysPressed[e.code] = true;
            e.preventDefault();
        }
    });
}

let totalResources = Object.keys(resources).length + Object.values(resources).filter(r => r.actionable === true).length*(actionParams.length-1);

const load = (run, resourcesLoaded = 0) => Object.values(resources).forEach(v => {
    const onload = () => {
        if (++resourcesLoaded < totalResources) return;
        run();
    }
    if (v.actionable === true) {
        v.action = [];
        actionParams.forEach(action => {
            let tmp = {};
            tmp.data = new Image();
            tmp.data.onload = onload;
            tmp.data.src = './resources/'+action.name+'/'+v.url;
            v.action.push(tmp);
        })
    } else {
        v.data = new Image();
        v.data.onload = onload;
        v.data.src = v.url;
    }
});

load(() => {
    restart();
    initUI();
    initPlanes();
    setInterval(draw, 10);
})