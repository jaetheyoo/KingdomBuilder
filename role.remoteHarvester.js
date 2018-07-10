var roleRemoteHarvester = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const MINING_TIME = 64;
        const TRAVEL_TO_BASE_TIME = 49;
        let harvestFlag = creep.memory.harvestFlag ? Game.flags[creep.memory.harvestFlag] : Game.flags['RemoteSource0'];
        targets = [harvestFlag];
        if(creep.carry.energy < creep.carryCapacity && creep.ticksToLive >= (MINING_TIME + TRAVEL_TO_BASE_TIME*2)) {
            if (harvestFlag.room && harvestFlag.pos.findClosestByRange(FIND_HOSTILE_CREEPS)) {
                creep.moveTo(Game.flags['DefenseWaiting']);
                creep.say('AHHHH');
            } else if (creep.pos.findInRange(targets, 2).length == 0) {
                creep.moveTo(harvestFlag, {visualizePathStyle: {stroke: '#ffffff'}});    
            } else {
                var source = creep.pos.findClosestByRange(FIND_SOURCES);
                if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
                    if (creep.room == source.room && creep.room.lookAt(Game.flags['RemoteSource0'].pos).filter(x=>x.type=='creep').length) {
                        creep.moveTo(Game.flags['Remote1Wait'],{visualizePathStyle: {stroke: '#ffffff'}});
                    } else {
                        creep.moveTo(source);
                    }
                }
            }
        } else if (creep.carry.energy == 0 && creep.ticksToLive < (MINING_TIME + TRAVEL_TO_BASE_TIME*2)) {
            creep.moveTo(Game.spawns['Spawn1']);
            Game.spawns['Spawn1'].recycleCreep(creep)
        } else {
            let flag = creep.memory.dropOffFlag? Game.flags[creep.memory.dropOffFlag] : Game.flags['RemoteDropOff'];
            let miningContainer = flag.pos.findInRange(FIND_STRUCTURES,1, {
                filter: (structure) => {
                    return (((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && 
                        structure.store[RESOURCE_ENERGY] < structure.storeCapacity) || (structure.structureType == STRUCTURE_LINK && 
                        structure.energy < structure.energyCapacity));
                }
            })[0];
            if (miningContainer) {
                if(creep.transfer(miningContainer, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(miningContainer, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                var target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ( structure.structureType == STRUCTURE_STORAGE) && structure.energy < structure.energyCapacity;
                    }
                });
    
                if(target) {
                    console.log('sdf')
                    if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                    }
                } else {
                    creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        }
    }
};

module.exports = roleRemoteHarvester;