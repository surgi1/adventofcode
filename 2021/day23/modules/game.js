import { nextMoves, charVal, distanceMap } from './gameLogic.js';
import { initGUI, showVictoryBox, updateTopScoreGUI, updateScore, renderMapsSwitch } from './gui.js';
import { initRender, getMousePos, rectOnPos, prepareFrame, initPlanes, drawPodSprite, drawEmblemSprite, setCanvasHeight } from './render.js';

const mapState = map => map.reduce((res, line) => res + line.join('').replace(/(#|\s)/g, ''), '')
const eqVect = (a, b) => a && b && a.x == b.x && a.y == b.y;

const solutionsCache = {};
const solver = new Worker('./worker.js');

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

let map, pods, moves, inputs, mapInitState,
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

    prepareFrame();

    let mousePos = getMousePos(),
        hovered = pods.filter(p => eqVect(p, mousePos))?.[0],
        selected = pods.filter(p => p.highlighted)?.[0];

    if (map[mousePos.y] && !['#', ' ', undefined].includes(map[mousePos.y]?.[mousePos.x])) {
        let fillStyle = '#fff';
        if (!hovered && selected && !moves.some(m => eqVect(m, mousePos))) fillStyle = '#f00';
        rectOnPos(mousePos, fillStyle, 0.5);
    }

    pods.sort((a, b) => a.y - b.y).forEach((p, i) => drawPodSprite(p.type, p.highlighted, [p.x, p.y],
        [0, (animStartFrame !== false) && (animStartFrame + i > 0) ? 10*Math.sin(i + frame / 10) : 0]));

    Object.keys(charVal).forEach((v, i) => drawEmblemSprite(v, [3 + i*2, map.length - 1]));

    frame++;
    drawing = false;
}

const setScore = v => {
    score = v;
    updateScore(score);
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

    setCanvasHeight(map.length);
    initPlanes(map);
}

const updateTopScore = () => updateTopScoreGUI(
    localStorage.getItem(storagePrefix.SCORE + mapInitState),
    localStorage.getItem(storagePrefix.LOWEST_REACHED + mapInitState)
);

const checkMapSolved = () => {
    const isSolved = map => mapState(map) === '.'.repeat(11) + Object.keys(charVal).join('').repeat(map.length - 3);

    if (!isSolved(map)) return;
    
    animStartFrame = frame;
    showVictoryBox(score-solutionsCache[mapInitState]);

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
    renderMapsSwitch();
}

const getCustomInputs = () => JSON.parse(localStorage.getItem(storagePrefix.CUSTOM_INPUTS)) || {};

const initInputs = () => inputs = [...baseInputs.slice(), ...Object.values(getCustomInputs())]

const switchDifficulty = () => difficulty = (difficulty == 1 ? 2 : 1);
const getInputs = () => inputs;
const getInputId = () => inputId;
const setInputId = id => inputId = id % inputs.length;

const init = () => {
    solver.onmessage = e => solutionsCache[e.data[1]] = e.data[0];
    initInputs();
    initGUI();
    initRender(() => {
        restart();
        setInterval(draw, 10);
    });
}

init();

export { switchDifficulty, restart, draw, clickHandle, addCustomInput, getInputs, getInputId, setInputId }