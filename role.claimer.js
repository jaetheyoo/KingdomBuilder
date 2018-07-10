var roleClaimer = {

    /** @param {Creep} creep **/
    run: function(creep) {
        var flag;
        if (creep.memory.claimFlag) {
            flag = Game.flags[creep.memory.claimFlag] ? 
                Game.flags[creep.memory.claimFlag] : 
                Game.flags['SpawnRoomMid'];

            if (flag.room && creep.room == flag.room) {
                if(creep.room.controller) {
                    if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(creep.room.controller);
                    }
                }
            } else {
                creep.moveTo(flag);
            }
        }
    }
};

module.exports = roleClaimer;