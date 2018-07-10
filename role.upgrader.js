var roleUpgrader = {

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
                if(creep.upgradeController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
            else {
                targets = Game.flags['RemoteDropOff'].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && 
                            structure.store[RESOURCE_ENERGY] > 0);
                    }
                });
                if (targets) {
                    if(creep.withdraw(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    creep.moveTo(Game.flags['UpgraderWaitingZone'], {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            }
        } catch (err) {
            console.log(err);
        }
    }
};

module.exports = roleUpgrader;