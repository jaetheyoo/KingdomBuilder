var roleMyRemoteHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }
        if (creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        }
        if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }

        if (creep.memory.harvesting) {
            let mySource = village.getSource(creep.name);
            if (mySource) {
                let mySourceObj = Game.getObjectById(mySource);
                if (creep.harvest(mySourceObj) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.getObjectById(mySource));
                }
            }
        } else {
            creep.emote('harvester', CREEP_SPEECH.DROPOFF)
            // go to dropoff location
            // TODO: if CPU is an issue, access these in memory
            let target = village.getEmptySpawn();
            if (!target) {
                target = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: (structure) => {
                        return (structure.structureType == STRUCTURE_EXTENSION && structure.energy < structure.energyCapacity);
                    }
                });
            }

            if(target) {
                creep.transferMove(target);
            }
        }
    }
};

module.exports = roleMyRemoteHarvester;