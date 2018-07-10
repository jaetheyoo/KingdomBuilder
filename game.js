var Village = require('game.village')

var init = function initVillage(Villages, debug) {
    if (!Memory.creepNameCounter) {
        Memory.creepNameCounter = 0;
    }
    // write to memory, run once
    if (!Memory.Villages) {
        let village1_Spawn = Game.spawns['Spawn1'];
        let village1_room = village1_Spawn.room;
        let village1_controller = village1_room.controller; 
        let village1_remoteRooms = {
            "W55N48": {
                "remoteSources": {
                    "59f19f8a82100e1594f351e5" : {}
                },
                "remoteController": '59f19f8a82100e1594f351e6',
            },
            "W54N40": {
                "remoteSources": {
                    "59f19f9982100e1594f35405" : {}
                },
                "remoteController": '59f19f9982100e1594f35406',
            },
            "W54N47": {
                "remoteSources": {
                    "59f19f9982100e1594f3540d" : {}
                },
                "remoteController": '59f19f9982100e1594f3540c',
            },
        }

        //let village2_Spawn = Game.spawns['Spawn1'];
        //let village2_room = village1_Spawn.room;
        //let village2_controller = village1_room.controller; 

        Memory.Villages = {
            "village1": {
                "spawn": village1_Spawn.name,
                "room": village1_room.name,
                "controller": village1_controller.id,
                "level": 1,
                "remoteRooms": {
                    "W55N48": {
                        "remoteSources": {
                            "59f19f8a82100e1594f351e5" : {}
                        },
                        "remoteController": '59f19f8a82100e1594f351e6',
                    },
                    "W54N40": {
                        "remoteSources": {
                            "59f19f9982100e1594f35405" : {}
                        },
                        "remoteController": '59f19f9982100e1594f35406',
                    },
                    "W54N47": {
                        "remoteSources": {
                            "59f19f9982100e1594f3540d" : {}
                        },
                        "remoteController": '59f19f9982100e1594f3540c',
                    },
                }
            },
            //"village2": {
            //    "spawn": village2_Spawn.name,
            //    "room": village2_room.name,
            //    "controller": village2_controller.id,
            //    "level":1
            //}
        };
    }
    
    // if recompiled, create new Village objects reading from memory
    var village1 = new Village("village1",Memory.Villages.village1.room,Memory.Villages.village1.spawn,Memory.Villages.village1.controller,  debug);
    //var village2 = new Village("village2",Memory.Villages.village2.room,Memory.Villages.village2.spawn,Memory.Villages.village2.controller, debug);
    Villages.village1 = village1;
    //Villages.village2 = village2;
}

var upkeep = function Upkeep(Villages) {
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            let villages = Object.keys(Memory['Villages']);
            _.forEach(villages, function(village) {
                if (Villages[village].hasCreep(i)) {
                    Villages[village].deregister(i);
                    delete Memory['Villages'][village].creeps[i];
                    delete Villages[village].creeps[i];
                }

            });
            delete Memory.creeps[i];
        }
    }
}

module.exports.init = init;
module.exports.upkeep = upkeep;
