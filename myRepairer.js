var speech = require('utils.speech')
var base = require('role.base');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }
        
        if(creep.carry.energy == 0) {
            village.creeps[creep.name].role = 'builder';
        } else {
            if (!village.shouldRepair(creep.room.name)) {
                village.creeps[creep.name].role = 'builder';
                return;
            }
            creep.emote('repairer', speech.REPAIR);
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object){
                    //console.log(creep.room.name)
                    //console.log(object + '|' + object.hits)
                    return (object.structureType == STRUCTURE_ROAD && object.hits/object.hitsMax <= .85) ||
                    (object.structureType != STRUCTURE_ROAD && object.hits < object.hitsMax && object.hits < 150000)||
                    (object.structureType == STRUCTURE_CONTAINER && object.hits < object.hitsMax && object.hits < 230000); // TODO: make this scale with village lv
                } 
            });
            //console.log(target)
            if(target) {
                // village.setShouldRepair(creep.room.name)
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                if (creep.memory.countdown <=0) {
                    creep.memory.countdown = 5;
                }
                creep.memory.countdown--;
                if (creep.memory.countdown == 1) {
                    village.creeps[creep.name].role = 'builder';
                    village.setShouldNotRepair(creep.room.name);  
                    creep.memory.countdown = 5;
                }
            }
        }
    }
};

module.exports = roleRepairer;