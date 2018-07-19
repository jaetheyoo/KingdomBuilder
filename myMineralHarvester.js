var speech = require('utils.speech')
var base = require('role.base');

var roleMineralHarvester = {

    /** @param {Creep} creep **/
    run: function(creep, village) {
        if (base.run(creep, village) == -1){
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
            creep.emote('mineralHarvester', speech.WAITING + creep.memory.cooldown);
            creep.memory.cooldown--;
            return;
        }

        if (!creep.pos.isEqualTo(dropLocation.pos)) {
            creep.emote('mineralHarvester', speech.MOVE);
            creep.moveTo(dropLocation);
            return;
        } 
        
        creep.emote('mineralHarvester', speech.MINE);
        creep.harvest(myMinerals) ; // TEST: is this the right mem addr?
        creep.memory.cooldown = 5;
    }
};

module.exports = roleMineralHarvester;