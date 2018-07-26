var warDrainer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (creep.memory.getBoosted) {
            if (creep.memory.lab) {
                let myLab = Game.getObjectById(creep.memory.lab);
                let status = myLab.boostCreep(creep);
                switch (status) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(myLab);
                        return;
                    case OK:
                        delete creep.memory.getBoosted;
                        return;
                    case ERR_NOT_ENOUGH_RESOURCES:
                        // Failed cause not enough minerals or energy
                        // TODO: create request to fill it up
                        delete creep.memory.getBoosted;
                        return;
                }
            } else {
                let labs = village.labs.reagentLabs;
                for (l in labs) {
                    if (labs[l] == creep.memory.getBoosted) {
                        creep.memory.lab = l;
                        creep.moveTo(Game.getObjectById(l));
                        return;
                    }
                }
                // no lab found
                delete creep.memory.getBoosted;
            }
        }
        if (creep.getActiveBodyparts(HEAL) > 0) {
            console.log(creep.name)
            let healTarget = creep.pos.findInRange(FIND_MY_CREEPS, 50, {
                filter: function(object) {
                    return object.hits < object.hitsMax-150;
            }})[0];
            
            if(healTarget) {
                if(creep.heal(healTarget) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(healTarget);
                    creep.rangedHeal(healTarget);
                }
            }
        }

        
        attackFlag = Game.flags[creep.memory.attackFlag];
        healFlag = Game.flags[creep.memory.healFlag];
        if (creep.memory.attack && attackFlag && !creep.pos.isEqualTo(attackFlag.pos)) {
            creep.moveTo(attackFlag, {visualizePathStyle: {stroke: '#ffffff'}})
        }
        
        if (creep.hits <= creep.hitsMax - 500) {
            creep.memory.attack = false;
            creep.moveTo(healFlag,{visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }

        if (creep.hits === creep.hitsMax) {
            creep.memory.attack = true;
        }
        
        if (!creep.memory.attack) {
            creep.moveTo(healFlag,{visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }
        
        let target = creep.pos.findInRange(FIND_STRUCTURES,1,{filter:(structure) => {
            return structure.structureType == STRUCTURE_SPAWN;
        }})[0];
        if (target) {
            creep.attack(target);
            creep.dismantle(target)
        } else {
            target = creep.pos.findInRange(FIND_HOSTILE_CREEPS,20)[0];
            if(target) {
                creep.attack(target);
            }
        }
    }
}

module.exports = warDrainer;