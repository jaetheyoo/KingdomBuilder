var speech = require('utils.speech')
var base = require('role.base');

var roleDefenseContractor = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }

        village.debugMessage.append(`\t\t\t${creep.name} is running role Defense Contractor`);

        if(creep.carry.energy == 0) {
            creep.emote('defenseContractor', speech.REFILL)

            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return ((s.structureType == STRUCTURE_STORAGE) &&
                        s.store[RESOURCE_ENERGY] >= creep.carryCapacity);
                }
            });
            if (!target && !creep.scavenge(true) && village.spawns[0].energy >= creep.carryCapacity) {
                target = village.spawns[0];
                village.debugMessage.append(`\t\t\t\t[REFILL]: found no places to fill up, moving to home village spawn: ${target.name}`);
            }
            if (target) {
                village.debugMessage.append(`\t\t\t\t[REFILL]: withdrawing from ${target.name ? target.name : target.structureType + ' with id: ' + target.id}`);
                creep.withdrawMove(target);
            } else  {
                //creep.moveTo(village.flags['refuelWaitingZone'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            if (!creep.memory.thresold) {
                creep.memory.thresold = 0;
            }
            creep.emote('defenseContractor', speech.REPAIR)
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object){
                    return (object.structureType == STRUCTURE_WALL && object.hits < object.hitsMax && object.hits < 100000 + creep.memory.thresold ||
                        object.structureType == STRUCTURE_WALL && object.hits < object.hitsMax && object.hits < 100000 + creep.memory.thresold);
                } 
            });
            
            if (!target) {
                creep.memory.thresold += 10000;
            }
            
            if(target) {
                // creep.park(target.pos);
                village.debugMessage.append(`\t\t\t\t[REPAIR]: repairing ${target.structureType} with id ${target.id}`);
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleDefenseContractor;