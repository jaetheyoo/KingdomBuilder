


var roleRemoteRepairer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }

        village.debugMessage.append(`\t\t\t${creep.name} is running role RemoteReporter`);

        if(creep.carry.energy == 0) {
            creep.emote('remoteRepairer', CREEP_SPEECH.REFILL)

            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (s) => {
                    return ((s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) &&
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
            creep.emote('remoteRepairer', CREEP_SPEECH.REPAIR)
            let myRoomName = village.creeps[creep.name].myRemoteRoom;
            // console.log(creep.name + ' > ' + myRoomName)
            village.debugMessage.append(`\t\t\t\t[REPAIR]: remote room set to ${myRoomName}`);

            if (!Game.rooms[myRoomName] || creep.room.name != myRoomName) {
                village.debugMessage.append(`\t\t\t\t[REPAIR]: currently in ${ creep.room.name}; moving to ${myRoomName}`);
                creep.moveTo(Game.flags[myRoomName], {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object){
                    return (object.structureType == STRUCTURE_CONTAINER && object.hits < object.hitsMax && object.hits < 230000);
                } 
            });
            
            if (!target) {
                target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(object){
                        return (object.structureType == STRUCTURE_ROAD && object.hits/object.hitsMax <= .9) ||
                    (object.structureType != STRUCTURE_ROAD && object.hits < object.hitsMax && object.hits < 150000);
                    } 
                });
            }
            
            if(target) {
                // creep.park(target.pos);
                village.debugMessage.append(`\t\t\t\t[REPAIR]: repairing ${target.structureType} with id ${target.id}`);
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else {
                let constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
                if (constructionSite) {
                    creep.memory.buildTarget = constructionSite.id;
                    creep.buildMove(constructionSite.id);
                    return;
                }
                village.debugMessage.append(`\t\t\t\t[REPAIR]: found nothing to repair`);
                creep.moveTo(Game.flags[myRoomName], {visualizePathStyle: {stroke: '#ffffff'}});
                village.setShouldNotRepair(creep.room);
            }
        }
    }
};

module.exports = roleRemoteRepairer;