var input = {'Immune System':[
'790 units each with 3941 hit points with an attack that does 48 bludgeoning damage at initiative 5',
'624 units each with 2987 hit points with an attack that does 46 bludgeoning damage at initiative 16',
'5724 units each with 9633 hit points (immune to bludgeoning, slashing, fire) with an attack that does 16 slashing damage at initiative 9',
'1033 units each with 10664 hit points with an attack that does 89 slashing damage at initiative 1',
'6691 units each with 9773 hit points (weak to slashing) with an attack that does 13 bludgeoning damage at initiative 12',
'325 units each with 11916 hit points (weak to bludgeoning) with an attack that does 276 slashing damage at initiative 8',
'1517 units each with 6424 hit points with an attack that does 35 bludgeoning damage at initiative 13',
'1368 units each with 9039 hit points (immune to bludgeoning) with an attack that does 53 slashing damage at initiative 4',
'3712 units each with 5377 hit points (immune to cold, radiation; weak to fire) with an attack that does 14 slashing damage at initiative 14',
'3165 units each with 8703 hit points (weak to slashing, bludgeoning) with an attack that does 26 radiation damage at initiative 11'],
'Infection':[
'1113 units each with 44169 hit points (immune to bludgeoning; weak to radiation) with an attack that does 57 fire damage at initiative 7',
'3949 units each with 20615 hit points (weak to radiation, cold) with an attack that does 9 bludgeoning damage at initiative 6',
'602 units each with 35167 hit points (immune to bludgeoning, cold; weak to fire) with an attack that does 93 radiation damage at initiative 20',
'1209 units each with 34572 hit points with an attack that does 55 bludgeoning damage at initiative 3',
'902 units each with 12983 hit points (immune to fire) with an attack that does 28 fire damage at initiative 19',
'1132 units each with 51353 hit points with an attack that does 66 radiation damage at initiative 15',
'7966 units each with 49894 hit points (immune to bludgeoning) with an attack that does 9 cold damage at initiative 10',
'3471 units each with 18326 hit points (weak to radiation) with an attack that does 8 fire damage at initiative 18',
'110 units each with 38473 hit points (weak to bludgeoning; immune to fire) with an attack that does 640 slashing damage at initiative 2',
'713 units each with 42679 hit points (weak to slashing) with an attack that does 102 bludgeoning damage at initiative 17']}
/*
var input = {'Immune System':[
'17 units each with 5390 hit points (weak to radiation, bludgeoning) with an attack that does 4507 fire damage at initiative 2',
'989 units each with 1274 hit points (immune to fire; weak to bludgeoning, slashing) with an attack that does 25 slashing damage at initiative 3'],
'Infection':[
'801 units each with 4706 hit points (weak to radiation) with an attack that does 116 bludgeoning damage at initiative 1',
'4485 units each with 2961 hit points (immune to radiation; weak to fire, cold) with an attack that does 12 slashing damage at initiative 4']}
*/
class Group {
    constructor(armyId, id, configLiteral) {
        this.id = armyId+'_'+id;
        this.parseLiteral(configLiteral);
        this.status = 'ALIVE';
        this.armyId = armyId;
        this.targeted = false;
        this.targeting = false; // group instance otherwise
    }

    initiative() {
        return this.config.initiative;
    }

    effectivePower() {
        return this.config.units*this.config.attack;
    }

    units() {
        return this.config.units;
    }

    attackType() {
        return this.config.attackType;
    }

    wouldReceiveDamage(fromGroup) {
        var power = fromGroup.effectivePower();
        var type = fromGroup.attackType();
        if (this.config.weakTo.includes(type)) {
            return power*2;
        } else if  (this.config.immuneTo.includes(type)) {
            return 0;
        } else {
            return power;
        }
    }

    attack() {
        if (!this.targeting) return;
        var self = this;
        //console.log('Group', this.id, 'attacks group', self.targeting.id, 'for a damage of', self.targeting.wouldReceiveDamage(self));
        this.targeting.takeDamage( self.targeting.wouldReceiveDamage(self) );
    }

