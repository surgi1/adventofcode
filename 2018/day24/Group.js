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
        if (targetGroups.length == 0) return;
        var self = this;
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
