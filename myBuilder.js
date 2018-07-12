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

        if (creep.energy == 0) {
            creep.building = false;
        } else if (creep.energy == creep.carryCapacity) {
            creep.building = true;
        }

        if (creep.building) {
            creep.emote('builder', speech.BUILD)

            let buildTarget = creep.memory.buildTarget;
        
            if (creep.memory.buildTarget) {
                creep.buildMove(buildTarget);
                return;
            }
    
            if (village.shouldRepair(creep.room.name)) {
                creep.role = 'repairer';
                return;
            }
    
            let constructionSite = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (constructionSite) {
                creep.memory.buildTarget = constructionSite.id;
                creep.buildMove(buildTarget);
                return;
            } else {
                let remoteRoom = village.nextRemoteRoom(creep.room.name);
                if (remoteRoom) {
                    creep.moveTo(Game.rooms[remoteRoom]);
                }
            }
        } else {
            creep.emote('builder', speech.REFILL)

            if (village.inRemoteRoom(creep)) {
                creep.moveTo(village.spawn)
            } else {
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (s) => {
                        return ((s.structureType == STRUCTURE_STORAGE || s.structureType == STRUCTURE_CONTAINER) &&
                            s.store[RESOURCE_ENERGY] >= creep.carryCapacity);
                    } 
                });
                if (!target && village.spawn.energy >= creep.carryCapacity) {
                    target = village.spawn;
                }
                if (target) {
                    if (creep.withdraw(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    creep.moveTo(village.flags['refuelWaitingZone']);
                }
            }
        }
    }
};

module.exports = roleBuilder;