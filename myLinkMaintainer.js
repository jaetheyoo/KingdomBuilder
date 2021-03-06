var roleLinkMaintainer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }
        
        if (village.villageName == 'village2') {
            creep.moveTo(Game.flags['linkManagerFlag']);
        }
        
        const storage = creep.room.storage;
        const terminal = creep.room.terminal;
        const minimumTerminalAmount = 30000;
        const maximumTerminalAmount = minimumTerminalAmount + creep.carryCapacity;
        
        if (village.hasLinks()) { // TODO: add stuff to do when TOLINKS are empty
            let toLinkIds = village.getToLinks();
            for(let i in toLinkIds) {
                let toLink = Game.getObjectById(toLinkIds[i]);
                if (toLink && toLink.energy > 0) {
                    if (_.sum(creep.carry) == 0) {
                        creep.emote('linkMaintainer', CREEP_SPEECH.WITHDRAW);
                        creep.withdrawMove(toLink);
                        return;
                    } else {
                        creep.emote('linkMaintainer', CREEP_SPEECH.TRANSPORT);
                        let transferTarget = storage;
                        
                        creep.transferMove(transferTarget);
                        return;
                    }
                }
            }
        }
        
        if (terminal && storage) {
            
            let mineralsToMove = creep.memory.movingMinerals;
            if (mineralsToMove) {
                //console.log(creep.name + '|' + mineralsToMove)
                if (_.sum(creep.carry) == 0) {
                    if (!storage.store[mineralsToMove] || terminal.store[mineralsToMove] >= minimumTerminalAmount) {
                        delete creep.memory.movingMinerals;
                        return;
                    }
                    creep.withdrawMove(storage, mineralsToMove);
                    return;
                } else {
                    if (creep.transferMove(terminal, mineralsToMove)==0) {
                        if (!storage.store[mineralsToMove] || terminal.store[mineralsToMove] >= minimumTerminalAmount) {
                            delete creep.memory.movingMinerals;
                            return;
                        } else {
                            return;
                        }
                    }
                }
            }
            
            let excessMinerals = creep.memory.excessMinerals;
            if (excessMinerals) {
                if (_.sum(creep.carry) == 0) {
                    creep.withdrawMove(terminal, excessMinerals);
                    return;
                } else {
                    if (creep.transferMove(storage, excessMinerals) == 0) {
                        if (!terminal.store[excessMinerals] || terminal.store[excessMinerals] <= maximumTerminalAmount) {
                            delete creep.memory.excessMinerals;
                            return;
                        } else {
                            return;
                        }
                    }
                }
            }
            
            //console.log(creep.name)
            /**
             * Is there energy in the link?
             *  Y: take it out. Am I full? If Y, is there a quota to fill? Move to market. Else, to storage
             * 
             * 
             * Moves energy from links to storage
             * Moves energy to tower
             * 
             */
    
            
            for (let min in storage.store) {
                if (!terminal.store[min] || terminal.store[min] < minimumTerminalAmount) {
                    creep.memory.movingMinerals = min;
                    return;
                }
            }
            if (terminal) {
                for (let min in terminal.store) {
                    if (terminal.store[min] > maximumTerminalAmount) {
                        creep.memory.excessMinerals = min;
                        return;
                    }
                }
            }
        }
        
        if (_.sum(creep.carry) == 0) {
            creep.emote('linkMaintainer', CREEP_SPEECH.WITHDRAW);
            creep.withdrawMove(storage);
            return;
        } else {
            creep.emote('linkMaintainer', CREEP_SPEECH.TRANSPORT);
            let transferTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: structure => ((structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_LAB) && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_TERMINAL && structure.store.energy < minimumTerminalAmount)
            });
            if (!transferTarget) {
                transferTarget = storage;
            }
            creep.transferMove(transferTarget);
        }
    }
};

module.exports = roleLinkMaintainer;