class CreepConfig {
    // TODO: build up or down according to available resources and other factors
    constructor(roleName, villageLevel) {
        this.roleName = roleName;
        this.villageLevel = villageLevel;
        this.body = this.getBody();
        this.cost = this.getMinimumCost();
        this.memoryConfig = this.getMemoryConfig();
        this.name = this.getName();
    }

    getMemoryConfig() {
        return {role: this.roleName};
    }

    getName() {
        return this.roleName + Memory.creepNameCounter;
    }

    getMinimumCost() {
        // for each part in this.body
        // calculate total cost
        let cost = 0;
        _.forEach(this.body, function(part) {
            switch (part) {
                case WORK:
                    cost += 100;
                    break;
                case CARRY:
                    cost += 50;
                    break;
                case MOVE:
                    cost += 50;
                    break;
                case TOUGH:
                    cost += 10;
                    break;
                case ATTACK:
                    cost += 80;
                    break;
                case RANGED_ATTACK:
                    cost += 150;
                    break;
                case HEAL:
                    cost += 250;
                    break;
                case CLAIM:
                    cost += 600;
                    break;
            }
        })
        return cost;
    }

    getBody() {
        switch(this.roleName) {
            case 'harvester':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,WORK,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,CARRY,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,CARRY,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,CARRY,MOVE,MOVE];
                }
            case 'dropHarvester':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,WORK,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                }
            case 'upgrader':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                }
            case 'builder':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,CARRY,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                }
            case 'remoteHarvester':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 4:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 5:
                        return [WORK,CARRY,MOVE,MOVE];
                }
            case 'transporter':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 4:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 5:
                        return [WORK,CARRY,MOVE,MOVE];
                }
            case 'remoteTransporter':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 4:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 5:
                        return [WORK,CARRY,MOVE,MOVE];
                }
            case 'scavenger':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 4:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 5:
                        return [WORK,CARRY,MOVE,MOVE];
                }
            case 'claimer':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 4:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 5:
                        return [WORK,CARRY,MOVE,MOVE];
                }
            case 'meleeBodyGuard':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 4:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 5:
                        return [WORK,CARRY,MOVE,MOVE];
                }
            case 'meleeDefender':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 3:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 4:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 5:
                        return [WORK,CARRY,MOVE,MOVE];
                }
        }
    }
}

module.exports = CreepConfig;


