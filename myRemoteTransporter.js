var speech = require('utils.speech')
var base = require('role.base');
var roleRemoteTransfer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }
        return;
        // move to mySource, find the nearest container. // TODO resources on the ground
        // pick up, then move to nearest FROM link. If no FROM links, move to storage

        if (creep.carry.energy == 0) {
            creep.memory.pickingUp = true;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.pickingUp = false;
        }

        if (creep.memory.pickingUp) {
            creep.emote('remoteTransporter',speech.REMOTETRAVEL)
            if (creep.memory.pickupContainer) {
                let containerObj = Game.getObjectById(creep.memory.pickupContainer);
                if (containerObj) {
                    creep.withdrawMove(containerObj);
                } else {
                    delete creep.memory.pickupContainer;
                }
            } else {
                let mySourceObject = Game.getObjectById(village.creeps[creep.name].mySource);
                creep.moveTo(mySourceObject);
                if (mySourceObject.room) {
                    let containerId = village.getDropHarvestLocation(creep.name, creep.memory.remoteRoom);
                    if (containerId) {
                        creep.memory.pickupContainer = containerId;
                        creep.withdrawMove(creep.memory.pickupContainer);
                    } else {
                        creep.scavenge();
                    }
                }
            }
        } else {
            creep.emote('remoteTransporter',speech.TRANSPORT);

            if (creep.memory.dropoffLink) {
                let linkObj = Game.getObjectById(creep.memory.dropoffLink);
                if (linkObj) {
                    creep.transferMove(linkObj);
                    return;
                } else {
                    delete creep.memory.dropoffLink;
                }
            } else if (creep.room == village.roomName && village.hasLinks()) {
                let fromLinkIds = village.getFromLinks();
                let closestLink = creep.room.findClosestByRange(FIND_MY_STRUCTURES, {
                    filter: function(o) {
                        fromLinkIds.includes(o.id);
                    }
                })
                if (closestLink) {
                    creep.memory.dropoffLink = closestLink.id;
                    creep.transferMove(closestLink);
                    return;
                }
            }
            creep.transferMove(village.room.storage);
        }
    }
};

module.exports = roleRemoteTransfer;