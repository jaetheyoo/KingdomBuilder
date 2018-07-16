var speech = require('utils.speech')
var base = require('role.base');

var roleRemoteBodyguard = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        
        let flag = Game.flags[village.creeps[creep.name].myRemoteRoom];
        if (!flag.room || !creep.pos.isEqualTo(flag.pos)) {
            creep.emote('meleeBodyguard',speech.REMOTEMOVING);
            creep.moveTo(flag);
        }
        
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            creep.emote('meleeBodyguard',speech.ATTACKING);
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target)
            }
        }
    }
}

module.exports = roleRemoteBodyguard;