var roleConquerer = {
    /** @param {Creep} creep **/
    run: function(creep, village) {
        let flag = Game.flags[village.colonization.civFlag];
        if (!flag.room || creep.room != flag.room) {
            creep.emote('conquerer',CREEP_SPEECH.REMOTEMOVING);
            creep.moveTo(flag);
        } else {
            if(creep.room.controller) {
                creep.memory.controller = creep.room.controller.id;
                creep.emote('claimer',CREEP_SPEECH.CLAIMING);
                let status= creep.claimController(creep.room.controller);
                switch(status) {
                    case ERR_NOT_IN_RANGE:
                        creep.moveTo(creep.room.controller);
                        break;
                    case 0:
                        // register colonization information
                        this.registerNewVillage(creep, village);
                        break;
                } 

            }
        }
    },
    registerNewVillage(creep, motherVillage) {
        motherVillage.colonization.civRoom = creep.room;
        let villageName = "Village" + Memory.villageNameCounter++; 
        motherVillage.colonization.civVillageName = villageName;
        let sources = creep.room.find(FIND_SOURCES);
        let source1Name = sources[0].id;
        let source2Name = sources[1].id;
        Memory.Villages[villageName] = {
            "spawns": null,
            "room": creep.room.name,
            "controller": creep.room.controller.id,
            "level": 1,
            "remoteRooms": {},
            "flags": {
                "hideoutFlag" : 'hideoutFlag',
                "refuelWaitingZone" : 'refuelWaitingZone'
            },
            "structures": {
                "links" : {
                    "toLinks": [],
                    "fromLinks": []
                },
                "towers" : {}
            },
            "sources": {
                [source1Name]: {
                    container: null,
                    harvester: 0,
                    harvestersAmount: 3,
                    dropHarvester: 0
                },
                [source2Name]: {
                    container: null,
                    harvester: 0,
                    harvestersAmount: 3,
                    dropHarvester: 0
                },
            }
        };

        let villageMemObj = Memory.Villages[villageName];
        //motherVillage.Villages[villageMemObj.villageName] = new Village(motherVillage.Villages, villageMemObj.villageName, villageMemObj.room, villageMemObj.spawns, villageMemObj.controller, debug);
    }
};

module.exports = roleConquerer;