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
