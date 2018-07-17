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
        creep.emote('linkMaintainer', speech.IDLE);
        if (village.hasLinks()) { // TODO: add stuff to do when TOLINKS are empty
            let toLinkIds = village.getToLinks();
            for(let i in toLinkIds) {
                let toLink = Game.getObjectById(toLinkIds[i]);
                if (toLink && toLink.energy > 0) {
                    if (creep.carry.energy == 0) {
                        creep.emote('linkMaintainer', speech.WITHDRAW);
                        creep.withdrawMove(toLink);
                        return;
                    } else {
                        creep.emote('linkMaintainer', speech.TRANSFER);
<<<<<<< HEAD
                        let transferTarget = creep.pos.findClosestByRange(FIND_MY_STRUCTURES, {
                            filter: structure => structure.structureType == STRUCTURE_TOWER && structure.energy < structure.energyCapacity
                        });
                        if (!transferTarget) {
                            transferTarget = village.room.storage;
                        }
                        creep.transferMove(transferTarget);
=======
                        creep.transferMove(creep.room.storage);
>>>>>>> 4c1586e4c32c5c1608432d8719147a86238c19a9
                        return
                    }
                }
            }
        }
    }
};

module.exports = roleLinkMaintainer;