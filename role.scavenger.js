var roleScavenger = {

    /** @param {Creep} creep **/
    /* Memory: flag 
        Value: The name of a flag
        Desc: if flag is provided, the scavenger will move to the flag if they're in the starting room with no energy
            once there, they will scavenge in the room the flag is in
    */
    run: function(creep, shouldWait) {
        if (!shouldWait) {
            shouldWait = false;
        }
        try {
            if (creep.carry.UH || creep.carry.OH || creep.carry.GO || creep.carry.KO || creep.carry.ZH || creep.carry.ZK || creep.carry.GH || creep.carry.ZO || creep.carry.LO) {
                let mySpawn = creep.memory.mySpawn ? creep.memory.mySpawn : 'Spawn1'; 
                let targets = Game.spawns[mySpawn].room.find(FIND_STRUCTURES, {
                    filter: (i) => i.structureType == STRUCTURE_STORAGE &&
                    i.store[RESOURCE_ENERGY] < i.storeCapacity 
                });
                
                if (targets) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                        creep.transfer(targets[0], RESOURCE_ENERGY);
                    }
                    for(const resourceType in creep.carry) {
                        creep.transfer(targets[0],resourceType);
                    }
                }
            } else {
                if (creep.carry.energy == 0) {
                    creep.memory.harvesting = true;
                } else if (creep.carry.energy == creep.carryCapacity){
                    creep.memory.harvesting = false;
                }
                
                if (creep.memory.moving && Game.flags[creep.memory.flag] && creep.pos.isEqualTo(Game.flags[creep.memory.flag].pos)) {
                    creep.memory.moving = false;
                } else if (creep.carry.energy == 0 && Game.flags[creep.memory.flag] && !creep.memory.moving && creep.room == Game.spawns['Spawn1'].room) {
                    creep.memory.moving = true;
                } 
                if (creep.memory.moving) {
                    creep.say('✈️');
                    creep.moveTo(Game.flags[creep.memory.flag],{visualizePathStyle: {stroke: '#ffffff'}});
                }
                else {
                    if(creep.memory.harvesting) {
                        const droppedResources = creep.pos.findClosestByRange(FIND_DROPPED_RESOURCES, {
                            filter: function(object) {
                                return (object.resourceType == RESOURCE_ENERGY && object.amount >= 0 || object.resourceType != RESOURCE_ENERGY);
                            }
                        });
                        const tombstones = creep.pos.findClosestByRange(FIND_TOMBSTONES, {
                            filter: (structure) => {
                                return (structure.store[RESOURCE_ENERGY] > 0 || structure.store[RESOURCE_GHODIUM] > 0);
                            }
                        });
                        if (tombstones) {
                            creep.say("😇 RIP");
                            creep.moveTo(tombstones,  {visualizePathStyle: {stroke: '#ffffff'}});
                            creep.withdraw(tombstones, RESOURCE_ENERGY);
                            creep.withdraw(tombstones, 'UH');
                            creep.withdraw(tombstones, 'KO');
    
                            creep.withdraw(tombstones, 'ZH');
                            creep.withdraw(tombstones, 'GO');
    
                        } else if(droppedResources) {
                            creep.say("✋");
                            creep.moveTo(droppedResources,  {visualizePathStyle: {stroke: '#ffffff'}});
                            creep.pickup(droppedResources);
                        } else {
                            let myFlag = creep.memory.harvestFlag ? creep.memory.harvestFlag : 'HarvestA1';
                            let miningContainers = Game.flags[myFlag].pos.findInRange(FIND_STRUCTURES,3, {
                                filter: (structure) => {
                                    return ((structure.structureType == STRUCTURE_CONTAINER) && 
                                        structure.store[RESOURCE_ENERGY] > 0);
                                }
                            }).sort((x,y) => y.store[RESOURCE_ENERGY]-x.store[RESOURCE_ENERGY]);
                            
                            if (miningContainers.length > 0) {
                                if(creep.withdraw(miningContainers[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(miningContainers[0], {visualizePathStyle: {stroke: '#ffffff'}});
                                    creep.withdraw(miningContainers[0], RESOURCE_ENERGY);
                                }
                            } else {
                                var withdrawTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                                    filter: (structure) => {
                                        return (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 0);
                                    }
                                });
                                if (withdrawTarget) {
                                    if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(withdrawTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
                                        creep.withdraw(withdrawTarget, RESOURCE_ENERGY);
                                    }
                                }
                            }
                        }
                    } else {
                        var targets = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return ((structure.structureType == STRUCTURE_TOWER && structure.energy <= structure.energyCapacity/2) || 
                                (structure.structureType == STRUCTURE_EXTENSION ||
                                    structure.structureType == STRUCTURE_SPAWN) && 
                                    structure.energy < structure.energyCapacity);
                            }
                        });
                        if(targets) {
                            if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                                creep.transfer(targets, RESOURCE_ENERGY);
                            }
                        } else if (shouldWait) {
                            creep.say("🛑 Waiting");
                            creep.moveTo(Game.flags["WaitingZone"],{visualizePathStyle: {stroke: '#EE9B8A'}});
                        } else {
                            let myDropOffFlag = creep.memory.myDropOffFlag ? creep.memory.myDropOffFlag : 'DropoffContainers';
                            
                            targets = Game.flags[myDropOffFlag].pos.findInRange(FIND_STRUCTURES,4, {
                                filter: (structure) => {
                                    return ((structure.structureType == STRUCTURE_CONTAINER) && 
                                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                                }
                            });
                            if (targets.length) {
                                if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                    creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                                    creep.transfer(targets[0], RESOURCE_ENERGY);
                                }
                            } else {
                                let mySpawn = creep.memory.mySpawn ? creep.memory.mySpawn : 'Spawn1'; 
                                targets = Game.spawns[mySpawn].room.find(FIND_STRUCTURES, {
                                    filter: (i) => i.structureType == STRUCTURE_STORAGE &&
                                    i.store[RESOURCE_ENERGY] < i.storeCapacity 
                                });
                                
                                if (targets) {
                                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                                        creep.transfer(targets[0], RESOURCE_ENERGY);
                                    }
                                    for(const resourceType in creep.carry) {
                                        creep.transfer(targets[0],resourceType);
                                    }
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

module.exports = roleScavenger;