var speech = require('utils.speech')
var base = require('role.base');

var roleRemoteDropHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return; 
        }
        // if my location isn't equal to my drop location
        // move there
        // else harvest

        // doesn't run base class, is a mindless worker
        //creep.

        let mySource = village.getSource(creep.name);
        
        // cant' see source, move to room
        if (mySource == null) {
            creep.emote('remoteDropHarvester', speech.REMOTEMOVING);
            creep.moveTo(Game.flags[village.getMyRemoteRoom(creep)], {visualizePathStyle: {stroke: '#ffffff'}});
            return;
        }
        let dropLocation = village.getDropHarvestLocation(creep.name, village.getMyRemoteRoom(creep));
        // console.log('>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>     ' + creep.name + '|'+ Game.getObjectById(dropLocation))
        if (dropLocation && !creep.pos.isEqualTo(Game.getObjectById(dropLocation).pos)) {
            creep.emote('remoteDropHarvester', speech.REMOTEMOVING);
            creep.moveTo(Game.getObjectById(dropLocation).pos);
        } else {
            creep.emote('remoteDropHarvester', speech.HARVEST);
            creep.harvest(mySource); // TEST: is this the right mem addr?
        }
    }
};

module.exports = roleRemoteDropHarvester;