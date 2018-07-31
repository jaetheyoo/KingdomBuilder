var roleCattle = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
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
                    //console.log(c.memory.role)
                    return c.memory.role == "colonizer" || c.memory.role == "missionary";
                }
            }).sort((x,y) => {
                //console.log(x);
                //console.log(y);

                if (!x.memory.cattle) {
                    x.memory.cattle = [];
                }     
                if (!y) {
                    return 1;
                }
                if (!y.memory.cattle) {
                    y.memory.cattle = [];
                }
                return x.memory.length - y.memory.length;
            })[0];
            if (myHerder) {
                //console.log('herder' + myHerder)
                if (myHerder) {
                    if (!myHerder.memory.cattle) {
                        myHerder.memory.cattle = [];
                    }
                    myHerder.memory.cattle.push(creep.name);
                    creep.memory.herder = myHerder.name;
                }
            }
        }
        let herder = Game.creeps[creep.memory.herder];
        if (!creep.pos.isNearTo(herder)) {
            creep.moveTo(herder);
        }
    }
};

module.exports = roleCattle;