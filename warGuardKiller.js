var warGuardKiller = {
    // Game.spawns['Spawn1'].spawnCreep(['tough','tough','tough','tough','tough','tough','tough','tough','tough','tough','tough','tough','tough','tough','tough','move','move','move','move','move','move','move','move','move','move','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack','attack'] , 'GuardKiller',{memory:{role: 'warGuardKiller', getBoosted:['XGHO2','XZHO2','XUH2O'], attackFlag:'attack'}});
    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (creep.spawning) {
            return;
        }
        if (creep.memory.getBoosted && creep.memory.getBoosted.length > 0) {
            if (creep.memory.lab) {
                let myLab = Game.getObjectById(creep.memory.lab);
                let status = myLab.boostCreep(creep);
                switch (status) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(myLab);
                        return;
                    case OK:
                        creep.memory.getBoosted.shift();
                        delete creep.memory.lab;
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
        attackFlag = Game.flags[creep.memory.attackFlag];
        if (attackFlag && !creep.pos.isEqualTo(attackFlag.pos)) {
            creep.moveTo(attackFlag, {visualizePathStyle: {stroke: '#ffffff'}})
            return;
        } else {
            //delete creep.memory.attackFlag
        }

        if (creep.memory.attackTarget) {
            let target = Game.getObjectById(creep.memory.attackTarget);
            creep.moveTo(target);
            creep.attack(target);
            return;
        }
        let target = creep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(target) {
            creep.memory.attackTarget = target.id;
            creep.moveTo(target);
            creep.attack(target);
        }
    }
}

module.exports = warGuardKiller;