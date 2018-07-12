var speech = require('utils.speech')
var base = require('role.base');

var roleScavenger = {
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }

        /**
         * Am I carrying any minerals? 
         *  Y > drop them off
         * Am I maxed out on energy?
         *  drop off at closest spawn, extensions > then drop off at containers and storage
         * Do I have 0 energy? 
         *  Y > set to scavenge for dropped resources > tombstones > drop containers > storage
         */

        if (_.sum(creep.carry) == 0) {
            creep.memory.scavenge = true;
        } else if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.scavenge = false;
        }

        if (creep.memory.scavenge && !creep.scavenge()) {
            creep.emote('scavenger', WITHDRAW)
            let miningContainers = village.getDropContainers()
                .filter(x => x.store.energy > 0)
                .sort((x,y) => y.store[RESOURCE_ENERGY] - x.store[RESOURCE_ENERGY]);
            if (miningContainers.length > 0) {
                creep.withdrawMove(miningContainers[0]);
            } else {
                creep.withdrawMove(village.room.storage);
            }
        } else {
            creep.emote('scavenger', DROPOFF);
            if (Object.key(creep.carry).length > 1) {
                let storage = village.room.storage;
                if (storage) {
                    creep.transferMove(storage);
                    return;
                } else {
                    // TODO: do something meaningful here
                    throw new Error(`ERROR: ${creep.name} failed to find dropoff for minerals while Scavenging`);
                }
            } else {
                let transferTarget;
                if (village.spawn.energy < village.spawn.energyCapacity) {
                    transferTarget = village.spawn;
                } else {
                    transferTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: structure => structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity
                    });
                    if (!transferTarget) {
                        transferTarget = village.room.storage;
                    }
                }
                creep.transferMove(transferTarget, RESOURCE_ENERGY);
            }
        }
    }
};

module.exports = roleScavenger;