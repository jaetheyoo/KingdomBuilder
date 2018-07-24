var speech = require('utils.speech')
var base = require('role.base');

var roleLabManager = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
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
            creep.emote('labManager', speech.WITHDRAW);
            let mineralAmount = creep.memory.fillMineralAmount;
            let withdrawTarget = Game.getObjectById(creep.memory.withdrawTarget);
            let mineralType = creep.memory.fillMineralType;
            if (withdrawTarget.store[mineralType] < mineralAmount) {
                mineralAmount = withdrawTarget.store[mineralType];
            }
            let readyToTransport = false;
            readyToTransport = (_.sum(creep.carry) == creep.carryCapacity) ||
                creep.carry[mineralType] < 0;
            if (readyToTransport) {
                creep.emote('labManager', speech.TRANSPORT);
                let transferTarget = Game.getObjectById(creep.memory.transferTarget);
                if (creep.transferMove(transferTarget,mineralType) == 0) {
                    delete creep.memory.fillMineralAmount;
                    return;
                }
            } else {
                creep.withdrawMove(withdrawTarget,mineralType);
                return;
            }
        }

        // get a new assignment
        if (village.hasLabs()) {
            let labs = village.labs;
            for (let i in labs) {
                let lab = Game.getObjectById(i);
                // if (lab.energy == 0) {
                //     creep.memory.fillEnergyTarget = labs[i];
                //     creep.memory.fillEnergyAmount = 2000;
                //     return;
                // }
                if (lab.mineralAmount >= 1000) {
                    continue;
                }
                let myBoost = labs[i].boost;
                if (myBoost) {
                    // if (lab.mineralAmount > 0 && lab.mineralType != myBoost) {
                    //     creep.memory.emptyMineralType = lab.mineralType;
                    //     creep.memory.emptyMineralAmount = lab.mineralCapacity;
                    //     return;
                    // }
                    let target;
                    if (village.storage.store[myBoost] > 200) {
                        target = village.storage;
                    } else if (village.terminal.store[myBoost] > 200) {
                        target = village.terminal;
                    }
                    if (target) {
                        creep.memory.fillMineralType = myBoost;
                        creep.memory.fillMineralAmount = 200;//Math.max(lab.mineralCapacity - lab.mineralAmount);
                        creep.memory.withdrawTarget = target.id;
                        creep.memory.transferTarget = i;
                    }
                }
            }
        }
    }
};

module.exports = roleLabManager;