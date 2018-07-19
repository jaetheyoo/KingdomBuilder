class CreepConfig {
    // TODO: build up or down according to available resources and other factors
    constructor(roleName, villageLevel, maxEnergy, availableEnergy) {
        this.roleName = roleName;
        this.villageLevel = villageLevel;
        this.body = this.getBody();
        this.cost = this.getMinimumCost();
        if (this.cost > availableEnergy) {
            this.villageLevel--;
            this.body = this.getBody();
            this.cost = this.getMinimumCost();
            //while (this.cost > availableEnergy && this.villageLevel > 1) { // do this only in the case of crashes
            //    this.villageLevel--;
            //    this.body = this.getBody();
            //    this.cost = this.getMinimumCost();
            //}
        } else if (this.cost < .2 * maxEnergy) {
            this.villageLevel++;
            this.body = this.getBody();
            this.cost = this.getMinimumCost();
            if (this.cost > maxEnergy) {
                this.villageLevel--;
                this.body = this.getBody();
                this.cost = this.getMinimumCost();
            }
        }

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
                return [WORK,WORK,WORK,CARRY,MOVE,MOVE];
            case 'dropHarvester':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,WORK,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,WORK,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 6:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                }
                return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
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
                        return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE];
                    case 6:
                        return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                }
                return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            case 'builder':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,CARRY,MOVE,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    case 6:
                        return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                }
                return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            case 'remoteDropHarvester':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,WORK,WORK,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 6:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                }
                return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
            case 'mineralHarvester':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,WORK,WORK,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE];
                    case 6:
                        return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE];
                }
                return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE];
            case 'mineralTransporter':
                switch (this.villageLevel) {
                    case 1:
                        return [CARRY,CARRY,MOVE];
                    case 2:
                        return [CARRY,CARRY,MOVE];
                    case 3:
                        return [CARRY,CARRY,MOVE];
                    case 4:
                        return [CARRY,CARRY,MOVE];
                    case 5:
                        return [CARRY,CARRY,MOVE];
                    case 6:
                        return [CARRY,CARRY,MOVE];
                }
                return [CARRY,CARRY,MOVE];
            case 'remoteRepairer':
                switch (this.villageLevel) {
                    case 1:
                        return [WORK,CARRY,MOVE,MOVE];
                    case 2:
                        return [WORK,WORK,CARRY,MOVE,MOVE,MOVE];
                    case 3:
                        return [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                    case 4:
                        return [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                    case 5:
                        return [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                    case 6:
                        return [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                }
                return [WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];   
            case 'linkMaintainer':
                switch (this.villageLevel) {
                    case 1:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 2:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 3:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
                    case 4:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE]
                    case 5:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                    case 6:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                }
                return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE]
            case 'remoteTransporter':
                switch (this.villageLevel) {
                    case 1:
                        return [CARRY,CARRY,MOVE,MOVE];
                    case 2:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 3:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                    case 4:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    case 5:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                    case 6:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                }
                return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            case 'scavenger':
                switch (this.villageLevel) {
                    case 1:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 2:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 3:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                    case 4:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
                    case 5:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                    case 6:
                        return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                }
                return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
            case 'remoteClaimer':
                switch (this.villageLevel) {
                    case 1:
                        return [CLAIM,CLAIM,MOVE];
                    case 2:
                        return [CLAIM,CLAIM,MOVE];
                    case 3:
                        return [CLAIM,CLAIM,MOVE];
                    case 4:
                        return [CLAIM,CLAIM,MOVE,MOVE];
                    case 5:
                        return [CLAIM,CLAIM,MOVE,MOVE,MOVE];
                }
                return [CLAIM,CLAIM,MOVE,MOVE,MOVE];
            case 'remoteBodyguard':
                switch (this.villageLevel) {
                    case 1:
                        return [MOVE,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
                    case 2:
                        return [MOVE,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
                    case 3:
                        return [MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
                    case 4:
                        return [TOUGH,TOUGH,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
                    case 5:
                        return [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
                }
                return [TOUGH,TOUGH,TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE];
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


