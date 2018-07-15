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
        let dropLocation = village.getDropHarvestLocation(creep.name, village.getMyRemoteRoom(creep));

        if (!creep.pos.isEqualTo(dropLocation.pos)) {
            creep.emote('remoteDropHarvester', speech.MOVE);
            creep.moveTo(dropLocation);
        } else {
            creep.emote('remoteDropHarvester', speech.HARVEST);
            creep.harvest(mySource); // TEST: is this the right mem addr?
        }
    }
};

module.exports = roleRemoteDropHarvester;