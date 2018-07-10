var speech = require('utils.speech');
var roleRemoteTransfer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        //creep.say('✈️🚌');
        const TRAVEL_TO_BASE_TIME = 49;
        if (!creep.memory.pickupFlag) {
            creep.memory.pickupFlag = 'Dropoff2';
        }
        if (!creep.memory.dropOffFlag) {
            creep.memory.dropOffFlag = 'RemoteDropOff';
        }

        let flag = Game.flags[creep.memory.pickupFlag];
        let dropOffFlag = Game.flags[creep.memory.dropOffFlag];
        
        if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive >= TRAVEL_TO_BASE_TIME) {
            let miningContainer = flag.pos.findInRange(FIND_STRUCTURES,3, {
                filter: (structure) => {
                    return (structure.structureType == STRUCTURE_CONTAINER);
                }
            });

            if (miningContainer.length > 0) {
                if(creep.withdraw(miningContainer[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(miningContainer[0], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else if (creep.ticksToLive < TRAVEL_TO_BASE_TIME) {
            //creep.say(OLD);
            creep.moveTo(Game.spawns['Spawn1']);
        } else {
            var targets = dropOffFlag.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (i) => i.structureType == STRUCTURE_STORAGE &&
                i.store[RESOURCE_ENERGY] < i.storeCapacity 
            });
            
            if (targets) {
                if(creep.transfer(targets, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(targets, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                targets = dropOffFlag.pos.findInRange(FIND_STRUCTURES, 8,{
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && 
                            structure.store[RESOURCE_ENERGY] < structure.storeCapacity);
                    }
                });
                if(targets) {
                    if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                }
            }
        }
    }
};

module.exports = roleRemoteTransfer;