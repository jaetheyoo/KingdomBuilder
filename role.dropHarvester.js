var roleDropHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, dropLocation, source) {
        // if my location isn't equal to my drop location
        // move there
        // else harvest
        if (!creep.pos.isEqualTo(dropLocation.pos)) {
            creep.moveTo(dropLocation);
        } else {
            creep.harvest(source);
        }
    }
};