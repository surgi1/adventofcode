import * as game from './game.js';
import { id, all } from './baseDOM.js';
import { storagePrefix } from './prefix.js';

const switchDifficulty = () => {
    all('.mode').forEach(el => {
        el.classList.toggle('selected');
        el.classList.toggle('link');
    })
    game.switchDifficulty();
    game.restart();
}

const renderMapsSwitch = () => {
    id('maps').innerHTML = '';
    let self = this;
    game.getInputs().forEach((inp, i) => {
        let el = document.createElement('span');

        if (i == game.getInputId()) el.classList.add('selected');
        else el.classList.add('link');
        el.innerHTML = i + 1 + ' ';
        el.addEventListener('click', e => {
            game.setInputId(i);
            renderMapsSwitch();
            game.restart();
        })
        id('maps').appendChild(el);
    })
}

const updateScore = score => all('.currentscore').forEach(el => el.innerHTML = score);

const onResize = () => all('.message').forEach(el => el.style.left = Math.round((document.body.clientWidth - 380) / 2) + 'px');

const updateTopScore = mapInitState => {
    let best = localStorage.getItem(storagePrefix.SCORE + mapInitState),
        lowestReached =  localStorage.getItem(storagePrefix.LOWEST_REACHED + mapInitState);

    id('topscore').innerHTML = best != undefined ? (best + (lowestReached == 1 ? '*' : '')) : 'N/A';
}

const showVictoryBox = (distFromLowest, newBest = false) => {
    let title, msg;

    if (distFromLowest == 0) {
        title = 'CONGRATULATIONS!';
        msg = 'Lowest <img src="./resources/energyicon.png"> cost reached!';
    } else {
        title = newBest ? 'NEW RECORD!' : 'GOOD JOB!';
        msg = `You can save <b>${distFromLowest}</b><img src="./resources/energyicon.png"> more!`;
    }

    id('victory').innerHTML = title;
    id('candobetter').innerHTML = msg;
    id('message').classList.toggle('out');
}

const hideAllPopups = () => all('.message').forEach(el => el.classList.add('out'));

const init = () => {
    id('restart').addEventListener('click', e => {
        game.restart();
    });
    id('tryagain').addEventListener('click', e => {
        id('message').classList.toggle('out');
        game.restart();
    });
    id('nextmap').addEventListener('click', e => {
        game.setInputId(game.getInputId()+1);
        id('message').classList.toggle('out');
        renderMapsSwitch();
        game.restart();
    });
    all('.mode').forEach(el => el.addEventListener('click', e => switchDifficulty()));

    id('openloadbox').addEventListener('click', e => id('loadbox').classList.toggle('out'));
    id('load').addEventListener('click', e => {
        game.addCustomInput(id('custom').value.trim());
        id('loadbox').classList.toggle('out');
    });
    id('closeloadbox').addEventListener('click', e => id('loadbox').classList.toggle('out'));

    id('openinstructions').addEventListener('click', e => id('instructions').classList.toggle('out'));
    id('closeinstructions').addEventListener('click', e => id('instructions').classList.toggle('out'));

    id('sound_switch').addEventListener('click', e => {
        id('sound_switch').classList.toggle('off');
        game.toggleSound();
    });

    renderMapsSwitch();

    addEventListener("resize", e => onResize());
    onResize();
}

export { init, showVictoryBox, updateTopScore, updateScore, renderMapsSwitch, hideAllPopups }