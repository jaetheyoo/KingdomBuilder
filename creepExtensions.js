// TODO: make this more efficient by using the village to scan
Creep.prototype.isNearEnemy = function(range = 15) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range, {
        filter: 
            x => !ALLIES.usernames.includes(x.owner.username)
    }).length > 0;
}

Creep.prototype.nearbyEnemies = function(range = 10) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range, {
        filter: 
            x => !ALLIES.usernames.includes(x.owner.username)
    });
}

Creep.prototype.canRepair = function() {
    //return this.getActiveBodyParts.
}

/**
 * look for dropped resources, then tombstones, then drop containers
 * last ditch, look for storages
 */
Creep.prototype.scavenge = function(onlyEnergy) { // TEST: functionality
    let findTargets = [FIND_DROPPED_RESOURCES, FIND_TOMBSTONES];
    let findFilters = [
        {
            filter: object => object.resourceType == RESOURCE_ENERGY && object.amount >= 200 || object.resourceType != RESOURCE_ENERGY
        },
        {
            filter: structure => structure.store ? structure.store[RESOURCE_ENERGY] >= 200 || Object.keys(structure.store).length > 1 : false
        },
    ];
    if (onlyEnergy) {
        findFilters = [
        {
            filter: object => object.resourceType == RESOURCE_ENERGY && object.amount >= 100
        },
        {
            filter: structure => structure.store[RESOURCE_ENERGY] >= 100
        },
        ];
    }
    // console.log(this.name + ' | scavenging');
    for (let i in findTargets) {
        let target = this.pos.findClosestByRange(findTargets[i], findFilters[i]);
        if (target) {
            switch(parseInt(i)) {
                case 0:
                    this.emote('scavenger', CREEP_SPEECH.PICKUP);
                    this.moveTo(target,  {visualizePathStyle: {stroke: '#ffffff'}});
                    this.pickup(target);
                    return true;
                case 1:
                    this.emote('scavenger', CREEP_SPEECH.RIP);
                    this.moveTo(target,  {visualizePathStyle: {stroke: '#ffffff'}});
                    // console.log(this.name + ' | ' + target);
                    let minerals = Object.keys(target.store);
                    let resourceType = RESOURCE_ENERGY;
                    if (!onlyEnergy && minerals.length > 1) {
                        resourceType = minerals[1];
                    }
                    this.withdraw(target, resourceType);
                    return true;
            }
            break;
        }
    }
    return false;
}

// Creep.prototype.findTarget = function(findTargets, findFilters) {

// }
/**
 * 
 * @param {gameObject} transferTarget 
 * @param {resourceEnum} resourceType 
 */
Creep.prototype.transferMove = function(transferTarget, resourceType = RESOURCE_ENERGY, opts) {
    if (!transferTarget) {
        return -1;
    }
    if (!opts) {
        opts = {visualizePathStyle: {stroke: '#ffffff'}}
    }
    if (!resourceType) {
        resourceType = RESOURCE_ENERGY;
    }
    
    let store = transferTarget.store;
    if (store) {
        let carryKeys = Object.keys(this.carry);
        if (carryKeys.length > 1 ) {
            resourceType = carryKeys[1];
        }
    }
    
    this.transfer(transferTarget, RESOURCE_ENERGY);
    let status = this.transfer(transferTarget, resourceType);
    switch(status) {
        case 0:
            return 0;
        case (ERR_NOT_IN_RANGE):
            this.moveTo(transferTarget, opts);
            break;
        case (ERR_FULL):
            return ERR_FULL;
        case (ERR_INVALID_TARGET):
            throw new Error(`ERROR: ${this.name} failed on prototype TRANSFERMOVE due to error code ${status}`);
    }
    return -1;
}

Creep.prototype.withdrawMove = function(withdrawTarget, resourceType = RESOURCE_ENERGY, amount = null) {

    if(!withdrawTarget) {
        throw new Error(`ERROR: ${this.name} failed on prototype WITHDRAWMOVE due to withdrawTarget being undefined`);
    }
    //console.log(this.name + ' : ' + resourceType)
    let status;
    if (!amount) {
        //this.withdraw(withdrawTarget, RESOURCE_ENERGY);
        status = this.withdraw(withdrawTarget, resourceType);
    } else {
        //this.withdraw(withdrawTarget, RESOURCE_ENERGY, amount);
        status = this.withdraw(withdrawTarget, resourceType, amount);
    }

    //console.log(status)
    switch(status) {
        case (ERR_NOT_IN_RANGE):
            this.moveTo(withdrawTarget, {visualizePathStyle: {stroke: '#ffffff'}});
            break;
        case (ERR_FULL):
        case (ERR_INVALID_TARGET):
            throw new Error(`ERROR: ${this.name} failed on prototype WITHDRAWMOVE due to error code ${status}`)
    }
}

/**
 * Moves in range of a target position, and finds a spot off the road to work
 * @param {RoomPos} targetPos 
 */
Creep.prototype.park = function(targetPos, range = 3) {
    if (!creep.pos.inRangeTo(targetPos, range)) {
        creep.moveTo(targetPos);
        creep.memory.parked = false;
        delete creep.memory.parkingSpot;
        return;
    }

    if (creep.memory.parked) {
        return;
    }

    if (creep.memory.parkingSpot) {
        let parkingSpot = new RoomPosition(creep.memory.parkingSpot.x, creep.memory.parkingSpot.y, targetPos.roomName);
        if (creep.pos.isEqual(parkingSpot)) {
            creep.memory.parked = true;
            return;
        }

        creep.moveTo(parkingSpot);
        return;
    }

    let structures = creep.pos.lookFor(LOOK_STRUCTURES);
    if (!structures.includes(x => x.structureType == STRUCTURE_ROAD)) {
        creep.memory.parked = true;
        return;
    }

    for(let x = -range; x <= range; x++) {
        for (let y = -range; y <= range; y++) {
            let pos = new RoomPosition(targetPos.x + x, targetPos.y + y, targetPos.roomName);
            if (Game.map.getTerrainAt(pos) == 'wall') {
                continue;
            }
            let pStructures = pos.lookFor(LOOK_STRUCTURES);
            if (pStructures) {

            }
        }
    }


}

/**
 * 
 * @param {constructionSiteId} buildTarget 
 */
Creep.prototype.buildMove = function(buildTarget) {
    let target =  Game.getObjectById(buildTarget);
// TODO: all not in range methods should be eradicated when pathfinding caches the nearest applicable spot for an action
    if (target) {
        if (this.pos.inRangeTo(target,4)) {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}}); // TODO: find a place to park the builder in a way that it won't be in the way
            let status = this.build(target);
            switch(status) {
                case ERR_INVALID_TARGET:
                    delete this.memory.buildTarget;
                    break;
                    // TODO: investigate if this was destroyed
            }
        } else {
            this.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        }
    } else {
        delete this.memory.buildTarget;
    }

}

/**
 * 
 * @param {string} role 
 * @param {string} message 
 */
Creep.prototype.emote = function(role, message) {    
    return this.say(CREEP_SPEECH.getRole(role)+(message ? message : ''))
}

// Object.defineProperties(Creep, {
//     journal: {
//         get() {
//             if (!this.memory.journal) {
//                 this.memory.journal = [];
//             }
//             return this.memory.journal;
//         }
//     },
//     task: {
//         get() {
//             return this.memory.task;
//         },
//         set(value) {
//             this.journal.push(this.memory.task);
//             this.memory.task = value;
//         }
//     }
// })