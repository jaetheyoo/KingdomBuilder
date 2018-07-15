var Village = require('game.village')

var init = function initVillage(Villages, debug) {
    if (!Memory.creepNameCounter) {
        Memory.creepNameCounter = 0;
    }
    // write to memory, run once
    if (!Memory.Villages) {
        let village1_Spawns = ['Spawn1','Spawn3'];
        let village1_room = Game.spawns[village1_Spawns[0]].room;
        let village1_controller = village1_room.controller; 

        let village2_Spawns =['Spawn2'];
        let village2_room = Game.spawns[village2_Spawns[0]].room;
        let village2_controller = village2_room.controller; 

        let village3_Spawns =['Spawn4'];
        let village3_room = Game.spawns[village3_Spawns[0]].room;
        let village3_controller = village3_room.controller; 

        Memory.Villages = {
            "village1": {
                "spawns": village1_Spawns,
                "room": village1_room.name,
                "controller": village1_controller.id,
                "level": 5,
                "remoteRooms": {
                    "W55N48": {
                        "remoteRepairer": 0,
                        "remoteSources": {
                            "59f19f8a82100e1594f351e5" : {
                                remoteDropHarvester: 0, remoteTransporter: 0
                            }
                        },
                        "remoteController": '59f19f8a82100e1594f351e6',
                    },
                    "W54N40": {
                        "remoteRepairer": 0,
                        "remoteSources": {
                            "59f19f9982100e1594f35405" : {
                                remoteDropHarvester: 0, remoteTransporter: 0
                            }
                        },
                        "remoteController": '59f19f9982100e1594f35406',
                    },
                    "W54N47": {
                        "remoteRepairer": 0,
                        "remoteSources": {
                            "59f19f9982100e1594f3540d" : {
                                remoteDropHarvester: 0, remoteTransporter: 0
                            }
                        },
                        "remoteController": '59f19f9982100e1594f3540c',
                    },
                },
                "flags": {
                    "hideoutFlag" : 'hideoutFlag',
                    "refuelWaitingZone" : 'refuelWaitingZone'
                },
                "structures": {
                    "links" : {
                        "toLinks": ['5b3a73a00baf6d03ce461043'],
                        "fromLinks": ['5b3a78fb0baf6d03ce4612bb','5b3da21255276f03b8cf406d']
                    },
                    "towers" : {
                        '5b48b14a26fe4949defaead8': {},
                        '5b3981e6cb0b34591b3ef9b7': {},
                        '5b35dcb7ca59fe44212e6cb7': {}
                    }
                }

            },
            "village2": {
                "spawns": village2_Spawns,
                "room": village2_room.name,
                "controller": village2_controller.id,
                "level": 2,
                "remoteRooms": {
                    "W53N49": {
                        "remoteRepairer": 0,
                        "remoteSources": {
                            "59f19fad82100e1594f3563c" : {
                                remoteDropHarvester: 0, remoteTransporter: 0
                            },
                            "59f19fad82100e1594f3563d" : {
                                remoteDropHarvester: 0, remoteTransporter: 0
                            }
                        },
                        "remoteController": '59f19fad82100e1594f3563b',
                    },
                },
                "flags": {
                    "hideoutFlag" : 'Room2Spawn',
                    "refuelWaitingZone" : 'S2U'
                },
                "structures": {
                    "links" : {
                        "toLinks": ['5b479e0de18cc24347f4a092'],
                        "fromLinks": ['5b47a7f2b73bda6833af2d87']
                    },
                    "towers" : {
                        '5b479522838e6268321346a4': {},
                        '5b415d9ca8f9805e72b8b1aa': {}
                    }
                }
            },
            "village3": {
                "spawns": village3_Spawns,
                "room": village3_room.name,
                "controller": village3_controller.id,
                "level": 1,
                "remoteRooms": {
                    "W52N45": {
                        "remoteRepairer": 0,
                        "remoteSources": {
                            "59f19fbc82100e1594f357d1" : {
                                remoteDropHarvester: 0, remoteTransporter: 0
                            },
                            "59f19fbc82100e1594f357d0" : {
                                remoteDropHarvester: 0, remoteTransporter: 0
                            }
                        },
                        "remoteController": '59f19fbc82100e1594f357d2',
                    },
                },
                "flags": {
                    "hideoutFlag" : 'v3Hideout',
                    "refuelWaitingZone" : 'v3refuel'
                },
                "structures": {
                    "links" : {
                        "toLinks": [],
                        "fromLinks": []
                    },
                    "towers" : {
                    }
                }
            }
        };
    } 
    
    
    
    // if recompiled, create new Village objects reading from memory
    var village1 = new Village("village1",Memory.Villages.village1.room,Memory.Villages.village1.spawns,Memory.Villages.village1.controller,  debug);
    var village2 = new Village("village2",Memory.Villages.village2.room,Memory.Villages.village2.spawns,Memory.Villages.village2.controller, debug);
    var village2 = new Village("village3",Memory.Villages.village3.room,Memory.Villages.village3.spawns,Memory.Villages.village3.controller, debug);

    Villages.village1 = village1;
    Villages.village2 = village2;
    Villages.village3 = village3;
}

var upkeep = function upkeep(Villages) {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            for (let village in Memory.Villages) {
                if (Villages[village].hasCreep(i)) {
                    Villages[village].deregister(i);
                    delete Memory['Villages'][village].creeps[i];
                    delete Villages[village].creeps[i];
                }
                break;
            }
            delete Memory.creeps[i];
        }
    }
}

module.exports.init = init;
module.exports.upkeep = upkeep;
