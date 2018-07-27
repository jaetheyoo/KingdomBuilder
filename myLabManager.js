var roleLabManager = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }
        //console.log(creep.name)
        /**
         * Is there a lab quota?
         *  Y: take it out. Am I full? If Y, is there a quota to fill? Move to market. Else, to storage
         * 
         * 
         * Moves energy from links to storage
         * Moves energy to tower
         * 
         */

        // do I need to fill up lab with energy?
        // if (creep.memory.fillEnergyTarget != undefined) {
        //     let lab = Game.getObjectById(creep.memory.fillEnergyTarget);
        //     if (lab.energy == lab.energyCapacity) {
        //         delete creep.memory.fillEnergyTarget;
        //     } else {
        //         if (creep.memory.refueling) {
        //             if (_.sum(creep.carry) == creep.carryCapacity) {
        //                 creep.memory.refueling = false;
        //             } else {
        //                 creep.withdrawMove(village.storage);
        //                 return;
        //             }
        //         }
        //         creep.transferMove(lab, 'energy');
        //     }
        // }
        
        if (creep.memory.fillMineralAmount > 0) {
            creep.emote('labManager', CREEP_SPEECH.WITHDRAW);
            let mineralAmount = creep.memory.fillMineralAmount;
            let withdrawTarget = Game.getObjectById(creep.memory.withdrawTarget);
            let mineralType = creep.memory.fillMineralType;
            if (withdrawTarget.store[mineralType] < mineralAmount) {
                mineralAmount = withdrawTarget.store[mineralType];
            }
            if (mineralAmount == 0) {
                delete creep.memory.fillMineralAmount;
            } else {
                let readyToTransport = false;
                readyToTransport = (_.sum(creep.carry) == creep.carryCapacity) ||
                    creep.carry[mineralType] > 0;
                if (readyToTransport) {
                    creep.emote('labManager', CREEP_SPEECH.TRANSPORT); 
                    let transferTarget = Game.getObjectById(creep.memory.transferTarget);
                    //console.log(transferTarget + ' | ' +mineralType)
                    if (creep.transferMove(transferTarget,mineralType) == 0) {
                        delete creep.memory.fillMineralAmount;
                        return;
                    } else {
                        return;
                    }
                } else {
                    creep.withdrawMove(withdrawTarget,mineralType);
                    return;
                }
            }
        }

        if (creep.memory.dumpMineralAmount > 0) {
            creep.emote('labManager', CREEP_SPEECH.WITHDRAW);
            let dumpMineralAmount = creep.memory.dumpMineralAmount;
            let dumpMineralTarget = Game.getObjectById(creep.memory.dumpMineralTarget);
            let dumpMineralType = creep.memory.dumpMineralType;
            
            if (dumpMineralTarget.mineralAmount < dumpMineralAmount) {
                dumpMineralAmount = dumpMineralTarget.mineralAmount;
            }
            if (dumpMineralAmount == 0) {
                delete creep.memory.dumpMineralAmount;
            } else {
                let readyToTransport = false;
                readyToTransport = (_.sum(creep.carry) == creep.carryCapacity) ||
                    creep.carry[dumpMineralType] >= dumpMineralAmount;
                if (readyToTransport) {
                    creep.emote('labManager', CREEP_SPEECH.TRANSPORT); 
                    let transferTarget = village.terminal;
                    if (creep.transferMove(transferTarget,dumpMineralType) == 0) {
                        delete creep.memory.dumpMineralAmount;
                        return;
                    } else {
                        return;    
                    }
                } else {
                    creep.withdrawMove(dumpMineralTarget,dumpMineralType);
                    return;
                }
            }
        }
        
        if (_.sum(creep.carry) > 0) {
            creep.transferMove(village.terminal);
            return;
        }

        // get a new assignment
        if (village.hasLabs()) {
            let labs = village.labs;
            let reactionLabs = labs.reactionLabs;
            let reagentLabs = labs.reagentLabs;
            if (reactionLabs && reagentLabs){
                // fill reagents
                for (lab in reagentLabs) {
                    let labObj = Game.getObjectById(lab);
                    let myMin = reagentLabs[lab];
                    if (labObj.mineralType && labObj.mineralType != myMin) {
                        creep.memory.dumpMineralAmount = 200;
                        creep.memory.dumpMineralType = labObj.mineralType;
                        creep.memory.dumpMineralTarget = lab;
                        return;
                    }
                    
                    if (labObj.mineralAmount >= 1800) {
                        continue;
                    }
                    
                    let target;
                    if (village.storage.store[myMin] > 0) {
                        target = village.storage;
                    } else if (village.terminal.store[myMin] > 0) {
                        target = village.terminal;
                    }
                    if (target) {
                        creep.memory.fillMineralType = myMin;
                        creep.memory.fillMineralAmount = 200;//Math.max(lab.mineralCapacity - lab.mineralAmount);
                        creep.memory.withdrawTarget = target.id;
                        creep.memory.transferTarget = lab;
                        return;
                    }
                }
                
                let reactionMin = labs.reaction
                if (reactionMin) {
                    // put excess reaction into term
                    reactionLabs.forEach(l => {
                        let labObj = Game.getObjectById(l);
                        if ((labObj.mineralType && labObj.mineralType != reactionMin) || labObj.mineralAmount >= 200) {
                            creep.memory.dumpMineralAmount = 200;
                            creep.memory.dumpMineralType = labObj.mineralType;
                            creep.memory.dumpMineralTarget = l;
                            return;
                        }
                    });
                }
            }
        }
    }
};

module.exports = roleLabManager;