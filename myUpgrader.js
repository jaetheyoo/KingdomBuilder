var roleUpgrader = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }
        //console.log(`${creep.name} -- Upgrading: ${creep.memory.upgrading}`);
        if (creep.memory.getBoosted && creep.memory.getBoosted.length > 0) {
            if (creep.memory.lab) {
                let myLab = Game.getObjectById(creep.memory.lab);
                let status = myLab.boostCreep(creep);
                switch (status) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(myLab);
                        return;
                    case OK:
                        creep.memory.getBoosted.shift();
                        delete creep.memory.lab
                        return;
                    case ERR_NOT_ENOUGH_RESOURCES:
                        // Failed cause not enough minerals or energy
                        // TODO: create request to fill it up
                        //delete creep.memory.getBoosted;
                        return;
                }
            } else {
                if (village.labs && village.labs.reagentLabs) {
                    let labs = village.labs.reagentLabs;
                    for (l in labs) {
                        if (labs[l] == creep.memory.getBoosted[0]) {
                            creep.memory.lab = l;
                            creep.moveTo(Game.getObjectById(l));
                            return;
                        }
                    }
                }

                // no lab found
                delete creep.memory.getBoosted;
            }
        }

        if(creep.carry.energy == 0) {
            creep.memory.upgrading = false;
        }
        if(creep.carry.energy >= creep.carryCapacity*.95) {
            creep.memory.upgrading = true;
        }

        if(creep.memory.upgrading) {
            creep.emote('upgrader', CREEP_SPEECH.UPGRADE)
            const upgradeSpot = village.memoryAddr.flags['upgradeSpot'];
            creep.upgradeController(village.controller);
            if (upgradeSpot) {
                const upgradeSpotFlag = Game.flags[upgradeSpot];
                if (upgradeSpotFlag && !creep.pos.inRangeTo(Game.flags[upgradeSpot].pos,1)) {
                    creep.moveTo(upgradeSpotFlag, {visualizePathStyle: {stroke: '#ffffff'}});
                    return;
                }
            }
            if (!creep.pos.inRangeTo(village.controller,1)) {
                creep.moveTo(village.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            }
        } else {
            creep.emote('upgrader', CREEP_SPEECH.REFILL)
            if (village.upgradeLinkHasEnergy(creep.carryCapacity)) {
                creep.withdrawMove(village.upgradeLinkObj);
                return;
            }
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