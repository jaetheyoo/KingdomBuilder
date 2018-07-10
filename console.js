/*
from base: 1486
to dude: 



*/
Game.spawns['Spawn1'].spawnCreep([MOVE],'bob',{memory:{role:'extends'}})
Game.spawns['Spawn1'].spawnCreep([MOVE],'bob',{memory:{role:'extends'}})
Game.spawns['Spawn1'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,WORK,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE],'r1',{memory:{role:'remoteBuilder',searchFlag:'Room2Spawn'}})

Game.spawns['Spawn1'].spawnCreep( [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
                    TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
                    MOVE,MOVE,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE],'a1',{memory:{role:'manualAttack', attackFlag:'attackFlag',healFlag:'healFlag'}})
Game.spawns['Spawn1'].spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL,MOVE],'h',{memory:{role:'manualHeal', flag: 'healer'}})
Game.spawns['Spawn2'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'u1', {memory: {role: 'upgraderStarter'}})


//harvester maximization
//50*c*1420/(90+25c/w)-75c-125w where w=17, c=16