var speech = require('utils.speech')
var base = require('role.base');

var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }

        if(creep.carry.energy == 0) {
            creep.memory.role = 'builder';
        } else {
            creep.emote('repairer', speech.REPAIR);
            let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                filter: function(object){
                    return (object.structureType == STRUCTURE_ROAD && object.hits/object.hitsMax <= .9) ||
                    (object.structureType != STRUCTURE_ROAD && object.hits < object.hitsMax && object.hits < 150000)||
                    (object.structureType == STRUCTURE_CONTAINER && object.hits < object.hitsMax && object.hits < 230000); // TODO: make this scale with village lv
                } 
            });
            
            if(target) {
                village.setShouldRepair(creep.room)
                if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(target);
                }
            } else {
                creep.memory.role = 'builder';
                village.setShouldNotRepair(creep.room);
            }
        }
    }
};

module.exports = roleRepairer;