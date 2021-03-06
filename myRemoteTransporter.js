

var roleRemoteTransfer = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }

        // move to mySource, find the nearest container. // TODO resources on the ground
        // pick up, then move to nearest FROM link. If no FROM links, move to storage

        if (creep.carry.energy == 0) {
            creep.memory.pickingUp = true;
        } else if (creep.carry.energy == creep.carryCapacity) {
            creep.memory.pickingUp = false;
        }

        if (creep.memory.pickingUp) {
            creep.emote('remoteTransporter',CREEP_SPEECH.REMOTETRAVEL)
            if (creep.memory.pickupContainer) {
                let containerObj = Game.getObjectById(creep.memory.pickupContainer);
                if (containerObj) {
                    creep.withdrawMove(containerObj);
                } else {
                    delete creep.memory.pickupContainer;
                }
            } else {
                let mySourceObject = Game.getObjectById(village.creeps[creep.name].mySource);
                // cant' see source, move to room
                if (mySourceObject == null) {
                    creep.emote('remoteTransporter', CREEP_SPEECH.REMOTEMOVING);
                    creep.moveTo(Game.flags[village.getMyRemoteRoomName(creep)], {visualizePathStyle: {stroke: '#ffffff'}});
                    return;
                }
                creep.moveTo(mySourceObject);
                if (mySourceObject && mySourceObject.room && creep.room == mySourceObject.room) {
                    let containerId = village.getDropHarvestLocation(creep.name, village.creeps[creep.name].remoteRoom);
                    if (containerId) {
                        creep.memory.pickupContainer = containerId;
                        creep.withdrawMove(creep.memory.pickupContainer);
                    } else {
                        creep.scavenge();
                    }
                }
            }
        } else {
            creep.emote('remoteTransporter',CREEP_SPEECH.TRANSPORT);

            if (creep.memory.dropoffLink) {
                let linkObj = Game.getObjectById(creep.memory.dropoffLink);
                if (linkObj) {
                    creep.transferMove(linkObj, null);
                    return;
                } else {
                    delete creep.memory.dropoffLink;
                }
            } else if (creep.room.name == village.roomName && village.hasLinks()) {
                let fromLinkIds = village.getFromLinks();
                //console.log('FROM LINKS: ' + fromLinkIds + ' | ' + fromLinkIds.length);
                let closestLink = creep.pos.findClosestByRange(FIND_STRUCTURES, {
                    filter: function(o) {
                        return fromLinkIds.includes(o.id) || o.structureType == STRUCTURE_STORAGE;
                    }
                })
                //console.log("CLOSEST LINK: " + closestLink);
                if (closestLink) {
                    creep.memory.dropoffLink = closestLink.id;
                    creep.transferMove(closestLink);
                    return;
                }
            }
            creep.transferMove(village.room.storage, null);
        }
    }
};

module.exports = roleRemoteTransfer;