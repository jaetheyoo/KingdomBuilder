class CreepConfig {
    // TODO: build up or down according to available resources and other factors
    constructor(roleName, villageLevel, maxEnergy, availableEnergy) {
        //console.log(roleName +" | "+maxEnergy  +" | "+ villageLevel +" | "+ maxEnergy  +" | "+availableEnergy)
        this.roleName = roleName;
        this.villageLevel = villageLevel;
        this.body = this.getBody();
        this.cost = this.getMinimumCost();
        if (this.cost > availableEnergy && this.villageLevel > 1) {
            this.villageLevel--;
            this.body = this.getBody();
            this.cost = this.getMinimumCost();
            
            while (roleName == 'scavenger' && this.cost > availableEnergy && this.villageLevel > 1) { // do this only in the case of crashes
                this.villageLevel--;
                this.body = this.getBody();
                this.cost = this.getMinimumCost();
            }
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
        //console.log(roleName +" | "+maxEnergy  +" | "+ this.villageLevel +" | "+ maxEnergy  +" | "+availableEnergy)
    }

    getMemoryConfig() {
        switch(this.roleName) {
            case 'colonizer':
                return {role: this.roleName, getBoosted:['XZHO2','XLH2O']};
            case 'missionary':
                return {role: this.roleName, getBoosted:['XZHO2','XGH2O']};
        }
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
            case 'remoteHarvester':
            switch (this.villageLevel) {
                case 1:
                    return [WORK,CARRY,MOVE,MOVE];
                case 2:
                    return [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE];
                case 3:
                    return [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE];
                case 4:
                    return [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE];
                case 5:
                    return [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE];
            }
            return [WORK,WORK,WORK,CARRY,MOVE,MOVE,MOVE,MOVE];
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
            case 'labManager':
                switch (this.villageLevel) {
                    case 1:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 2:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 3:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 4:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 5:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                    case 6:
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                }
                return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
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
            case 'defenseContractor':
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
                        return [WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE];                
                    case 6:
                        return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];
                }
                return [WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE];                
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
                        return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE];
                    case 6:
                        return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
                }
                return [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                    WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
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
                        return [CARRY,CARRY,CARRY,CARRY,MOVE,MOVE];
                }
                return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE];
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
                        return [MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE];
                    case 2:
                        return [MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE];
                    case 3:
                        return [MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE];
                    case 4:
                        return [TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE];
                    case 5:
                        return [TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,MOVE];
                }
                return [RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,ATTACK,ATTACK,HEAL];
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
            case 'cattle':
                return [CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE];
            case 'colonizer':
                return [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
            case 'conquerer':
                return [CLAIM,MOVE,MOVE,MOVE];
            case 'missionary':
                return [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY];
        }
    }
}

module.exports = CreepConfig;


