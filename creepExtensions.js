let speech = require ('utils.speech');

// TODO: make this more efficient by using the village to scan
Creep.prototype.isNearEnemy = function(range = 15) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range).length > 0;
}

Creep.prototype.nearbyEnemies = function(range = 10) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range);
}

/**
 * look for dropped resources, then tombstones, then drop containers
 * last ditch, look for storages
 */
Creep.prototype.scavenge = function(onlyEnergy) { // TEST: functionality
    let findTargets = [FIND_DROPPED_RESOURCES, FIND_TOMBSTONES];
    let findFilters = [
        {
            filter: object => object.resourceType == RESOURCE_ENERGY && object.amount >= 100 || object.resourceType != RESOURCE_ENERGY
        },
        {
            filter: structure => structure.store ? structure.store[RESOURCE_ENERGY] >= 100 || Object.keys(structure.store).length > 1 : false
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
                    this.emote('scavenger', speech.PICKUP);
                    this.moveTo(target,  {visualizePathStyle: {stroke: '#ffffff'}});
                    this.pickup(target);
                    return true;
                case 1:
                    this.emote('scavenger', speech.RIP);
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
        return;
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
        case (ERR_NOT_IN_RANGE):
            this.moveTo(transferTarget, opts);
            break;
        case (ERR_FULL):
            return ERR_FULL;
        case (ERR_INVALID_TARGET):
            throw new Error(`ERROR: ${this.name} failed on prototype TRANSFERMOVE due to error code ${status}`);
    }
}

Creep.prototype.withdrawMove = function(withdrawTarget, resourceType = RESOURCE_ENERGY) {
    if(!withdrawTarget) {
        throw new Error(`ERROR: ${this.name} failed on prototype WITHDRAWMOVE due to withdrawTarget being undefined`);
    }
    //console.log(this.name + ' : ' + resourceType)
    this.withdraw(withdrawTarget, RESOURCE_ENERGY);
    let status = this.withdraw(withdrawTarget, resourceType);
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
    return this.say(speech.getRole(role)+(message ? message : ''))
}