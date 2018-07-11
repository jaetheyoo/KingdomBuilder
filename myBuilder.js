var speech = require('utils.speech')
var base = require('role.base');



var roleBuilder = {
    /** @param {Creep} creep **/
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

        let buildTarget = creep.memory.buildTarget;
        
        if (creep.memory.buildTarget) {
            creep.buildMove(buildTarget);
        }

        if (village.shouldRepair(creep.room)) {
            creep.role = 'repairer';
        }

        /////////////////////////////////////////////

        const BUILDING_THRESHOLD = 4000;
        const REMOTE_TRAVEL_TIME = 80;
        
        if(creep.carry.energy == 0) {
            creep.memory.building = false;
            creep.say(speech.REFILL);
        } else if(creep.carry.energy <= creep.carryCapacity) {
            if (!maxRepairers) {
                const target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: object => (object.structureType == STRUCTURE_ROAD && object.hits/object.hitsMax <= .75) ||
                    (object.structureType != STRUCTURE_ROAD && object.hits < object.hitsMax && object.hits < 100000)
                });
    
                if(target) {
                    creep.memory.role = 'repairer';
                    creep.memory.repairing = true;
                    creep.say(speech.REPAIR);
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                    return;
                }
            }
            creep.memory.building = true;
            creep.say(speech.BUILD);
        }
        
        if(creep.memory.building) {
            let target = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            if (creep.memory.searchFlag && Game.flags[creep.memory.searchFlag]) {
                target = Game.flags[creep.memory.searchFlag].pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
            }
            
            if(target != null) {
                creep.say(speech.BUILD);
                if(creep.build(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
                }
            } else if (creep.memory.moving) {
                if (Game.flags[creep.memory.moveTarget] && !creep.pos.isEqualTo(Game.flags[creep.memory.moveTarget].pos )) {
                    creep.moveTo(Game.flags[creep.memory.moveTarget], {visualizePathStyle: {stroke: '#ffffff'}});    
                } else {
                    creep.memory.moving = false;
                }
            } else if (creep.ticksToLive > REMOTE_TRAVEL_TIME) {
                if (creep.memory.room && creep.room != Game.flags[creep.memory.room].room) {
                    creep.memory.moving = true;
                    creep.memory.moveTarget = creep.memory.room;
                    creep.say(speech.REMOTEBUILD);
                    creep.moveTo(Game.flags[creep.memory.room]);
                } else if (creep.room && Game.flags['RemoteRoom'].room && creep.room.name == Game.flags['RemoteRoom'].room.name) {
                    creep.moveTo(Game.flags['Spawn1Room']);
                    creep.memory.moving = true;
                    creep.memory.moveTarget = 'SpawnRoomMid';
                } else if (creep.room && creep.room.name == 'W54N47') {
                    creep.moveTo(Game.flags['Spawn1Room']);
                } 
            } else {
                creep.say(speech.OLDBUILDER);
                creep.moveTo(Game.spawns['Spawn1']);
            }
        } else {
            creep.say(speech.REFILL);
            var withdrawTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: (structure) => {
                    return ((structure.structureType == STRUCTURE_CONTAINER && 
                        structure.store[RESOURCE_ENERGY] > 150) || 
                        (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 150));
                }
            });
            if (withdrawTarget) {
                if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(withdrawTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
                }
            } else {
                if (creep.memory.withdrawFlag && Game.flags[creep.memory.withdrawFlag]) {
                    withdrawTarget = Game.flags[creep.memory.withdrawFlag].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_CONTAINER && 
                            structure.store[RESOURCE_ENERGY] > 150) || 
                            (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 150));
                    }
                    });
                }

                if (withdrawTarget) {
                    if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(withdrawTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
                    }
                } else {
                    withdrawTarget = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: (structure) => {
                        return ((structure.structureType == STRUCTURE_SPAWN && 
                            structure.energy > 250) || 
                            (structure.structureType == STRUCTURE_STORAGE && structure.store[RESOURCE_ENERGY] > 150));
                    }
                    });
                    if (withdrawTarget) {
                        if(creep.withdraw(withdrawTarget, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                            creep.moveTo(withdrawTarget, {visualizePathStyle: {stroke: '#ffaa00'}});
                        }
                    }
                }
            }
        }
    }
};

module.exports = roleBuilder;