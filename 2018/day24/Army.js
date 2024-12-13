class Army {
    constructor(name, groupsLiteral, id) {
        this.name = name;
        this.id = id;
        this.groups = [];
        groupsLiteral.map(g => this.addGroup(id, g));
    }

    group = index => this.groups[index]

    getGroups = status => this.groups.filter(g => g.status == 'ALIVE')

    addGroup = (armyId, groupLiteral) => this.groups.push(new Group(armyId, this.groups.length, groupLiteral))

    reset = () => this.groups.map(g => g.reset())

    units = () => this.getGroups('ALIVE').reduce((a, g) => a+g.units(), 0)

    log = () => console.log('Army', this.name, 'has', this.units(), 'units left.')

    boost = num => this.groups.map(g => g.boost(num))
}
