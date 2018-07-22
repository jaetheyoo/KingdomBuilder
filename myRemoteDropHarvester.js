var speech = require('utils.speech')
var base = require('role.base');

var roleRemoteDropHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            creep.memory.atSource = false;
            return; 
        }
        // if my location isn't equal to my drop location
        // move there
        // else harvest

        if (!creep.memory.atSource) {
            let mySource = village.getSource(creep.name);
            let myRemoteRoom = village.getMyRemoteRoomName(creep);
            // cant' see source, move to room
            if (mySource == null) {
                creep.emote('remoteDropHarvester', speech.REMOTEMOVING + '?');
                creep.moveTo(Game.flags[myRemoteRoom], {visualizePathStyle: {stroke: '#ffffff'}});
                return;
            }
            let dropLocation = village.getDropHarvestLocation(creep.name, myRemoteRoom);
            //console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>     ' + creep.name + '|'+ myRemoteRoom + '|' +Game.getObjectById(dropLocation))
            if (dropLocation && !creep.pos.isEqualTo(Game.getObjectById(dropLocation).pos)) {
                creep.emote('remoteDropHarvester', speech.REMOTEMOVING);
                creep.moveTo(Game.getObjectById(dropLocation).pos);
                return;
            }
            
            if (creep.room.name != myRemoteRoom || !creep.pos.inRangeTo(mySource.pos, 1)) {
                creep.moveTo(mySource);
                return;
            }
            
            if (!creep.memory.arrived) {
                if (creep.ticksToLive > village.getRemoteSourceArrivalTime(myRemoteRoom, mySource.id)) {
                    village.setRemoteSourceArrivalTime(myRemoteRoom,mySource.id, creep.ticksToLive);
                }
                creep.memory.arrived = true;
            }
            creep.memory.atSource = true;
        }
        
        creep.emote('remoteDropHarvester', speech.HARVEST);
        creep.harvest(mySource); // TEST: is this the right mem addr?
    }
};

module.exports = roleRemoteDropHarvester;