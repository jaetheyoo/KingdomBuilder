var roleCattle = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }
        if (creep.carry.energy==0) {
            if (!creep.memory.storage) {
                if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                    creep.memory.storage =creep.room.storage.id;
                } else {
                    return;
                }
            }
            
            let storage = Game.getObjectById(creep.memory.storage);
            creep.withdrawMove(storage);
            return;
        }

        let flag = Game.flags[village.colonization.civFlag];
        if (!flag.room || creep.room != flag.room) {
            creep.emote('conquerer',CREEP_SPEECH.REMOTEMOVING);
            creep.moveTo(flag);
            return;
        }

        if (!creep.memory.herder) {
            let myHerder = creep.room.find(FIND_MY_CREEPS, {
                filter: function(c) {
                    return c.memory.role == "colonizer" || c.memory.role == "missionary";
                }
            }).sort((x,y) => {
                if (!x.memory.cattle) {
                    x.memory.cattle = [];
                }                
                if (!y.memory.cattle) {
                    y.memory.cattle = [];
                }
                return x.memory.length - y.memory.length;
            })
            if (myHerder) {
                myHerder.memory.cattle.push(creep.name);
            }
        }
        let herder = Game.creeps[creep.memory.herder];
        if (!creep.pos.isNear(herder)) {
            creep.moveTo(herder);
        }
    }
};

module.exports = roleCattle;