var speech = require('utils.speech')
var base = require('role.base');

var roleLinkMaintainer = {

    /** @param {Creep} creep **/
    run: function(creep, shouldWait) {
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

        if (village.hasLinks()) {
            let toLinkIds = village.getToLinks();
            for(let i in toLinkIds) {
                let toLink = Game.getObjectById(toLinkIds[i]);
                if (toLink && toLink.energy > 0) {
                    if (creep.carry.energy == 0) {
                        creep.withdrawMove(toLink);
                        return;
                    } else {
                        creep.transferMove(creep.room.storage);
                        return
                    }
                }
            }
        }
    }
};

module.exports = roleLinkMaintainer;