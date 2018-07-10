var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        if (Game.flags[creep.name] && !creep.pos.isEqualTo(Game.flags[creep.name].pos)) {
            creep.moveTo(Game.flags[creep.name], {visualizePathStyle: {stroke: '#ffaa00'}});
        } else if(creep.carryCapacity == 0) {
            creep.memory.harvesting = false;
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else if(creep.carry.energy < creep.carryCapacity) {
            var source = Game.flags['R2S2'].pos.findClosestByRange(FIND_SOURCES);
            if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
                creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity ||
                    structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity);
                }
            });

            if(target) {
                if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_CONTAINER && structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
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
};

module.exports = roleHarvester;