var roleTransporter = {

    /** @param {Creep} creep **/
    run: function(creep, shouldWait) {
        try {
            const transferThreshold = 0; //250
            if(creep.carry.energy <= transferThreshold) {
                let miningContainer = Game.flags['toLink'].pos.findInRange(FIND_STRUCTURES,1, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_LINK) && //STRUCTURE_LINK
                                structure.energy > 0); // structure.energy
                        }
                    });
    
                if (miningContainer.length > 0) {
                    if(creep.withdraw(miningContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(miningContainer[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    miningContainer = Game.flags['HarvestA1'].pos.findInRange(FIND_STRUCTURES,3, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_CONTAINER) && 
                                structure.store[RESOURCE_ENERGY] > 0);
                        }
                    }).sort((x,y) => y.store[RESOURCE_ENERGY]-x.store[RESOURCE_ENERGY]);
    
                    if (miningContainer.length > 0) {
                        if(creep.withdraw(miningContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(miningContainer[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else {
                        //temp
                        var withdrawTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0);
                                    }
                                });
                                if (withdrawTarget) {
                                    if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(withdrawTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
                                    }
                                } else {
                        var spawn = creep.pos.findClosestByRange(FIND_MY_SPAWNS);
                        if(creep.withdraw(spawn, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(spawn);
                        }}
                    }
                }
            } else {
                let miningContainer = Game.flags['toLink'].pos.findInRange(FIND_STRUCTURES,1, {
                        filter: (structure) => {
                            return ((structure.structureType == STRUCTURE_LINK) && //STRUCTURE_LINK
                                structure.energy > 0); // structure.energy
                        }
                    });
                if (miningContainer.length > 0) {
                    let targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                            filter: (i) => i.structureType == STRUCTURE_STORAGE &&
                            i.store[RESOURCE_ENERGY] < i.storeCapacity 
                    });
                    if (targets.length) {
                        if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    }
                }
                else {
                    var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            return (((structure.structureType == STRUCTURE_TOWER) && 
                                structure.energy < structure.energyCapacity) || (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity));
                        }
                    });
        
                    if(targets) {
                        if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                        }
                    } else if (shouldWait) {
                        creep.say("🛑 Waiting");
                        creep.moveTo(Game.flags["WaitingZone"],{visualizePathStyle: {stroke: '#EE9B8A'}});
                    } else {
                        
                        targets = Game.spawns['Spawn1'].room.find(FIND_STRUCTURES, {
                            filter: (i) => i.structureType == STRUCTURE_STORAGE &&
                            i.store[RESOURCE_ENERGY] < i.storeCapacity 
                        });
                        
                        if (targets.length) {
                            if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                            }
                        } else {
                            targets = Game.flags['DropoffContainers'].pos.findInRange(FIND_STRUCTURES, 5,{
                                filter: (structure) => {
                                    return ((structure.structureType == STRUCTURE_CONTAINER) && 
                                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                                }
                            });
                            
                            if(targets.length) {
                                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                                }
                            }
                        }
                    }
                }
                
            }
        } catch (err) {
            console.log(err);
        }
        
    }
};

module.exports = roleTransporter;