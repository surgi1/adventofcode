(function() {

    /*
    todos:
    - maybe make modal available to have arbitrary height?
    - maybe impose some code org?
    */

    const mapState = map => map.reduce((res, line) => res + line.join('').replace(/(#|\s)/g, ''), '')
    const eqVect = (a, b) => a && b && a.x == b.x && a.y == b.y;

    const charVal = {
        A: 0,
        B: 1,
        C: 2,
        D: 3
    };
    const solutionsCache = {};
    const solver = new Worker('./worker.js');

    const resources = {
        sprites: {
            url: './spritesheet.png'
        }
    };

    const storagePrefix = {
        SCORE: 'troopahs__best_cost_',
        LOWEST_REACHED: 'troopahs__lowest_reached_',
        CUSTOM_INPUTS: 'troopahs__custom_inputs_'
    }

    const dirs = [
        [0, 1],
        [0, -1],
        [-1, 0],
        [1, 0]
    ];
    const movementSpeed = 100; // ms

    let map, pods, moves, inputs, mapInitState, gui, renderer,
        difficulty = 1,
        inputId = 0,
        score = 0,
        frame = 0,
        drawing = false,
        animStartFrame = false,
        moveInProgress = false;

    const draw = () => {
        if (drawing) return;
        drawing = true;

        let mousePos = renderer.getMousePos();

        renderer.prepareFrame();

        // highlight active cell
        let hovered = pods.filter(p => eqVect(p, mousePos))?.[0],
            selected = pods.filter(p => p.highlighted)?.[0];

        if (map[mousePos.y] && !['#', ' ', undefined].includes(map[mousePos.y]?.[mousePos.x])) {
            let fillStyle = '#fff';
            if (!hovered && selected && !moves.some(m => eqVect(m, mousePos))) fillStyle = '#f00';
            renderer.rectOnPos(mousePos, fillStyle, 0.5);
        }

        pods.sort((a, b) => a.y - b.y).forEach((p, i) => renderer.drawPodSprite(p.type, p.highlighted, [p.x, p.y],
            [0, (animStartFrame !== false) && (animStartFrame + i > 0) ? 10*Math.sin(i + frame / 10) : 0]));

        Object.keys(charVal).forEach((v, i) => renderer.drawEmblemSprite(v, [3 + i*2, map.length - 1]));

        frame++;
        drawing = false;
    }

    const setScore = v => {
        score = v;
        gui.updateScore(score);
    }

    const restart = () => {
        animStartFrame = false;
        pods = [];

        let inputArr = inputs[inputId].split("\n");
        if (difficulty == 2) inputArr.splice(3, 0, '  #D#C#B#A#  ', '  #D#B#A#C#  ');

        map = inputArr.map((l, y) => l.split('').map((v, x) => {
            if (charVal[v] !== undefined) pods.push({
                type: v,
                x: x,
                y: y,
                highlighted: false
            })
            return v;
        }));

        mapInitState = mapState(map);

        if (!solutionsCache[mapInitState]) solver.postMessage(map.map(l => l.join('')).join("\n"));

        setScore(0);
        updateTopScore();

        renderer.setCanvasHeight(map.length);

        renderer.initPlanes(map);
    }

    const updateTopScore = () => gui.updateTopScore(
        localStorage.getItem(storagePrefix.SCORE + mapInitState),
        localStorage.getItem(storagePrefix.LOWEST_REACHED + mapInitState)
    );

    const distanceMap = (source, {x, y}) => {
        const canSpreadTo = (x, y) => map[y][x] == '.';
        const spread = (x, y, dist) => {
            if (canSpreadTo(x, y)) map[y][x] = dist;
            if (canSpreadTo(x - 1, y)) spread(x - 1, y, dist + 1);
            if (canSpreadTo(x + 1, y)) spread(x + 1, y, dist + 1);
            if (canSpreadTo(x, y - 1)) spread(x, y - 1, dist + 1);
            if (canSpreadTo(x, y + 1)) spread(x, y + 1, dist + 1);
        }
        let map = source.map(row => row.slice());
        spread(x, y, 0);
        return map;
    }

    const checkMapSolved = () => {
        const isSolved = map => mapState(map) === '.'.repeat(11) + Object.keys(charVal).join('').repeat(map.length - 3);

        if (!isSolved(map)) return;
        
        animStartFrame = frame;
        gui.showVictoryBox(score-solutionsCache[mapInitState]);

        let bestScore = localStorage.getItem(storagePrefix.SCORE + mapInitState);
        
        if (solutionsCache[mapInitState] == score) localStorage.setItem(storagePrefix.LOWEST_REACHED + mapInitState, 1);
        if (score <= bestScore || bestScore == undefined) localStorage.setItem(storagePrefix.SCORE + mapInitState, score);
        
        updateTopScore();
    }

    const moveStep = (p, target) => {
        moveInProgress = true;
        
        if (eqVect(p, target)) {
            p.highlighted = false;
            moveInProgress = false;
            checkMapSolved();
            return;
        }

        let dMapFromTarget = distanceMap(map, target);
        let move = dirs.filter(d => !isNaN(dMapFromTarget[p.y + d[1]][p.x + d[0]])).map(d => ({
            x: p.x + d[0],
            y: p.y + d[1]
        }))[0];

        map[p.y][p.x] = '.';
        p.x = move.x;
        p.y = move.y;
        map[p.y][p.x] = p.type;
        setScore(score + Math.pow(10, charVal[p.type]));

        setTimeout(() => moveStep(p, target), movementSpeed);
    }

    const nextMoves = (map, from) => {
        let v = map[from.y][from.x],
            vHomeX = charVal[v]*2 + 3;

        const adjacentToCaves = (x, y) => y == 1 && [3, 5, 7, 9].includes(x);
        const isSubjectsHouse = (x, y) => (y > 1) && (x == vHomeX);
        const subjectsHouseIsClean = () => {
            for (let y = 2; y < map.length - 1; y++)
                if (!['.', v].includes(map[y][vHomeX])) return false;
            return true;
        }

        let cleanHouse = subjectsHouseIsClean(),
            targets = [],
            dMap = distanceMap(map, from);

        for (let y = 1; y < map.length - 1; y++) {
            if (from.y == 1 && y == 1) continue; // once moved out of cave, has to move only to the cave ..
            for (let x = 1; x < map[0].length - 1; x++) {
                if (isNaN(dMap[y][x])) continue; // only reachable spots are considered
                if (y > 1 && !isSubjectsHouse(x, y)) continue; // targetting non-top row and other house
                if (y > 1 && isSubjectsHouse(x, y) && !cleanHouse) continue; // targetting non-top row and our dirty house
                if (isSubjectsHouse(from.x, from.y) && isSubjectsHouse(x, y)) continue;
                if (isSubjectsHouse(x, y) && cleanHouse) {
                    if (map[y + 1][x] != '#' && map[y + 1][x] != v) continue; // targetting its own house; a valid move is only to the lowest reachable
                };
                if (adjacentToCaves(x, y)) continue; // spots adjacent to caves are banned
                targets.push({
                    x: x,
                    y: y,
                    dist: dMap[y][x]
                })
            }
        }
        return targets;
    }

    const clickHandle = mousePos => {
        if (!map[mousePos.y] || ['#', ' ', undefined].includes(map[mousePos.y]?.[mousePos.x])) return;
        if (moveInProgress) return;

        let hovered = pods.filter(p => eqVect(p, mousePos))?.[0],
            selected = pods.filter(p => p.highlighted)?.[0];

        if (hovered) {
            if (eqVect(selected, mousePos)) {
                selected.highlighted = false;
                return;
            }
            pods.forEach(p => p.highlighted = false);
            hovered.highlighted = true;
            moves = nextMoves(map, hovered);
            return;
        }

        if (selected) {
            if (moves.some(m => eqVect(m, mousePos))) moveStep(selected, {...mousePos});
        }
    }

    const addCustomInput = literal => {
        let arr = literal.split("\n"),
            valid = (arr.length == 5) && Object.keys(charVal).every(k => (literal.match(new RegExp(k, 'g')) || []).length == 2);

        if (!valid) return;
        let customInputs = getCustomInputs();
        customInputs[mapState(arr.map(l => l.split('')))] = literal;
        localStorage.setItem(storagePrefix.CUSTOM_INPUTS, JSON.stringify(customInputs));
        initInputs();
        gui.renderMapsSwitch();
    }

    const getCustomInputs = () => JSON.parse(localStorage.getItem(storagePrefix.CUSTOM_INPUTS)) || {};

    const initInputs = () => inputs = [...baseInputs.slice(), ...Object.values(getCustomInputs())]

    const load = (run, resourcesLoaded = 0) => Object.values(resources).forEach(v => {
        v.data = new Image();
        v.data.onload = () => {
            if (++resourcesLoaded < Object.keys(resources).length) return;
            run();
        }
        v.data.src = v.url;
    })

    load(() => {
        solver.onmessage = e => solutionsCache[e.data[1]] = e.data[0];
        
        initInputs();

        gui = new Gui({
            restart: () => restart(),
            switchDifficulty: () => difficulty = (difficulty == 1 ? 2 : 1),
            getInputs: () => inputs,
            getInputId: () => inputId,
            setInputId: id => inputId = id % inputs.length,
            addCustomInput: s => addCustomInput(s),
        })

        renderer = new Renderer({
            resources: resources,
            action: {
                click: mousePos => clickHandle(mousePos)
            }
        });

        restart();
        setInterval(draw, 10);
    })

})();