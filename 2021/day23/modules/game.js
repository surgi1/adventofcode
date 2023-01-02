import { nextMoves, charVal, distanceMap } from './gameLogic.js';
import * as gui from './gui.js';
import * as renderer from './render.js';
import { storagePrefix } from './prefix.js';
import { eqVect } from './vect.js';

const solutionsCache = {};
const solver = new Worker('./worker.js');

let stepSoundEffect = new Audio('./resources/steps.mp3');
let applauses = [
    new Audio('./resources/bigApplause.mp3'),
    new Audio('./resources/applause.mp3')
]

const dirs = [
    [0, 1],
    [0, -1],
    [-1, 0],
    [1, 0]
];
const movementSpeed = 100; // ms

let map, pods, moves, inputs, mapInitState,
    difficulty = 1,
    playSound = true,
    inputId = 0,
    score = 0,
    moveInProgress = false;

const draw = () => renderer.render(pods, map, moves)

const setScore = v => {
    score = v;
    gui.updateScore(score);
}

const mapState = map => map.reduce((res, line) => res + line.join('').replace(/(#|\s)/g, ''), '')

const restart = () => {
    renderer.animationStop();
    gui.hideAllPopups();
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

    let bestScore = localStorage.getItem(storagePrefix.SCORE + mapInitState);
        
    renderer.animationStart();
    gui.showVictoryBox(score-solutionsCache[mapInitState], score < bestScore || bestScore == undefined);

    if (playSound) applauses[Math.sign(score-solutionsCache[mapInitState])].play();

    if (solutionsCache[mapInitState] == score) localStorage.setItem(storagePrefix.LOWEST_REACHED + mapInitState, 1);
    if (score < bestScore || bestScore == undefined) localStorage.setItem(storagePrefix.SCORE + mapInitState, score);
    
    gui.updateTopScore(mapInitState);
}

const moveStep = (p, target) => {
    moveInProgress = true;
    
    if (eqVect(p, target)) {
        p.highlighted = false;
        moveInProgress = false;
        checkMapSolved();
        stepSoundEffect.pause();
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
        if (moves.some(m => eqVect(m, mousePos))) {
            if (playSound) stepSoundEffect.play();
            moveStep(selected, {...mousePos});
        }
    }
}

const switchDifficulty = () => difficulty = (difficulty == 1 ? 2 : 1);
const toggleSound = () => playSound = !playSound;

const initSound = () => {
    stepSoundEffect.playbackRate = 4;
    stepSoundEffect.loop = true;
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
const getInputs = () => inputs;
const getInputId = () => inputId;
const setInputId = id => inputId = id % inputs.length;

const init = () => {
    solver.onmessage = e => solutionsCache[e.data[1]] = e.data[0];
    initInputs();
    gui.init();
    initSound();
    renderer.init(() => {
        restart();
        setInterval(draw, 10);
    });
}

init();

export { switchDifficulty, restart, clickHandle, addCustomInput, getInputs, getInputId, setInputId, toggleSound }