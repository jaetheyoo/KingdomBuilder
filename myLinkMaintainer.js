var speech = require('utils.speech')
var base = require('role.base');

var roleLinkMaintainer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
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

        if (village.hasLinks()) { // TODO: add stuff to do when TOLINKS are empty
            let toLinkIds = village.getToLinks();
            for(let i in toLinkIds) {
                let toLink = Game.getObjectById(toLinkIds[i]);
                if (toLink && toLink.energy > 0) {
                    if (_.sum(creep.carry) == 0) {
                        creep.emote('linkMaintainer', speech.WITHDRAW);
                        creep.withdrawMove(toLink);
                        return;
                    } else {
                        creep.emote('linkMaintainer', speech.TRANSPORT);
                        let transferTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: structure => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
                        });
                        if (!transferTarget) {
                            transferTarget = village.room.storage;
                             
                        }
                        creep.transferMove(transferTarget);
                        return;
                    }
                }
            }
        }
        
        if (_.sum(creep.carry) == 0) {
            creep.emote('linkMaintainer', speech.WITHDRAW);
            creep.withdrawMove(village.room.storage);
            return;
        } else {
            creep.emote('linkMaintainer', speech.TRANSPORT);
            let transferTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                filter: structure => ((structure.structureType == STRUCTURE_TOWER || structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_LAB) && structure.energy < structure.energyCapacity) ||
                    (structure.structureType == STRUCTURE_TERMINAL && structure.energy < 50000)
            });
            if (!transferTarget) {
                transferTarget = village.room.storage;
            }
            creep.transferMove(transferTarget);
        }
    }
};

module.exports = roleLinkMaintainer;