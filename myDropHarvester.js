var roleDropHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }
        
        village.debugMessage.append(`\t\t\t${creep.name} is running role DropHarvester`);

        // if my location isn't equal to my drop location
        // move there
        // else harvest
 
        // TODO: doesn't run base class, is a mindless worker
        //creep.

        let mySource = village.getSource(creep.name);
        //console.log(creep.name + " | SOURCE " + mySource)

        let dropLocation = village.getDropHarvestLocation(creep.name);
        if(!dropLocation) {
            return; // TODO: do something graceful
        }
        let dropContainer = Game.getObjectById(dropLocation);

        if (!creep.pos.isEqualTo(dropContainer.pos)) {
            creep.emote('dropHarvester', CREEP_SPEECH.MOVE);
            creep.moveTo(dropContainer);
        } else {
            creep.emote('dropHarvester', CREEP_SPEECH.HARVEST);
            creep.harvest(mySource); // TEST: is this the right mem addr?
        }
    }
};

module.exports = roleDropHarvester;