    pickTarget(targetGroups) {
        //console.log('***', this.armyId, targetGroups);
        if (targetGroups.length == 0) return;
        var self = this;
        // seradit nevybrane podle toho, kolik bychom dane grupe dali dmg
        targetGroups.sort((a,b) => {
            if (a.wouldReceiveDamage(self) == b.wouldReceiveDamage(self)) {
                if (b.effectivePower() == a.effectivePower()) {
                    return b.initiative() - a.initiative();
                } else {
                    return b.effectivePower()-a.effectivePower();
                }
            } else {
                return b.wouldReceiveDamage(self)-a.wouldReceiveDamage(self);
            }
        })
        if (targetGroups[0].wouldReceiveDamage(self) > 0) {
            this.targeting = targetGroups[0];
            targetGroups[0].targeted = true;
        }
        //console.log('Group', this.id, 'is targeting', this.targeting?.id);
    }

    takeDamage(damage) {
        var killedUnits = Math.floor(damage/this.config.unitHP);
        this.config.units -= killedUnits;
        if (this.config.units <= 0) {
            this.config.units = 0;
            this.status = 'DEAD';
        }
        //console.log('Group', this.id, 'received', damage, 'damage, lost', killedUnits, 'units. Remaining units', this.config.units, 'unitHP', this.config.unitHP);
    }

    parseLiteral(s) {
        var config = {};
        var numbers = s.match(/\d+/g);
        config.units = parseInt(numbers[0]);
        config.unitHP = parseInt(numbers[1]);
        config.attack = parseInt(numbers[2]);
        config.initiative = parseInt(numbers[3]);
        config.attackType = s.match(/([^ ]+)(\s)damage/g)[0].split(' ')[0];

        config.immuneTo = [];
        config.weakTo = [];
        var addInfo = s.substring(s.indexOf('(')+1,s.indexOf(')'));
        if (addInfo != '') {
            var arr = addInfo.split('; ');
            arr.map(a => {
                if (a.indexOf('weak to') > -1) {
                    config.weakTo = a.substr(('weak to ').length).split(', ');
                } else if (a.indexOf('immune to') > -1) {
                    config.immuneTo = a.substr('immune to '.length).split(', ');
                }
            })
        }
        //console.log(config);

        this.config = config;
    }

    reset() {
        this.targeted = false;
        this.targeting = false;
    }

    boost(num) {
        this.config.attack += num;
    }
}

class Army {
    constructor(name, groupsLiteral, id) {
        //console.log('adding army', name);
        this.name = name;
        this.id = id;
        this.groups = [];
        groupsLiteral.map(g => this.addGroup(id, g));
    }

    group(index) {
        return this.groups[index];
    }

    getGroups(status) {
        var grps = [];
        this.groups.map(g => {
            if (g.status == 'ALIVE') grps.push(g)
        });
        return grps;
    }

    addGroup(armyId, groupLiteral) {
        var group = new Group(armyId, this.groups.length, groupLiteral);
        this.groups.push(group);
    }

    reset() {
        this.groups.map(g => g.reset());
    }

    units() {
        var totalUnits = 0;
        this.getGroups('ALIVE').map(g => totalUnits += g.units())
        return totalUnits;
    }

    log() {
        console.log('Army', this.name, 'has', this.units(), 'units left.');
    }

    boost(num) {
        this.groups.map(g => g.boost(num));
    }
}

var armies = [];
var groups = [];
var timerHandle;

function init() {
    Object.entries(input).map(([armyName, unitsLiteral]) => {
        var army = new Army(armyName, unitsLiteral, armies.length);
        armies.push(army);
    })
}

function initRound() {
    groups = []
    armies.map(army => {
        groups.push(...army.getGroups('ALIVE'))
    })

    groups.sort((a,b) => {
        if (a.effectivePower() == b.effectivePower()) {
            return b.initiative() - a.initiative();
        } else {
            return b.effectivePower() - a.effectivePower();
        }
    })
}

function round() {
    initRound();

    // targeting
    groups.map(group => group.pickTarget(groups.filter( g => (g.armyId != group.armyId && !g.targeted) ) ));

    // attacking, after re-sort
    groups.sort((a,b) => {
        return b.initiative() - a.initiative();
    })
    groups.map(g => g.attack());

    // reset
    groups.map(g => g.reset());
}

init();

// phase 2, boost immune system
armies[0].boost(36); // 35 -> inf wins, 36 -> immune wins 5252 => yay

armies.map(a => a.log());

var ticks = 1;
var stop = false;

function tick() {
    round();
    console.log('Round', ticks, 'ended.');
    armies.map(a => {
        a.log();
        if (a.units() == 0) stop = true;
    });
    if (!stop) timerHandle = setTimeout(() => tick(), 10);
    ticks++;
}

tick();

// 18712 too low
// 18717