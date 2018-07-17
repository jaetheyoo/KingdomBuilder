var speech = require('utils.speech')
var base = require('role.base');

var roleRemoteClaimer = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }
        
        if (creep.memory.controller) {
            if(creep.reserveController(Game.getObjectById(creep.memory.controller)) == ERR_NOT_IN_RANGE) {
<<<<<<< HEAD
                creep.moveTo(creep.room.controller, {swampCost: 1});
                return;
            }
=======
                creep.moveTo(creep.room.controller);
            }
            return;
>>>>>>> 4c1586e4c32c5c1608432d8719147a86238c19a9
        }
        
        let flag = Game.flags[village.creeps[creep.name].myRemoteRoom];
        if (!flag.room || creep.room != flag.room) {
            creep.emote('claimer',speech.REMOTEMOVING);
<<<<<<< HEAD
            creep.moveTo(flag,{swampCost:1});
=======
            creep.moveTo(flag);
>>>>>>> 4c1586e4c32c5c1608432d8719147a86238c19a9
        } else {
            if(creep.room.controller) {
                creep.memory.controller = creep.room.controller.id;
                creep.emote('claimer',speech.CLAIMING);
                if(creep.reserveController(creep.room.controller) == ERR_NOT_IN_RANGE) {
<<<<<<< HEAD
                    creep.moveTo(creep.room.controller,{swampCost:1});
=======
                    creep.moveTo(creep.room.controller);
>>>>>>> 4c1586e4c32c5c1608432d8719147a86238c19a9
                }
            }
        }
    }
};

module.exports = roleRemoteClaimer;