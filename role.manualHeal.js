var roleManualHeal = {

    /** @param {Creep} creep **/
    run: function(creep) {
        flag = Game.flags[creep.memory.flag];
        
        if (creep.hits < creep.hitsMax) {
            creep.moveTo(Game.flags['retreat'])
            var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.hits < object.hitsMax;
                }
            });
            if(target) {
                //creep.moveTo(target);
                if(creep.pos.isNearTo(target)) {
                    creep.heal(target);
                }
                else {
                    creep.rangedHeal(target);
                }
            }
            return;
        }
        
        if (flag && !creep.pos.isEqualTo(flag.pos)) {
            creep.moveTo(flag)
        } else {
           
        }

        var target = creep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        if(target) {
            //creep.moveTo(target);
            if(creep.pos.isNearTo(target)) {
                creep.heal(target);
            }
            else {
                creep.rangedHeal(target);
            }
        }
    }
};

module.exports = roleManualHeal;