require('creepExtensions')
var Village = require('game.village')
var DebugMessage = require('game.debugMessage')
var _Game = require('./game');
var debug = false;

var Villages = {}

_Game.init(Villages, debug);

module.exports.loop = function () {
    /*
    main loop:
    
    ROOMS
    each room with a spawn has a priority and directive
    write each room into memory
    for each room with a spawn, execute directive
        go through creep in room
    for each remote mining room
        handle each remote creep individually
    for each attack squad
        handle each squad individually
    non-room creep will be handled with flags

    CreepReporter
        for each creep
            each creep has a memory for a move override
            creep.run( role, extends creep.base role
                -- for fighter creep, they extend fighter base role
                -- base role: if theres an enemy,.run( | if I'm about to die, go home
            tally up creep, roles, memory
        returns Creep Report
    
    process(creep report)
        for each creep type

        return what creep to make depending on priority
    
    SpawnCreep(creep to make)


    ----
    creep.run( prototype
        switch on memory.role
        .run( the role corresponding to the role in mem



    */
    _Game.upkeep(Villages);
    for (let village in Villages) {
        try {
            Villages[village].execute();
        } catch (err) {
            console.log(err);
        }
        
        if(debug) {
            Villages[village].debugMessage.log();
        }
    }
}

