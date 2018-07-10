var roleManualAttack = {

    /** @param {Creep} creep **/
    run: function(creep) {
        flag = Game.flags[creep.memory.flag];
        if (flag && !creep.pos.isEqualTo(flag.pos)) {
            creep.moveTo(flag)
        } else {
            var targets = creep.pos.findInRange(FIND_HOSTILE_STRUCTURES, 3);
            if(targets.length > 0) {
                creep.rangedAttack(targets[0]);
            } else {
                target = creep.pos.findInRange(FIND_HOSTILE_CREEPS,3);
                if(targets.length > 0) {
                    creep.rangedAttack(targets[0])
                }
            }
        }
    }
};

module.exports = roleManualAttack;