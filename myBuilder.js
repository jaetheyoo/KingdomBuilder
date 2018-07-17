var speech = require('utils.speech')
var base = require('role.base');

var roleBuilder = {
    /** @param {Creep} creep 
     *  @param {Village} village 
     * **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }

        /*
         * if I have nothing to build:
         *      do I have no energy? 
         *          Y > get energy
         *      am I at max energy?
         *          Y > build
         * 
         *      do I have a project I was building? 
         *          Y > continue working on that
         *      do I need to repair something?
         *          Y > repair
         *      is there something to build?
         *          Y > store construction site in memory
         *      
         *      if there's nothing to do in this room, go to the next room in my village's domain
         * 
         * 
         *      TODO: if I'm under attack, repair the ramparts/walls
         */

        if (creep.carry.energy == 0) {
            creep.memory.building = false;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.building = true;
        }

        if (creep.memory.building) {
            creep.emote('builder', speech.BUILD)

            let buildTarget = creep.memory.buildTarget;
        
            if (buildTarget) {
                creep.buildMove(buildTarget);
                //return;
            }
            //console.log('SHOULD REPAIR: ' + creep.name);
            if (village.shouldRepair(creep.room.name)) {
                village.creeps[creep.name].role = 'repairer';
                return;
            }
            let constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (constructionSite) {
                creep.memory.buildTarget = constructionSite.id;
                creep.buildMove(constructionSite.id);
                return;
            } else {
                
                let myCreepRemoteRoom = creep.room.name;
                if (creep.memory.remoteRoom) {
                    if (creep.room.name != creep.memory.remoteRoom) {
                        creep.moveTo(Game.flags[creep.memory.remoteRoom], {visualizePathStyle: {stroke: '#ffffff'}});
                        return;
                    }
                    myCreepRemoteRoom = creep.memory.remoteRoom;
                }
                let remoteRoom = village.getNextRemoteRoomName(myCreepRemoteRoom);
                
                
                // console.log(creep.name + '| moveTo' + remoteRoom + '| Current room: ' + creep.room.name);
                if (remoteRoom) {
                    creep.memory.remoteRoom = remoteRoom;
                    creep.moveTo(Game.flags[remoteRoom], {visualizePathStyle: {stroke: '#ffffff'}});
                }
            }
        } else {
            creep.emote('builder', speech.REFILL)

            if (village.inRemoteRoom(creep.room.name)) {
                //console.log("GOTTA GET OUTA HERE")
                creep.moveTo(village.spawns[0]) // TODO: is it worth looking for a container in the curent room?
            } else {
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => {
                        return ((s.structureType == STRUCTURE_STORAGE) &&
                            s.store[RESOURCE_ENERGY] >= creep.carryCapacity);
                    }
                });
                
                if (!target) {
                    target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (s) => {
                            return ((s.structureType == STRUCTURE_CONTAINER) &&
                                s.store[RESOURCE_ENERGY] >= creep.carryCapacity);
                        }
                    });
                }

                if (!target && village.spawns[0].energy >= creep.carryCapacity) {
                    target = village.spawns[0];
                }
                if (target) {
                    creep.withdrawMove(target);
                } else {
                    creep.moveTo(village.flags['refuelWaitingZone']);
                }
            }
        }
    }
};

module.exports = roleBuilder;