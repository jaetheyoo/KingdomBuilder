var roleColonizer = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
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

        if (creep.memory.harvesting) {
            if (creep.carry.energy == creep.carryCapacity) {
                creep.memory.harvesting = false;
                return;
            }
            if (!creep.memory.sourceId) {
                creep.memory.sourceId = creep.pos.findClosestByRange(FIND_SOURCES_ACTIVE).id;
            }
            const source = Game.getObjectById(creep.memory.sourceId);
            if (source) {
                let status = creep.harvest(source);
                switch (status) {
                    case ERR_NOT_IN_RANGE: 
                        creep.moveTo(source);
                        break;
                    case ERR_NOT_ENOUGH_RESOURCES:
                        delete creep.memory.sourceId;
                        break;
                }
                return;
            }

        }

        if (creep.carry.energy == 0) {
            if (creep.room.storage && creep.room.storage.store[RESOURCE_ENERGY] >= creep.carryCapacity) {
                creep.withdrawMove(creep.room.storage);
                return;
            }
            if (creep.memory.cattle && creep.memory.cattle.length > 0) {
                let cattle = creep.memory.cattle[creep.memory.cattle.length - 1];
                if (cattle) {
                    let cattleObj = Game.creeps[cattle];
                    if (this.harvestCattle(creep, cattleObj) != -1){
                        return;
                    }
                }
            }
            
            creep.memory.harvesting = true;
        }
        
        let flag = Game.flags[village.colonization.civFlag];
        if (!flag.room || creep.room != flag.room) {
            creep.emote('colonizer',CREEP_SPEECH.REMOTEMOVING);
            creep.moveTo(flag);
            return;
        }

        if (!creep.memory.constructionSite) {
            let constructionSite = creep.pos.findClosestByRange(FIND_MY_CONSTRUCTION_SITES); 
            if (constructionSite) {
                creep.memory.constructionSite = constructionSite.id;
            } else {
                return;
            }
        }
        
        let site = Game.getObjectById(creep.memory.constructionSite);
        if (!site) {
            delete creep.memory.constructionSite;
            return;
        }
        let status = creep.build(site);
        switch (status) {
            case ERR_NOT_IN_RANGE: 
                creep.moveTo(site);
                return;
        }
    },
    harvestCattle(creep, cattleObj) {
        if (!creep.pos.isNearTo(cattleObj.pos)) {
            cattleObj.moveTo(creep.pos);
            return -1;
        }
        let pos = cattleObj.pos;
        cattleObj.drop(RESOURCE_ENERGY);
        let droppedEnergy = creep.room.lookForAt(LOOK_RESOURCES, pos)[0];
        let status = creep.pickup(droppedEnergy);
        switch(status) {
            case 0: 
                creep.memory.cattle.pop();
                delete cattleObj.memory.herder;
                break;
        }
    }
};

module.exports = roleColonizer;