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

            if (!village.storage && !creep.scavenge(true) && village.spawns[0].energy >= creep.carryCapacity) {
                target = village.spawns[0];
                village.debugMessage.append(`\t\t\t\t[REFILL]: found no places to fill up, moving to home village spawn: ${target.name}`);
            }
            if (village.storage) {
                creep.withdrawMove(village.storage);
            } else  {
                //creep.moveTo(village.flags['refuelWaitingZone'], {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            if (creep.memory.repairTarget) {
                let myRepairTarget = Game.getObjectById(creep.memory.repairTarget);
                if (myRepairTarget.hits < myRepairTarget.hitsMax && myRepairTarget.hits < 10000 + creep.memory.threshold) {
                    creep.repair(myRepairTarget);
                    if (!creep.pos.inRangeTo(myRepairTarget),1) {
                        creep.moveTo(myRepairTarget);
                    }
                    return;
                } else {
                    delete creep.memory.repairTarget;
                }
            }
            
            if (!creep.memory.thresold) {
                creep.memory.thresold = 0;
            }
            creep.emote('defenseContractor', speech.REPAIR)
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object){
                    return (object.structureType == STRUCTURE_WALL && object.hits < object.hitsMax && object.hits < 100000 + creep.memory.thresold ||
                        object.structureType == STRUCTURE_RAMPART && object.hits < object.hitsMax && object.hits < 100000 + creep.memory.thresold);
                } 
            });
            
            if (!target) {
                creep.memory.thresold += 10000;
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(object){
                        return 
                            (object.structureType == STRUCTURE_WALL && object.hits < object.hitsMax && object.hits < 100000 + creep.memory.thresold ||
                            object.structureType == STRUCTURE_RAMPART && object.hits < object.hitsMax && object.hits < 100000 + creep.memory.thresold);
                    } 
                });
            }
            
            if(target) {
                village.debugMessage.append(`\t\t\t\t[REPAIR]: repairing ${target.structureType} with id ${target.id}`);
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
                creep.memory.repairTarget = target.id;
            }
        }
    }
};

module.exports = roleDefenseContractor;