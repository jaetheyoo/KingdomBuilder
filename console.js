/*
Cost for 1 remote room, 1 source : 4465
Cost for 1 remote room, 2 source: 6315
15000 per source
net 10535 for 1 source room
23685 for 2 source room
*/
Game.spawns['Spawn1'].spawnCreep([MOVE],'bob',{memory:{role:'extends'}})
Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE],'bob',{memory:{role:'manualAttack', attackFlag: 'attack'}})

Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE],'bob',{memory:{role:'extends'}})
Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],'r1',{memory:{role:'remoteBuilder',searchFlag:'Room2Spawn'}})

Game.spawns['Spawn1'].spawnCreep( [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE],'a1',{memory:{role:'manualAttack', attackFlag:'attackFlag',healFlag:'healFlag'}})
Game.spawns['Spawn1'].spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE],'h',{memory:{role:'manualHeal', flag: 'healer'}})
Game.spawns['Spawn2'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'u1', {memory: {role: 'upgraderStarter'}})


Game.spawns['Spawn1'].spawnCreep( [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
    HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,
    TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
    MOVE,MOVE,WORK,ATTACK,MOVE,MOVE,MOVE],'a1',{memory:{role:'goliath', attackFlag:'attackFlag',healFlag:'healFlag'}})

    Game.spawns['Spawn3'].spawnCreep( [WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
        WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,WORK,
        WORK,WORK,WORK,WORK,WORK,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
        MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
        MOVE,MOVE,MOVE,MOVE,MOVE],'breaker',{memory:{role:'breaker', attackFlag:'attackFlag',healFlag:'healFlag'}})
    

//harvester maximization
//50*c*1420/(90+25c/w)-75c-125w where w=17, c=16

Game.creeps[''].moveTo(Game.getObjectById(''))
Game.creeps[''].transfer(Game.getObjectById(''), RESOURCE_ENERGY)
Game.creeps[''].transfer(Game.getObjectById(''), 'GO')
Game.creeps[''].withdraw(Game.getObjectById(''), RESOURCE_ENERGY)
Game.creeps[''].withdraw(Game.getObjectById(''), 'GO')
Game.getObjectById('5b48d94600dde4430f38b2ae').boostCreep(Game.creeps['breaker'], 25)

Game.creeps['breaker'].moveTo(Game.getObjectById(''))

Game.creeps['Upgrader66'].withdraw(Game.getObjectById('5b36e502b1fd8267f9bd48a2'), 'ZH')
Game.creeps['Upgrader66'].transfer(Game.getObjectById('5b48d94600dde4430f38b2ae'), 'ZH')
