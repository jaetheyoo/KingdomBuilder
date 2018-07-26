var speech = require('utils.speech')
var base = require('role.base');

var roleUpgrader = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }
        //console.log(`${creep.name} -- Upgrading: ${creep.memory.upgrading}`);


        if(creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(creep.carry.energy == creep.carryCapacity) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            creep.emote('upgrader', speech.UPGRADE)
            const upgradeSpot = village.memoryAddr.flags['upgradeSpot'];
            if (upgradeSpot) {
                const upgradeSpotFlag = Game.flags[upgradeSpot];
                if (upgradeSpotFlag && !creep.pos.inRangeTo(Game.flags[upgradeSpot].pos,2)) {
                    creep.moveTo(Game.flags);
                    return;
                }
            }
            if (!creep.pos.inRangeTo(village.controller,1)) {
                creep.moveTo(village.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
            creep.upgradeController(village.controller);
        } else {
            creep.emote('upgrader', speech.REFILL)

            // TODO: create a generic find target method that finds structures by type
            if (village.storage && village.storage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                creep.withdrawMove(village.storage, RESOURCE_ENERGY);
            } else {
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER) && structure.store[RESOURCE_ENERGY] >= creep.carryCapacity);
                    }
                });
                if(target) {
                    creep.withdrawMove(target);
                } else {
                    target = village.spawns.find(x=>x.energy > 0);
                    if (target) {
                        creep.withdrawMove(target);
                    }
                }
            }
        }
    }
};

module.exports = roleUpgrader;