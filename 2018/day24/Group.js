class Group {
    constructor(armyId, id, configLiteral) {
        this.id = armyId+'_'+id;
        this.parseLiteral(configLiteral);
        this.status = 'ALIVE';
        this.armyId = armyId;
        this.targeted = false;
        this.targeting = false; // group instance otherwise
    }

    initiative = () => this.config.initiative;
    effectivePower = () => this.config.units*this.config.attack;
    units = () => this.config.units;
    attackType = () => this.config.attackType;
    boost = num => this.config.attack += num;

    wouldReceiveDamage = fromGroup => {
        let power = fromGroup.effectivePower();
        let type = fromGroup.attackType();
        if (this.config.weakTo.includes(type)) {
            return power*2;
        } else if  (this.config.immuneTo.includes(type)) {
            return 0;
        } else {
            return power;
        }
    }

    attack = () => {
        if (!this.targeting) return;
        let self = this;
        //console.log('Group', this.id, 'attacks group', self.targeting.id, 'for a damage of', self.targeting.wouldReceiveDamage(self));
        this.targeting.takeDamage( self.targeting.wouldReceiveDamage(self) );
    }

    pickTarget = targetGroups => {
        if (targetGroups.length == 0) return;
        let self = this;
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

    takeDamage = damage => {
        let killedUnits = Math.floor(damage/this.config.unitHP);
        this.config.units -= killedUnits;
        if (this.config.units <= 0) {
            this.config.units = 0;
            this.status = 'DEAD';
        }
        //console.log('Group', this.id, 'received', damage, 'damage, lost', killedUnits, 'units. Remaining units', this.config.units, 'unitHP', this.config.unitHP);
    }

    parseLiteral = s => {
        let config = {immuneTo: [], weakTo: []}, numbers = s.match(/\d+/g).map(n => n = parseInt(n));
        config.units = numbers[0];
        config.unitHP = numbers[1];
        config.attack = numbers[2];
        config.initiative = numbers[3];
        config.attackType = s.match(/([^ ]+)(\s)damage/g)[0].split(' ')[0];

        let addInfo = s.substring(s.indexOf('(')+1,s.indexOf(')'));
        if (addInfo != '') {
            let arr = addInfo.split('; ');
            arr.map(a => {
                if (a.indexOf('weak to') > -1) {
                    config.weakTo = a.substr(('weak to ').length).split(', ');
                } else if (a.indexOf('immune to') > -1) {
                    config.immuneTo = a.substr('immune to '.length).split(', ');
                }
            })
        }
        this.config = config;
    }

    reset = () => {
        this.targeted = false;
        this.targeting = false;
    }
}
