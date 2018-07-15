var speech = require('utils.speech')
var base = require('role.base');

var roleHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }
        // walk miner
        const mySource = village.getSource(creep.name);
        
        //console.log(`${creep.name} -- mySource: ${mySource}`)
        if (creep.carry.energy == 0) {
            creep.memory.harvesting = true;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.harvesting = false;
        }
        
        if (creep.memory.harvesting) {
            creep.emote('harvester', speech.HARVEST)
            // go to source
            if(creep.harvest(mySource) == ERR_NOT_IN_RANGE) {
                creep.moveTo(mySource, {visualizePathStyle: {stroke: '#ffaa00'}});
            }
        } else {
            creep.emote('harvester', speech.DROPOFF)
            // go to dropoff location
            // TODO: if CPU is an issue, access these in memory
            let target = village.getEmptySpawns;
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

module.exports = roleHarvester;