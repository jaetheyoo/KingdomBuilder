var roleDrainer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        drainFlag = Game.flags[creep.memory.drainFlag];
        healFlag = Game.flags[creep.memory.healFlag];
        if (creep.memory.draining && drainFlag && !creep.pos.isEqualTo(drainFlag.pos)) {
            creep.moveTo(drainFlag, {visualizePathStyle: {stroke: '#ffffff'}})
        } else {
           creep.memory.draining = false;
        }
        if (!creep.memory.draining) {
            if (creep.hits <= creep.hitsMax-300) {
                creep.moveTo(healFlag, {visualizePathStyle: {stroke: '#ffffff'}})
            } else if(creep.hits === creep.hitsMax) {
                creep.memory.draining = true;
            }
        }

        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        if(target) {
            if(creep.pos.isNearTo(target)) {
                creep.heal(target);
            }
        }
    }
};

module.exports = roleDrainer;