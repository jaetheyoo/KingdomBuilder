var speech = require('utils.speech')
var base = require('role.base');

var roleDropHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
            return;
        }
        
        village.debugMessage.append(`\t\t\t${creep.name} is running role RemoteReporter`);

        // if my location isn't equal to my drop location
        // move there
        // else harvest

        // TODO: doesn't run base class, is a mindless worker
        //creep.

        let mySource = village.getSource(creep.name);
        let dropLocation = village.getDropHarvestLocation(creep.name);
        let dropContainer = Game.getObjectById(dropLocation);

        if (!creep.pos.isEqualTo(dropContainer.pos)) {
            creep.emote('dropHarvester', speech.MOVE);
            creep.moveTo(dropContainer);
        } else {
            creep.emote('dropHarvester', speech.HARVEST);
            creep.harvest(mySource); // TEST: is this the right mem addr?
        }
    }
};

module.exports = roleDropHarvester;