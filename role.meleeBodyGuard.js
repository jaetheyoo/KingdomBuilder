var roleMeleeBodyGuard = {

    /** @param {Creep} creep **/
    run: function(creep) {

        var target;
        var killCreeps = true;
        if (creep.memory.dismantle === true) {
            killCreeps = false;
        }
        if (killCreeps && creep.memory.guardPostFlag == 'snipeFlag2') {
            //console.log(Game.flags['snipeFlag2'].pos.findInRange(FIND_HOSTILE_CREEPS, 15))
            target = Game.flags['snipeFlag2'].pos.findInRange(FIND_HOSTILE_CREEPS, 15)[0];
            if (!target) {
                target = Game.flags['snipeFlag2'].pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: s => s.structureType == STRUCTURE_CONTAINER
                }); // FIND_HOSTILE_STRUCTURES
            }
        } else if (creep.memory.guardPostFlag == 'snipeFlag2') {
            target = Game.flags['snipeFlag2'].pos.findClosestByRange(FIND_STRUCTURES, {
                filter: s => s.structureType == STRUCTURE_CONTAINER
            }); // FIND_HOSTILE_STRUCTURES
        } else if (killCreeps && creep.memory.guardPostFlag != 'snipeFlag2' ){
            target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        }

        if(target) {
            //console.log('DIE' + target);
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
            if(creep.dismantle(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            creep.moveTo(Game.flags[creep.memory.guardPostFlag]);
            if (creep.pos.isEqualTo(Game.flags[creep.memory.guardPostFlag].pos)) {
                if (creep.memory.guardPostFlag == 'snipeFlag2'){
                    
                } else if (creep.memory.guardPostFlag == 'snipeFlag') {
                    creep.memory.guardPostFlag = 'snipeFlag2';
                } else if (creep.memory.guardPostFlag == 'guardPost2') {
                    creep.memory.guardPostFlag = 'guardPost1';
                } else {
                    creep.memory.guardPostFlag = 'guardPost2';
                }
            }
        }
    }
};

module.exports = roleMeleeBodyGuard;