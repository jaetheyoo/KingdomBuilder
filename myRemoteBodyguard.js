var speech = require('utils.speech')
var base = require('role.base');

var roleRemoteBodyguard = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        let remoteRoom = village.creeps[creep.name].myRemoteRoom;
        let flag = Game.flags[remoteRoom];
        if (!flag) {
            return;
        }
        
        if (creep.memory.attackTarget) {
            creep.emote('meleeBodyguard',speech.ATTACKING);
            let enemy = Game.getObjectById(attackTarget);
            if (enemy) {
                creep.attack(enemy);
                creep.moveTo(enemy);
                return;    
            } else {
                delete creep.memory.attackTarget;
            }
        }
        
        if (!flag.room || !creep.pos.isEqualTo(flag.pos)) {
            creep.emote('meleeBodyguard',speech.REMOTEMOVING);
            creep.moveTo(flag);
        }
        
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            creep.memory.attackTarget = target.id;
            creep.emote('meleeBodyguard',speech.ATTACKING);
            if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                creep.moveTo(target);
            }
        } else {
            creep.emote('meleeBodyguard', speech.PATROL);
            village.remoteRooms[remoteRoom].underAttack = false;
        }
    }
}

module.exports = roleRemoteBodyguard;