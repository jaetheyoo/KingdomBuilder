var speech = require('utils.speech')
var base = require('role.base');

var roleLinkMaintainer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }

        /**
         * Is there energy in the link?
         *  Y: take it out. Am I full? If Y, and there's still energy in the link, then move it to storage
         * 
         * 
         * Moves energy from links to storage
         * Moves energy to tower
         * 
         */
        if (creep.memory.transferTarget && _.sum(creep.carry) == 0) {
            creep.memory.transferTarget = null;
        }

        if (!creep.memory.transferTarget && village.hasLinks()) { // TODO: add stuff to do when TOLINKS are empty
            let toLinkIds = village.getToLinks();
            for(let i in toLinkIds) {
                let toLink = Game.getObjectById(toLinkIds[i]);
                if (toLink && toLink.energy > 0) {
                    if (_.sum(creep.carry) == 0) {
                        creep.emote('linkMaintainer', speech.WITHDRAW);
                        creep.withdrawMove(toLink);
                        return;
                    } else {
                        let transferTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: structure => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
                        });
                        if (!transferTarget) {
                            transferTarget = village.room.storage;
                        }
                        creep.memory.transferTarget = transferTarget.id;
                    }
                }
            }
        }

        // fill market quotas if not busy with links
        if (!creep.memory.transferTarget && village.market && village.market.quotas) {
            let quotas = village.market.quotas;
            for(quota in quotas) {
                //console.log(`QUOTA: ${quota}`);
                let resourceType = quota;
                let terminalAmount = village.getTerminalAmount(resourceType);
                let storageAmount = village.getStorageAmount(resourceType);
                //console.log(terminalAmount);
                //console.log(storageAmount);
                if (terminalAmount >= quotas[quota] || storageAmount == 0) {
                    continue;
                }
                if (_.sum(creep.carry) == 0) {
                    creep.emote('linkMaintainer',speech.MARKET);
                    creep.withdrawMove(village.room.storage, resourceType);
                    return;
                } else {
                    creep.memory.transferTarget = village.terminal.id;
                    break;
                }
            }
        }

        if(creep.memory.transferTarget) {
            creep.emote('linkMaintainer', speech.TRANSFER);
            status = creep.transferMove(Game.getObjectById(creep.memory.transferTarget));
            switch(status) {
                case (ERR_FULL):
                    creep.memory.transferTarget = null;
                    break;
            }
        } else {
            creep.emote('linkMaintainer', speech.IDLE);
        }
    }
};

module.exports = roleLinkMaintainer;