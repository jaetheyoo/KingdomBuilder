var roleMineralHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (BASE_CREEP.run(creep, village) == -1){
            return;
        }
        
        village.debugMessage.append(`\t\t\t${creep.name} is running role MineralHarvester`);

        // if my location isn't equal to my drop location
        // move there
        // else harvest
 
        // TODO: doesn't run base class, is a mindless worker
        //creep.
        let myMinerals = Game.getObjectById(village.getMineralsById());
        let dropLocation = Game.getObjectById(village.getMineralExtractionContainerId());
        if (creep.memory.cooldown) {
            creep.emote('mineralHarvester', CREEP_SPEECH.WAITING + creep.memory.cooldown);
            creep.memory.cooldown--;
            return;
        }

        if (!creep.pos.isEqualTo(dropLocation.pos)) {
            creep.emote('mineralHarvester', CREEP_SPEECH.MOVE);
            creep.moveTo(dropLocation);
            return;
        } 
        
        creep.emote('mineralHarvester', CREEP_SPEECH.MINE);
        creep.harvest(myMinerals) ; // TEST: is this the right mem addr?
        creep.memory.cooldown = 5;
    }
};

module.exports = roleMineralHarvester;