var roleScavenger = {
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
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

        if (creep.memory.scavenge) {
            if (creep.scavenge()) { 
                return;
            }
            creep.emote('scavenger', CREEP_SPEECH.WITHDRAW)
            let miningContainers = village.getDropContainers();
            //console.log(creep.name + ' | '+miningContainers);
            if (miningContainers.length > 1) {
                miningContainers = miningContainers.filter(x => x.store.energy > 100)
                .sort((x,y) =>y.store[RESOURCE_ENERGY] - x.store[RESOURCE_ENERGY]);
            } 
            //console.log('Scavenger mining containers for withdraw: ' + miningContainers)
            if (miningContainers.length > 0) {
                creep.withdrawMove(miningContainers[0]);
            } else {
                if (village.room.storage && village.room.storage.store.energy > 0 && village.getAvailableEnergyForSpawning() < village.getMaximumEnergyForSpawning()/2) {
                    creep.withdrawMove(village.room.storage);    
                }
                //console.log(creep.name + ' | No containers found' )
            }
        } else {
            creep.emote('scavenger', CREEP_SPEECH.DROPOFF);
            if (Object.keys(creep.carry).length > 1) {
                let storage = village.room.storage;
                if (storage) {
                    creep.transferMove(storage);
                    return;
                } else {
                    // TODO: do something meaningful here
                    //throw new Error(`ERROR: ${creep.name} failed to find dropoff for minerals while Scavenging`);
                }
            }
            let transferTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: structure => structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity
                });
            if (!transferTarget) {
                transferTarget = Game.spawns[village.spawnNames.find(x=>Game.spawns[x].energy < Game.spawns[x].energyCapacity)];
                if (!transferTarget) {
                    transferTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                        filter: structure => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
                    });
                    if (!transferTarget) {
                        transferTarget = village.room.storage;
                    }
                }
            }
            //console.log(`\t\t\t\t${creep.name} transferring to ${transferTarget}`);
            village.debugMessage.append(`\t\t\t\t${creep.name} transferring to ${transferTarget}`);
            creep.transferMove(transferTarget, RESOURCE_ENERGY);
        }
    }
};

module.exports = roleScavenger;