var speech = require('utils.speech');

var roleRemoteBuilder = {
    /** @param {Creep} creep **/
    run: function(creep, maxRepairers) {
        const BUILDING_THRESHOLD = 4000;
        const REMOTE_TRAVEL_TIME = 80;
        
        if(creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say(speech.REFILL);
        } else if(creep.carry.energy <= creep.carryCapacity) {
            creep.memory.building = true;
            creep.say(speech.BUILD);
        }
        
        if(creep.memory.building) {
            if (!Game.flags[creep.memory.searchFlag].room || creep.room != (Game.flags[creep.memory.searchFlag].room)){
                creep.moveTo(Game.flags[creep.memory.searchFlag]);
            } else {
                let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if(target != null) {
                    creep.say(speech.BUILD);
                    if(creep.build(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        } else {
            creep.say(speech.REFILL);
            var withdrawTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 550);
                }
            });
            if (withdrawTarget) {
                if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(withdrawTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                creep.memory.building = true;
                creep.moveTo(Game.flags['DefenseWaiting']);
            }
        }
    }
};

module.exports = roleRemoteBuilder;