var roleRemoteClaimer = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }
        
        if (creep.memory.controller) {
            if(creep.reserveController(Game.getObjectById(creep.memory.controller)) == ERR_NOT_IN_RANGE) {
                creep.moveTo(Game.getObjectById(creep.memory.controller));
                return;
            }
        }
        
        let flag = Game.flags[village.creeps[creep.name].myRemoteRoom];
        if (!flag.room || creep.room != flag.room) {
            creep.emote('claimer',CREEP_SPEECH.REMOTEMOVING);
            creep.moveTo(flag);
        } else {
            if(creep.room.controller) {
                creep.memory.controller = creep.room.controller.id;
                creep.emote('claimer',CREEP_SPEECH.CLAIMING);
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(creep.room.controller);
                }
            }
        }
    }
};

module.exports = roleRemoteClaimer;