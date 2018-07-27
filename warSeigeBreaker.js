var warSeigeBreaker = {
    // Game.spawns['Spawn3'].spawnCreep(_([]).concat(_.times(6, TOUGH),_.times(MOVE,4),_.times(8,WORK),_.times(5,ATTACK)), 'SeigeBreaker',{role: warSeigeBreaker, memory:{getBoosted:['XGHO2','XZHO2','XZH2O'], seigeMode: true}})
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
                        delete creep.memory.getBoosted[0];
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
                delete creep.memory.getBoosted[0];
            }
        }

        if (creep.memory.seigeMode) {
            attackFlag = Game.flags[creep.memory.attackFlag];
            if (attackFlag && !creep.pos.isEqualTo(attackFlag.pos)) {
                creep.moveTo(attackFlag, {visualizePathStyle: {stroke: '#ffffff'}})
                return;
            }

            if (creep.memory.seigeTarget) {
                let target = Game.getObjectById(creep.memory.seigeTarget);
                if (!target) {
                    // target has been destroyed
                    creep.memory.seigeMode = false;
                    return;
                }
                creep.dismantle(target);
            } else {
                let target = creep.pos.findInRange(FIND_STRUCTURES, 1, {filter:(structure) => {
                    return structure.structureType == STRUCTURE_RAMPART;
                }}).sort((x,y) => {
                    return x.hits - y.hits;
                })[0];
                if (target) {
                    creep.memory.seigeTarget = target.id;
                    creep.dismantle(target);
                }
            }
        } else {
            let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(target) {
                creep.moveto(target);
                creep.attack(target);
            }
        }
    }
}

module.exports = warSeigeBreaker;