import { switchDifficulty, restart, addCustomInput, getInputs, getInputId, setInputId } from './game.js';
import { id, all } from './baseDOM.js';

const switchDifficultyGUI = () => {
    all('.mode').forEach(el => {
        el.classList.toggle('selected');
        el.classList.toggle('link');
    })
    switchDifficulty();
    restart();
}

const renderMapsSwitch = () => {
    id('maps').innerHTML = '';
    let self = this;
    getInputs().forEach((inp, i) => {
        let el = document.createElement('span');

        if (i == getInputId()) el.classList.add('selected');
        else el.classList.add('link');
        el.innerHTML = i + 1 + ' ';
        el.addEventListener('click', e => {
            setInputId(i);
            renderMapsSwitch();
            restart();
        })
        id('maps').appendChild(el);
    })
}

const updateScore = score => all('.currentscore').forEach(el => el.innerHTML = score);

const updateTopScoreGUI = (best, lowestReached) => id('topscore').innerHTML = best != undefined ? (best + (lowestReached == 1 ? '*' : '')) : 'N/A';

const onResize = () => all('.message').forEach(el => el.style.left = Math.round((document.body.clientWidth - 380) / 2) + 'px');

const showVictoryBox = distFromLowest => {
    let title, msg;

    if (distFromLowest == 0) {
        title = 'CONGRATULATIONS!';
        msg = 'Lowest <img src="energyicon.png"> cost reached!';
    } else {
        title = 'GOOD JOB!';
        msg = `You can save <b>${distFromLowest}</b> more <img src="energyicon.png">!`;
    }

    id('victory').innerHTML = title;
    id('candobetter').innerHTML = msg;
    id('message').classList.toggle('out');
}

const initGUI = () => {
    id('restart').addEventListener('click', e => restart());
    id('tryagain').addEventListener('click', e => {
        id('message').classList.toggle('out');
        restart();
    });
    id('nextmap').addEventListener('click', e => {
        setInputId(getInputId()+1);
        id('message').classList.toggle('out');
        renderMapsSwitch();
        restart();
    });
    all('.mode').forEach(el => el.addEventListener('click', e => switchDifficultyGUI()));

    id('openloadbox').addEventListener('click', e => id('loadbox').classList.toggle('out'));
    id('load').addEventListener('click', e => {
        addCustomInput(id('custom').value);
        id('loadbox').classList.toggle('out');
    });
    id('closeloadbox').addEventListener('click', e => id('loadbox').classList.toggle('out'));

    id('openinstructions').addEventListener('click', e => id('instructions').classList.toggle('out'));
    id('closeinstructions').addEventListener('click', e => id('instructions').classList.toggle('out'));

    renderMapsSwitch();

    addEventListener("resize", e => onResize());
    onResize();
}

export { initGUI, showVictoryBox, updateTopScoreGUI, updateScore, switchDifficultyGUI, renderMapsSwitch, id, all }