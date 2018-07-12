var roleDropHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        // if my location isn't equal to my drop location
        // move there
        // else harvest

        // doesn't run base class, is a mindless worker
        //creep.

        let mySource = village.getSource(creep.name);
        let dropLocation = village.getDropHarvestLocation(creep.name);

        if (!creep.pos.isEqualTo(dropLocation.pos)) {
            creep.emote('dropHarvester', speech.MOVE);
            creep.moveTo(dropLocation);
        } else {
            creep.emote('dropHarvester', speech.HARVEST);
            creep.harvest(mySource); // TEST: is this the right mem addr?
        }
    }
};

module.exports = roleDropHarvester;