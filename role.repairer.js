var roleRepairer = {

    /** @param {Creep} creep **/
    run: function(creep, maxRepairers) {
        const BUILDING_THRESHOLD = 150000;

        if(creep.carry.energy == 0) {
            creep.memory.role = 'builder';
        } else {
            //let mySearchFlag = Game.flags[creep.memory.room];
            //let searchTarget = mySearchFlag ? mySearchFlag : creep;
            if (creep.memory.moveTarget && Game.flags[creep.memory.moveTarget] && !creep.pos.isEqualTo(Game.flags[creep.memory.moveTarget].pos)) {
                creep.moveTo(Game.flags[creep.memory.moveTarget]);
            } else {
                creep.memory.moveTarget = null;
                let target = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(object){
                        return (object.structureType == STRUCTURE_ROAD && object.hits/object.hitsMax <= .9) ||
                        (object.structureType != STRUCTURE_ROAD && object.hits < object.hitsMax && object.hits < 150000);
                    } 
                });
                
                if(target) {
                    if(creep.repair(target) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(target);
                    }
                } else {
                    creep.memory.role = 'builder';
                    creep.say('🚧 build');
                }
            }
           
        }
    }
};

module.exports = roleRepairer;