var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        // if (Game.flags[creep.name] && !creep.pos.isEqualTo(Game.flags[creep.name].pos)) {
        //     creep.moveTo(Game.flags[creep.name], {visualizePathStyle: {stroke: '#ffaa00'}});
        //     return;
        // }
        
        
        // // drop miner
        // if(creep.carryCapacity == 0) {
        //     creep.memory.harvesting = false;
        //     var source = creep.pos.findClosestByRange(FIND_SOURCES);
        //     if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        //     }
        //     return;
        // } 
        
        // // walk miner
        // if (creep.carry.energy == 0) {
        //     creep.memory.harvesting = true;
        // } else if (creep.carry.energy == creep.carryCapacity) {
        //     creep.memory.harvesting = false;
        // }
        
        // if (creep.memory.harvesting) {
        //     // go to source
        //     let source = village.getSource(creep.name);
        //     if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
        //         creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
        //     }
        // } else {
        //     // go to dropoff location
        //     var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
        //         filter: (structure) => {
        //             return (structure.structureType == STRUCTURE_SPAWN && structure.energy < structure.energyCapacity ||
        //             structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity);
        //         }
        //     });

        //     if(target) {
        //         if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
        //             creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
        //         }
        //     }
        // }
    }
};

module.exports = roleHarvester;