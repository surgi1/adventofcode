// This is one of my most loved puzzles from whole AOC.
// Despite the AOC site not validating solutions correctly - see comments at the bottom of this file.

var stack = []; // begining of turn effects stack, ex. {turn: 123, effect: () => {player.mana += 120;}}
var verboseBattle = true;

var playerBase = {
    mana: 500,
    hp: 50,
    armor: 0,
    manaSpent: 0,
    spellChain: [],
    fizzled: false,
    spells: [
        {name: 'Magic Missile', cost: 53, effect: (turn) => {boss.hp -= 4;}},
        {name: 'Drain', cost: 73, effect: (turn) => {boss.hp -= 2; player.hp += 2;}},
        {name: 'Shield', cost: 113, effect: (turn) => {
            player.armor += 7;
            stack.push({
                turn: turn+7,
                effect: () => {player.armor -= 7;}
            })
        }},
        {name: 'Poison', cost: 173, effect: (turn) => {
            for (var i=1; i<=6; i++) stack.push({
                turn: turn+i,
                effect: () => {
                    if (verboseBattle) console.log('Poison effect applied.');
                    boss.hp -= 3;
                }
            })
        }},
        {name: 'Recharge', cost: 229, effect: (turn) => {
            for (var i=1; i<=5; i++) stack.push({
                turn: turn+i,
                effect: () => {
                    if (verboseBattle) console.log('Recharge effect applied.');
                    player.mana += 101;
                }
            })
        }}
    ],
    cast: function(spellIdentifier, turn) {
        var spell;
        if (isNaN(spellIdentifier)) {
            spell = player.spells.filter(s => s.name == spellIdentifier)[0];
        } else {
            spell = player.spells[spellIdentifier];
        }
        if (player.mana >= spell.cost) {
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

var bossBase = {
    hp: 51,
    dmg: 9,
    armor: 0,
    attack: () => {
        var attackPower = boss.dmg-player.armor;
        if (attackPower < 1) attackPower = 1;
        if (verboseBattle) console.log('Boss attacks for', attackPower);
        player.hp -= attackPower;
    }
}

var player = $.extend(true, {}, playerBase);
var boss = $.extend(true, {}, bossBase);

function beginTurn(turn) {
    if (verboseBattle) console.log('****************************************************');
    if (verboseBattle) console.log('Turn', turn, 'has began!');
}

function handleStack(turn) {
    stack.filter(s => s.turn == turn).map(s => s.effect())
}

function checkStatus(noStats) {
    if (verboseBattle) {
        if (noStats !== true) console.log('Stats', 'Player', $.extend(true, {}, player));
        if (noStats !== true) console.log('Stats', 'Boss', $.extend(true, {}, boss));
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

var lowestManaSpentOnWin = 9001;

function battle(playerStrategy, setVerboseTo, applyCurse) {

    verboseBattle = setVerboseTo;

    // reset
    player = $.extend(true, {}, playerBase);
    boss = $.extend(true, {}, bossBase);
    stack = [];
    if (verboseBattle) {
        console.log('****************************************************');
        console.log('***************** NEW BATTLE ***********************');
        console.log('****************************************************');
    }

    var turn = 0;
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
        if (lowestManaSpentOnWin > player.manaSpent/* && player.manaSpent > 1200*/) {
            lowestManaSpentOnWin = player.manaSpent;
            console.log('Stats', 'Player', $.extend(true, {}, player));
            console.log('Stats', 'Boss', $.extend(true, {}, boss));
        }
    }

}

function playBattle(chain, applyCurse) {
    battle((turn) => {
        return chain[(turn-1)/2];
    }, true, applyCurse);
}

var variant = 0;
var stop = false;

while (!stop) {

    var s = variant.toString(5);
    while (s.length < 24+1) s = '0'+s;

    battle((turn) => {
        return parseInt(s[24-(turn-1)/2]);
    }, false, false)

    variant++;
    if (variant % 100000 == 0) console.log('Checked', variant, 'possible realities. Lowest mana needed to win is so far', lowestManaSpentOnWin, '. Last used spellchain', s);
    if (variant % 10000000 == 0) break;
}

console.log('Finished cycle. Checked', variant, 'possible realities. Lowest mana needed to win is', lowestManaSpentOnWin);

//playBattle(["Recharge", "Poison", "Poison", "Poison", "Magic Missile", "Magic Missile"], false); // part 1 real solution with 854 mana (site wants 900)
//playBattle(["Recharge", "Poison", "Poison", "Poison", "Drain", "Magic Missile"], true); // part 2 real solution with 874 mana (site wants 1216)
