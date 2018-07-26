require('creepExtensions')
BASE_CREEP = require('role.base');
CREEP_SPEECH = require('utils.speech');
var Village = require('game.village')
var DebugMessage = require('game.debugMessage')
var _Game = require('./game');
var debug = false; 

var Villages = {};

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
    
    Villages.village3.manageMarket(true);
    
    let myCreepName = 'bob';
    let myCreep = Game.creeps['bob'];
    if (myCreep) {
        if (false) {//if (myCreep.memory.attackTarget) {
            let enemy = Game.getObjectById(myCreep.memory.attackTarget);
            if (enemy) {
                if (myCreep.rangedAttack(enemy)==ERR_NOT_IN_RANGE) {
                    myCreep.moveTo(enemy);
                } else if (enemy.getActiveBodyparts(ATTACK) > 0) {
                    let ret = PathFinder.search(myCreep.pos, {pos: enemy.pos, range: 3}, {flee:true});
                    let nextPos = ret.path[0];
                    myCreep.move(creep.pos.getDirectionTo(nextPos));
                } else {
                    myCreep.moveTo(enemy);
                }
                return;    
            } else {
                delete myCreep.memory.attackTarget;
            }
        }
        if (myCreep.hits < myCreep.hitsMax) {
            myCreep.heal(myCreep);
        }
        
        let target = myCreep.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        
        if(target) {
            if(myCreep.rangedAttack(target) == ERR_NOT_IN_RANGE) {
                if (myCreep.rangedAttack(target)==ERR_NOT_IN_RANGE) {
                    myCreep.moveTo(target);
                } else if (target.getActiveBodyparts(ATTACK) > 0){
                    let ret = PathFinder.search(creep.pos, {pos: enemy.pos, range: 3}, {flee:true});
                    let nextPos = ret.path[0];
                    myCreep.move(creep.pos.getDirectionTo(nextPos));
                } else {
                    myCreep.moveTo(target);
                }
            }
            myCreep.attack(target);
        } else {
            Game.creeps['bob'].moveTo(Game.flags[Game.creeps['bob'].memory.myFlag], {visualizePathStyle: {stroke: '#ffffff'}})
        }
    } else {
        Game.spawns['Spawn3'].spawnCreep([RANGED_ATTACK,RANGED_ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,RANGED_ATTACK,HEAL],'bob', {memory:{myFlag:'b'}})
    }
    
    myCreepName = 'blob';
    myCreep = Game.creeps['blob'];
    if (myCreep) {
        Game.creeps['blob'].moveTo(Game.flags[Game.creeps['blob'].memory.attackFlag], {visualizePathStyle: {stroke: '#ffffff'}})
        
        drainFlag = Game.flags[myCreep.memory.drainFlag];
        healFlag = Game.flags[myCreep.memory.healFlag];
        if (myCreep.memory.draining && drainFlag && !myCreep.pos.isEqualTo(drainFlag.pos)) {
            myCreep.moveTo(drainFlag, {visualizePathStyle: {stroke: '#ffffff'}})
        } else {
           myCreep.memory.draining = false;
        }
        if (!myCreep.memory.draining) {
            if (myCreep.hits <= myCreep.hitsMax-300) {
                myCreep.moveTo(healFlag, {visualizePathStyle: {stroke: '#ffffff'}})
            } else if(myCreep.hits === myCreep.hitsMax) {
                myCreep.memory.draining = true;
            }
        }

        var target = myCreep.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: function(object) {
                return object.hits < object.hitsMax;
            }
        });
        if(target) {
            if(myCreep.pos.isNearTo(target)) {
                myCreep.heal(target);
            }
        }
    } else {
        Game.spawns['Spawn3'].spawnCreep([TOUGH,TOUGH,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,],'blob', {memory:{drainFlag:'a', healFlag: 'h'}})
    }
}

