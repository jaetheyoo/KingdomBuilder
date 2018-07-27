var warGuardianAngel = {
    // Game.spawns['Spawn3'].spawnCreep(['tough','tough','tough','tough','tough','tough','move','move','move','move','heal','heal','heal','heal','heal','heal','heal','heal'], 'GuardianAngel',{memory:{role: 'warGuardianAngel', getBoosted:['XGHO2','XZHO2','XLHO2'],mortalWard: 'SeigeBreaker'}});
    // Game.spawns['Spawn1'].spawnCreep(['tough','tough','tough','tough','tough','tough','move','move','move','move','move','move','move','move','move','move','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','work','attack','attack','attack','attack','attack'] , 'SeigeBreaker',{memory:{role: 'warSeigeBreaker', getBoosted:['XGHO2','XZHO2','XZH2O'], seigeMode: true}});
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

        let mortalWard = Game.creeps[creep.memory.mortalWard];
        creep.moveTo(mortalWard);
        if (mortalWard.hits < mortalWard.hitsMax) {
            if (creep.heal(mortalWard) == ERR_NOT_IN_RANGE)  {
                creep.rangedHeal(mortalWard);
                return;
            }
        }

        if (creep.hits < creep.hitsMax) {
            creep.heal(creep);
        }
    }
}

module.exports = warGuardianAngel;