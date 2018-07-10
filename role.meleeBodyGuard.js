var roleMeleeBodyGuard = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            creep.moveTo(Game.flags[creep.memory.guardPostFlag]);
            if (creep.pos.isEqualTo(Game.flags[creep.memory.guardPostFlag].pos)) {
                if (creep.memory.guardPostFlag == 'guardPost2') {
                    creep.memory.guardPostFlag = 'guardPost1'
                } else {
                    creep.memory.guardPostFlag = 'guardPost2'
                }
            }
        }
    }
};

module.exports = roleMeleeBodyGuard;