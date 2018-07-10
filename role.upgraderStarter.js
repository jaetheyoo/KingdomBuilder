var roleUpgraderStarter = {

    /** @param {Creep} creep **/
    run: function(creep) {
        try {
            if(creep.memory.upgrading && creep.carry.energy == 0) {
                creep.memory.upgrading = false;
                creep.say('🔄');
            }
            if(!creep.memory.upgrading && creep.carry.energy == creep.carryCapacity) {
                creep.memory.upgrading = true;
                creep.say('⚡');
            }
    
            if(creep.memory.upgrading) {
                if (!creep.pos.inRangeTo(Game.flags['S2U'].pos,2)) {
                    creep.moveTo(Game.flags['S2U']);
                }
                else if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] > 0);
                    }
                });
    
                if(target) {
                    if(creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
                } else {
                    if(creep.carryCapacity == 0) {
                        var source = creep.pos.findClosestByRange(FIND_SOURCES);
                        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    } else if(creep.carry.energy < creep.carryCapacity) {
                        var source = creep.pos.findClosestByRange(FIND_SOURCES);
                        if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    } else {
                        var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                            filter: (structure) => {
                                return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity);
                            }
                        });
            
                        if(target) {
                            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                                creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
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

module.exports = roleUpgraderStarter;