// Solved with good old brute force.

let stack = []; // begining of turn effects stack, ex. {turn: 123, effect: () => {player.mana += 120;}}
let verboseBattle = false, lowestManaSpentOnWin = 9001, variant = 0,
    applyCurse = false; // part 2 setting

let playerBase = {
    mana: 500,
    hp: 50,
    armor: 0,
    manaSpent: 0,
    spellChain: [],
    fizzled: false,
    spells: [
        {name: 'Magic Missile', cost: 53, lasting: 0, effect: (turn) => {boss.hp -= 4;}},
        {name: 'Drain', cost: 73, lasting: 0, effect: (turn) => {boss.hp -= 2; player.hp += 2;}},
        {name: 'Shield', cost: 113, lasting: 6, effect: (turn) => {
            player.armor += 7;
            stack.push({
                turn: turn+7,
                effect: () => {player.armor -= 7;}
            })
        }},
        {name: 'Poison', cost: 173, lasting: 6, effect: (turn) => {
            for (let i=1; i<=6; i++) stack.push({
                turn: turn+i,
                effect: () => {
                    if (verboseBattle) console.log('Poison effect applied.');
                    boss.hp -= 3;
                }
            })
        }},
        {name: 'Recharge', cost: 229, lasting: 5, effect: (turn) => {
            for (let i=1; i<=5; i++) stack.push({
                turn: turn+i,
                effect: () => {
                    if (verboseBattle) console.log('Recharge effect applied.');
                    player.mana += 101;
                }
            })
        }}
    ],
    cast: (spellIdentifier, turn) => {
        let spell;
        if (isNaN(spellIdentifier)) {
            spell = player.spells.filter(s => s.name == spellIdentifier)[0];
        } else {
            spell = player.spells[spellIdentifier];
        }

        let effectAlreadyActive = false;

        if (spell.lasting !== 0) {
            let lastSpellIndex = player.spellChain.lastIndexOf(spell.name);
            if (lastSpellIndex > -1) {
                if ((player.spellChain.length - lastSpellIndex)*2 < spell.lasting) effectAlreadyActive = true;
            }
        }

        if (effectAlreadyActive) {
           if (verboseBattle) console.log('Effect already active', spell.name, '!');
           player.spellChain.push('CANNOT CAST; EFFECT ACTIVE '+spell.name);
           player.fizzled = true;
           return false;
       } else if (player.mana >= spell.cost) {
            if (verboseBattle) console.log('Player casts', spell.name, '.');
            player.mana -= spell.cost;
            player.manaSpent += spell.cost;
            spell.effect(turn);
            player.spellChain.push(spell.name);
        } else {
            if (verboseBattle) console.log('Not enough mana to cast', spell.name, '!');
            player.spellChain.push('FIZZLED '+spell.name);
            player.fizzled = true;
            return false;
        }
        return true;
    }
}

let bossBase = {
    hp: 51,
    dmg: 9,
    armor: 0,
    attack: () => {
        let attackPower = boss.dmg-player.armor;
        if (attackPower < 1) attackPower = 1;
        if (verboseBattle) console.log('Boss attacks for', attackPower);
        player.hp -= attackPower;
    }
}

let player = {...playerBase};
let boss = {...bossBase};

const beginTurn = turn => {
    if (verboseBattle) console.log('****************************************************');
    if (verboseBattle) console.log('Turn', turn, 'has began!');
}

const handleStack = turn => stack.filter(s => s.turn == turn).map(s => s.effect())

const checkStatus = noStats => {
    if (verboseBattle) {
        if (noStats !== true) console.log('Stats', 'Player', {...player});
        if (noStats !== true) console.log('Stats', 'Boss', {...boss});
    }
    if (boss.hp <= 0) {
        if (verboseBattle) console.log('Boss is dead');
        return false;
    }
    if (player.hp <= 0) {
        if (verboseBattle) console.log('Player is dead');
        return false;
    }
    return true;
}

const battle = (playerStrategy, setVerboseTo, applyCurse) => {
    verboseBattle = setVerboseTo;

    // reset
    player = {...playerBase, spellChain: []};
    boss = {...bossBase};
    stack = [];
    if (verboseBattle) {
        console.log('****************************************************');
        console.log('***************** NEW BATTLE ***********************');
        console.log('****************************************************');
    }

    let turn = 0;
    checkStatus();
    turn++;

    while (true) {
        // player turn
        beginTurn(turn);
        if (applyCurse) {
            player.hp -= 1;
            if (verboseBattle) console.log('Curse applied.')
            if (checkStatus(true) === false) break;
        }
        handleStack(turn);
        if (player.cast(playerStrategy(turn), turn) === false) break;
        if (checkStatus() === false) break;
        turn++;
        
        // boss turn
        beginTurn(turn);
        handleStack(turn);
        boss.attack();
        if (checkStatus() === false) break;
        turn++;
    }

    if ((boss.hp <= 0) && (!player.fizzled)) {
        if (lowestManaSpentOnWin > player.manaSpent) {
            lowestManaSpentOnWin = player.manaSpent;
            console.log('Stats', 'Player', {...player});
            console.log('Stats', 'Boss', {...boss});
        }
    }

}

const playBattle = (chain, applyCurse) => battle(turn => chain[(turn-1)/2], true, applyCurse);

const solve = () => {
    while (true) {
        let s = variant.toString(5).padStart(25, '0');

        battle(turn => parseInt(s[24-(turn-1)/2]), false, applyCurse);

        variant++;
        if (variant % 100000 == 0) console.log('Checked', variant, 'possible realities. Lowest mana needed to win is so far', lowestManaSpentOnWin, '. Last used spellchain', s);
        if (variant % 100000 == 0) break;
    }

    console.log('Finished cycle. Checked', variant, 'possible realities. Lowest mana needed to win is', lowestManaSpentOnWin);
}

solve(); // comment this out to replay battles using playBattle()
