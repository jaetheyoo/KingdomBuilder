var roleScout = {

    /** @param {Creep} creep **/
    run: function(creep) {
        const target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            creep.moveTo(Game.flags[creep.memory.scoutFlag]);
            if (creep.pos.isEqualTo(Game.flags[creep.memory.scoutFlag].pos) && !creep.memory.endTime) {
                creep.memory.endTime = creep.ticksToLive;
            }
        }
    }
};

module.exports = roleScout;