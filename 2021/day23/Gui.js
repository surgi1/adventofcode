id = k => document.getElementById(k);
all = k => document.querySelectorAll(k);

class Gui {
    constructor(action = {}) {
        this.action = action;
        this.init();
        return this;
    }

    switchDifficulty = () => {
        all('.mode').forEach(el => {
            el.classList.toggle('selected');
            el.classList.toggle('link');
        })
        this.action.switchDifficulty();
        this.action.restart();
    }

    renderMapsSwitch = () => {
        id('maps').innerHTML = '';
        let self = this;
        this.action.getInputs().forEach((inp, i) => {
            let el = document.createElement('span');

            if (i == self.action.getInputId()) el.classList.add('selected');
            else el.classList.add('link');
            el.innerHTML = i + 1 + ' ';
            el.addEventListener('click', e => {
                self.action.setInputId(i);
                self.renderMapsSwitch();
                self.action.restart();
            })
            id('maps').appendChild(el);
        })
    }

    updateScore = score => all('.currentscore').forEach(el => el.innerHTML = score);

    updateTopScore = (best, lowestReached) => id('topscore').innerHTML = best != undefined ? (best + (lowestReached == 1 ? '*' : '')) : 'N/A';

    onResize = () => all('.message').forEach(el => el.style.left = Math.round((document.body.clientWidth - 380) / 2) + 'px');

    showVictoryBox = distFromLowest => {
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

    init = () => {
        let self = this;
        id('restart').addEventListener('click', e => self.action.restart());
        id('tryagain').addEventListener('click', e => {
            id('message').classList.toggle('out');
            self.action.restart();
        });
        id('nextmap').addEventListener('click', e => {
            self.action.setInputId(self.action.getInputId()+1);
            id('message').classList.toggle('out');
            self.renderMapsSwitch();
            self.action.restart();
        });
        all('.mode').forEach(el => el.addEventListener('click', e => self.switchDifficulty()));

        id('openloadbox').addEventListener('click', e => id('loadbox').classList.toggle('out'));
        id('load').addEventListener('click', e => {
            self.action.addCustomInput(id('custom').value);
            id('loadbox').classList.toggle('out');
        });
        id('closeloadbox').addEventListener('click', e => id('loadbox').classList.toggle('out'));

        id('openinstructions').addEventListener('click', e => id('instructions').classList.toggle('out'));
        id('closeinstructions').addEventListener('click', e => id('instructions').classList.toggle('out'));

        self.renderMapsSwitch();

        addEventListener("resize", e => self.onResize());
        self.onResize();
    }
}