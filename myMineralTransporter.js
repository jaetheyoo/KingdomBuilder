var speech = require('utils.speech')
var base = require('role.base');
var roleMineralTransporter = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }

        // move to mySource, find the nearest container. // TODO resources on the ground
        // pick up, then move to nearest FROM link. If no FROM links, move to storage

        if (_.sum(creep.carry) == 0) {
            creep.memory.pickingUp = true;
        } else if (_.sum(creep.carry) == creep.carryCapacity) {
            creep.memory.pickingUp = false;
        }

        if (creep.memory.pickingUp) {
            creep.emote('mineralTransporter',speech.MOVING)
            let minerals = Game.getObjectById(village.getMineralsById());
            let pickupContainer = Game.getObjectById(village.getMineralExtractionContainerId());
            if (minerals && pickupContainer) {
                creep.withdrawMove(pickupContainer, minerals.mineralType);
            }
        } else {
            creep.emote('mineralTransporter',speech.TRANSPORT);
            let minerals = Game.getObjectById(village.getMineralsById());
            creep.transferMove(village.room.storage, minerals.mineralType, {ignoreCreeps: true});
        }
    }
};

module.exports = roleMineralTransporter;