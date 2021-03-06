var roleRemoteBodyguard = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (creep.getActiveBodyparts(HEAL) > 0) {
            let healTarget = creep.pos.findInRange(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
            }});
                    
            if(healTarget) {
                if(creep.heal(healTarget) == ERR_NOT_IN_RANGE) {
                    creep.rangedHeal(healTarget);
                }
            }
        }
        
        let remoteRoom = creep.memory.newRemoteRoom;
        if (!remoteRoom) {
            remoteRoom = village.creeps[creep.name].myRemoteRoom;
        }
        let flag = Game.flags[remoteRoom];
        if (!flag) {
            return;
        }
                
        if (creep.memory.attackTarget) {
            creep.emote('remoteBodyguard',CREEP_SPEECH.ATTACKING);
            let enemy = Game.getObjectById(creep.memory.attackTarget);
            if (enemy) {
                if (creep.rangedAttack(enemy)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy);
                } else if (enemy.getActiveBodyparts(ATTACK) > 0) {
                    let ret = PathFinder.search(creep.pos, {pos: enemy.pos, range: 3}, {flee:true});
                    let nextPos = ret.path[0];
                    creep.move(creep.pos.getDirectionTo(nextPos));
                } else {
                    creep.moveTo(enemy);
                }
                creep.attack(enemy);
                return;
            } else {
                delete creep.memory.attackTarget;
            }
            
        }

        if (!flag.room || !creep.pos.isEqualTo(flag.pos)) {
            creep.emote('remoteBodyguard',CREEP_SPEECH.REMOTEMOVING);
            creep.moveTo(flag);
        }
        const targets = creep.pos.findInRange(FIND_HOSTILE_CREEPS, 3);
        if(targets.length > 1) {
            creep.rangedMassAttack();
            return;
        }
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS, {
            filter: 
                x => !ALLIES.usernames.includes(x.owner.username)
        });
        if(target) {
            creep.memory.attackTarget = target.id;
            creep.emote('remoteBodyguard',CREEP_SPEECH.ATTACKING);
            if(creep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                if (creep.rangedAttack(enemy)==ERR_NOT_IN_RANGE) {
                    creep.moveTo(enemy);
                } else {
                    let ret = PathFinder.search(creep.pos, {pos: enemy.pos, range: 3}, {flee:true});
                    let nextPos = ret.path[0];
                    creep.move(creep.pos.getDirectionTo(nextPos));
                }
            }
        } else {
            creep.emote('remoteBodyguard', CREEP_SPEECH.PATROL);
            if (village.remoteRooms[creep.room.name]) {
                village.remoteRooms[creep.room.name].underAttack = false;    
            }
            
            for (let attackedRoom in village.remoteRooms) {
                if (village.remoteRooms[attackedRoom].underAttack) {
                    creep.memory.newRemoteRoom = attackedRoom;
                    return;
                }
            }
        }
    }
}

module.exports = roleRemoteBodyguard;