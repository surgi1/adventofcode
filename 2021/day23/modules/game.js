import { nextMoves, charVal, distanceMap } from './gameLogic.js';
import * as gui from './gui.js';
import * as renderer from './render.js';
import { storagePrefix } from './prefix.js';
import { eqVect } from './vect.js';

const solutionsCache = {};
const solver = new Worker('./worker.js');

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

    renderer.render(pods, animStartFrame, frame, map, moves);

    frame++;
    drawing = false;
}

const setScore = v => {
    score = v;
    gui.updateScore(score);
}

const mapState = map => map.reduce((res, line) => res + line.join('').replace(/(#|\s)/g, ''), '')

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
    gui.updateTopScore(mapInitState);

    renderer.initPlanes(map);
}

const checkMapSolved = () => {
    const isSolved = map => mapState(map) === '.'.repeat(11) + Object.keys(charVal).join('').repeat(map.length - 3);

    if (!isSolved(map)) return;
    
    animStartFrame = frame;
    gui.showVictoryBox(score-solutionsCache[mapInitState]);

    let bestScore = localStorage.getItem(storagePrefix.SCORE + mapInitState);
    
    if (solutionsCache[mapInitState] == score) localStorage.setItem(storagePrefix.LOWEST_REACHED + mapInitState, 1);
    if (score <= bestScore || bestScore == undefined) localStorage.setItem(storagePrefix.SCORE + mapInitState, score);
    
    gui.updateTopScore(mapInitState);
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
    gui.renderMapsSwitch();
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
    gui.init();
    renderer.init(() => {
        restart();
        setInterval(draw, 10);
    });
}

init();

export { switchDifficulty, restart, clickHandle, addCustomInput, getInputs, getInputId, setInputId }