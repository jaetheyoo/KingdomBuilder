var roleMissionary = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }

        if (creep.spawning) {
            return;
        }

        if (creep.memory.getBoosted.length > 0) {
            if (creep.memory.lab) {
                let myLab = Game.getObjectById(creep.memory.lab);
                let status = myLab.boostCreep(creep);
                switch (status) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(myLab);
                        return;
                    case OK:
                        creep.memory.getBoosted.shift();
                        delete creep.memory.lab
                        return;
                    case ERR_NOT_ENOUGH_RESOURCES:
                        // Failed cause not enough minerals or energy
                        // TODO: create request to fill it up
                        //delete creep.memory.getBoosted;
                        return;
                }
            } else {
                let labs = village.labs.reagentLabs;
                for (l in labs) {
                    if (labs[l] == creep.memory.getBoosted[0]) {
                        creep.memory.lab = l;
                        creep.moveTo(Game.getObjectById(l));
                        return;
                    }
                }
                // no lab found
                delete creep.memory.getBoosted;
            }
        }

        if (creep.carry.energy==0) {
            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                creep.moveWithdraw(creep.room.storage)
                return
            }
            if (creep.memory.cattle.length > 0) {
                let cattle = creep.memory.cattle[creep.memory.cattle.length - 1];
                if (cattle) {
                    let cattleObj = Game.creeps[cattle];
                    this.harvestCattle(creep, cattleObj);
                }
            }
        }
        
        let flag = Game.flags[village.colonization.civFlag];
        if (!flag.room || creep.room != flag.room) {
            creep.emote('missionary',CREEP_SPEECH.REMOTEMOVING);
            creep.moveTo(flag);
            return;
        }
        if (creep.upgradeController(creep.room.controller) == ERR_OUT_OF_RANGE) {
            creep.moveTo(creep.room.controller);
        }
    },
    harvestCattle(creep, cattleObj) {
        if (!creep.pos.isNearTo(cattleObj.pos)) {
            cattleObj.moveTo(creep.pos);
            return;
        }
        let pos = cattleObj.pos;
        cattleObj.drop(RESOURCE_ENERGY);
        let droppedEnergy = creep.room.lookForAt(LOOK_RESOURCES, pos);
        let status = creep.pickup(droppedEnergy);
        switch(status) {
            case 0: 
                creep.memory.cattle.pop();
                delete cattleObj.memory.herder;
                break;
        }
    }
};

module.exports = roleMissionary;