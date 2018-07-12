var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var roleRepairer = require('role.repairer');
var roleTransporter = require('role.transporter');
var roleScavenger = require('role.scavenger');
var roleRemoteHarvester = require('role.remoteHarvester');
var roleRemoteDropHarvester = require('role.remoteDropHarvester');
var roleRemoteTransfer = require('role.remoteTransfer');
var roleMeleeDefender = require('role.meleeDefender')
var roleClaimer = require('./role.claimer');
var roleScout = require('./role.scout');
var roleMeleeBodyGuard = require('role.meleeBodyGuard');
var roleRemoteBuilder = require('role.remoteBuilder');
var roleUpgraderStarter = require('role.upgraderStarter');
var roleDropHarvester = require('role.dropHarvester');

var roleDrainer = require('./role.drainer');
var roleManualAttack = require('./role.manualAttack');
var roleManualRange = require('./role.manualRange');
var roleManualHeal = require('role.manualHeal');
var conf = require('creep.config');

module.exports.loop = function () {
    // CLEAN-UP
    for(var i in Memory.creeps) {
        if(!Game.creeps[i]) {
            delete Memory.creeps[i];
        }
    }
    
    // WAR CODE
    // try {
    //     // var taxNames = Object.keys(Game.creeps).filter(x=>x.match(/Taxer/gi)).length;
    //     // if (taxNames < 1) {
    //     //     if (taxNames == 1) {
    //     //         if (Game.creeps[Object.keys(Game.creeps).filter(x=>x.match(/Taxer/gi))[0]].ticksToLive < 150) {
    //     //             Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE],'Taxer' + Game.time,{memory:{role:'meleeBodyGuard', guardPostFlag: 'snipeFlag'}})
    //     //         }
    //     //     } else if (taxNames == 0 && Game.time % 5000 == 0) {
    //     //         Game.spawns['Spawn1'].spawnCreep([ATTACK,ATTACK,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE,MOVE,MOVE],'Taxer' + Game.time,{memory:{role:'meleeBodyGuard', guardPostFlag: 'snipeFlag'}})
    //     //     }
    //     // }
        
        
    //     if (Game.time < 7818900 ) {
    //         if(!Game.creeps['a1']) {
    //             Game.spawns['Spawn1'].spawnCreep( [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
    //                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
    //                TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
    //                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
    //                MOVE,MOVE,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE],'a2',{memory:{role:'manualAttack', attackFlag:'attackFlag',healFlag:'healFlag'}})
    //         }
    //         if(!Game.creeps['h']) {
    //             Game.spawns['Spawn1'].spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],'h',{memory:{role:'manualHeal', flag: 'healer'}})
    //         }
    //         if(!Game.creeps['h93425']) {
    //             Game.spawns['Spawn1'].spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],'h1',{memory:{role:'manualHeal', flag: 'healer2'}})
    //         }            
    //         if (!Game.creeps['h2']){
    //             Game.spawns['Spawn1'].spawnCreep( [MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,HEAL,HEAL,HEAL,HEAL,HEAL,HEAL],'h2',{memory:{role:'manualHeal', flag: 'healer3'}})
    //         }
    //         if(!Game.creeps['a2']) {
    //             Game.spawns['Spawn1'].spawnCreep( [TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
    //                TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,TOUGH,
    //                TOUGH,TOUGH,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
    //                MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,MOVE,
    //                MOVE,MOVE,ATTACK,ATTACK,ATTACK,MOVE,MOVE,MOVE],'a2',{memory:{role:'manualAttack', attackFlag:'attackFlag',healFlag:'healFlag'}})
    //         }
    //    }
    // } catch (err) {
    //     console.log('taxer didnt work');
    // }

    let closeHarvesters = Game.spawns['Spawn1'].pos.findInRange(FIND_MY_CREEPS, 1,{
        filter: _creep => (_creep.memory.role == 'harvester') && _creep.ticksToLive < 600 && _creep.ticksToLive > 150
    });
    closeHarvesters.forEach(_creep => Game.spawns['Spawn1'].renewCreep(_creep)); 
    
    var tower3 = Game.getObjectById('5b415d9ca8f9805e72b8b1aa');
    if(tower3) {
        var closestHostile = tower3.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower3.attack(closestHostile);
        }
    }
    
    var tower = Game.getObjectById('5b35dcb7ca59fe44212e6cb7');
    if(tower) {
        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }
    
    var tower2 = Game.getObjectById('5b3981e6cb0b34591b3ef9b7');
    if(tower2) {
        var closestDamagedStructure = tower2.pos.findClosestByRange(FIND_STRUCTURES, {
             filter: (structure) => structure.hits < structure.hitsMax &&
                structure.hits < 4500
        });

        var closestHostile = tower2.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower2.attack(closestHostile);
        }
        if(closestDamagedStructure) {
            tower2.repair(closestDamagedStructure);
        }


    }

    var energyAvailable = Game.spawns.Spawn1.energy;
    _.filter(Game.structures, function(structure){
        if (structure.structureType == STRUCTURE_EXTENSION){
            energyAvailable += structure.energy;
        }
    });

    var hostileCreeps = Game.spawns['Spawn1'].room.find(FIND_HOSTILE_CREEPS);
    let manualOverride = false;
    if (!manualOverride) {
        if (false){//hostileCreeps.length > 0) {
            let meleeDefenderNames = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.name.match(/MeleeDefender/gi);
                }
            }).map(x => x.name);
            if (meleeDefenderNames.length < hostileCreeps.length && energyAvailable >= conf.MELEE_DEFENDER_COST) {
                //Game.spawns['Spawn1'].spawnCreep(conf.MELEE_DEFENDER_CONFIG, "MeleeDefender" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'meleeDefender'}})
            }
        } else {
            try {
                var energyCapacity = Game.spawns.Spawn1.energyCapacity;
                _.filter(Game.structures, function(structure){
                    if (structure.structureType == STRUCTURE_EXTENSION){
                        energyCapacity += structure.energyCapacity;
                    }
                });    
                
                var harvestFlags = Game.spawns['Spawn1'].room.find(FIND_FLAGS, {
                    filter: function(object) {
                        return object.name.match(/Harvest/gi);
                    }
                });
                
                var harvesterNames = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, {
                    filter: function(object) {
                        return object.name.match(/Harvest[AB]/gi);
                    }
                }).map(x => x.name);
    
                var claimerNames = Object.keys(Game.creeps).filter(x=>x.match(/Claimer/gi));
        
                var upgraderNames = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, {
                    filter: function(object) {
                        return object.name.match(/Upgrade/gi);
                    }
                }).map(x => x.name);
                
                var builderNames = Object.keys(Game.creeps).filter(x=>x.match(/Builder/gi)).length;
                
                var remoteHarvesterNames = Object.keys(Game.creeps).filter(x=>x.match(/RHR1/gi)).length;
                var remoteHarvesterRoom2Names = Object.keys(Game.creeps).filter(x=>x.match(/RHR2/gi)).length;
                
                var remoteDropHarvester = Object.keys(Game.creeps).filter(x=>x.match(/RemoteDropHarvester/gi));
                var remoteTransferNames = Object.keys(Game.creeps).filter(x=>x.match(/RemoteTransfer/gi));
        
        
                var transporterNames = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, {
                    filter: function(object) {
                        return object.name.match(/Transporter/gi);
                    }
                }).map(x => x.name);
        
                var scavengerNames = Game.spawns['Spawn1'].room.find(FIND_MY_CREEPS, {
                    filter: function(object) {
                        return object.name.match(/Scavenger/gi);
                    }
                }).map(x => x.name);
                
                const REMOTE_HARVEST_TRAVEL_TIME = 100;
                const REMOTE_HARVEST_SPAWN_TIME = 63;
        
                var energyInContainers = 0;
                adjustedUpgraderCount = conf.UPGRADER_COUNT;
                if(Game.creeps['HarvestA1']){
                    Game.creeps['HarvestA1'].pos.findClosestByRange(FIND_STRUCTURES, {
                        filter: (structure) => {
                            if((structure.structureType == STRUCTURE_CONTAINER || structure.structureType == STRUCTURE_STORAGE) && 
                                structure.store[RESOURCE_ENERGY] > 0) {
                                energyInContainers+=structure.store[RESOURCE_ENERGY]
                                };
                        }
                    });
                    if (energyInContainers >= 5000) {
                        adjustedUpgraderCount += Math.floor(energyInContainers/(5000 + 2000*upgraderNames.length));
                    }
                }
                let spawningClaimer = false;
                let claimerFlags = ['guardPost1', 'guardPost2'];
                var currentClaimers = claimerNames.length;
                if(Game.time % 600 >= 300 && Game.time % 600 <= 399) {
                    for (flag in claimerFlags) {
                        let myCounter = 0;
                        let found = false;
                        let myclaimers = claimerNames;
                        while (myCounter < conf.CLAIMER_COUNT && !found) {
                            let myClaimer = _.find(myclaimers, function(o) { return Game.creeps[o].memory.claimFlag === claimerFlags[flag]; })
                            if (myClaimer) {
                                myclaimers = myclaimers.filter(x=>x!=myClaimer);
                                myCounter++;
                            } else {
                                found = true;
                                if (currentClaimers < conf.CLAIMER_COUNT*2 && energyAvailable >= conf.CLAIMER_COST) {
                                    while (Game.spawns['Spawn1'].spawnCreep(conf.CLAIMER_CONFIG, "Claimer" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'claimer',claimFlag: claimerFlags[flag]}})  == ERR_NAME_EXISTS) {
                                        Game.spawns['Spawn1'].spawnCreep(conf.CLAIMER_CONFIG, "Claimer" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'claimer',claimFlag: claimerFlags[flag]}});
                                    }
                                    spawningClaimer = true;
                                }
                            }
                        }
                    }
                }
                
                if (!spawningClaimer || Object.keys(Game.creeps).length < 15) {
                    let pickupFlags = ['Dropoff2']; //Dropoff1
                    for (flag in pickupFlags) {
                        let myCounter = 0;
                        let found = false;
                        let myRemoteTransferNames = remoteTransferNames;
                        while (myCounter < conf.REMOTE_TRANSFER_COUNT && !found) {
                            let myTransferer = _.find(myRemoteTransferNames, function(o) { return Game.creeps[o].memory.pickupFlag === pickupFlags[flag]; })
                            if (myTransferer) {
                                myRemoteTransferNames = myRemoteTransferNames.filter(x => x!= myTransferer);
                                myCounter++;
                            } else {
                                found = true;
    
                                if (remoteTransferNames.length < conf.REMOTE_TRANSFER_COUNT*2 && energyAvailable >= conf.REMOTE_TRANSFER_COST) {
                                    while (Game.spawns['Spawn1'].spawnCreep(conf.REMOTE_TRANSFER_CONFIG, "RemoteTransfer" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'remoteTransfer',pickupFlag: pickupFlags[flag]}})  == ERR_NAME_EXISTS) {
                                        Game.spawns['Spawn1'].spawnCreep(conf.REMOTE_TRANSFER_CONFIG, "RemoteTransfer" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'remoteTransfer',pickupFlag: pickupFlags[flag]}});
                                    }
                                }
                            }
                        }
                    }
                    
                    if (remoteHarvesterNames < conf.REMOTE_DROP_HARVESTER_COUNT-1 && energyAvailable >= conf.REMOTE_DROP_HARVESTER_COST) {
                        if (remoteHarvesterNames > 0) {
                            var minTicks = 9999;
                            var myRemoteHarvesterNames =  Object.keys(Game.creeps).filter(x=>x.match(/RHR1/gi));
                            for (names in myRemoteHarvesterNames) {
                                if (Game.creeps[myRemoteHarvesterNames[names]].ticksToLive < minTicks){
                                    minTicks = Game.creeps[myRemoteHarvesterNames[names]].ticksToLive;
                                }
                            }
                            if (remoteHarvesterNames < conf.REMOTE_DROP_HARVESTER_COUNT-1 || minTicks <= (REMOTE_HARVEST_TRAVEL_TIME + REMOTE_HARVEST_SPAWN_TIME)) {
                                Game.spawns['Spawn1'].spawnCreep(conf.REMOTE_DROP_HARVESTER_CONFIG, "RHR1" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'remoteHarvester', harvestFlag:'RemoteSource0',dropOffFlag:'Dropoff1'}, directions: [BOTTOM_RIGHT]});
                            } 
                        } else {
                            Game.spawns['Spawn1'].spawnCreep(conf.REMOTE_DROP_HARVESTER_CONFIG, "RHR1" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'remoteHarvester', harvestFlag:'RemoteSource0',dropOffFlag:'Dropoff1'}, directions: [BOTTOM_RIGHT]});
                        }
                    } 
                    if(remoteHarvesterRoom2Names < conf.REMOTE_DROP_HARVESTER_COUNT && energyAvailable >= conf.REMOTE_DROP_HARVESTER_COST) {
                        if (remoteHarvesterRoom2Names > 0) {
                            var minTicks = 9999;
                            var myRemoteHarvesterNames =  Object.keys(Game.creeps).filter(x=>x.match(/RHR2/gi));
                            for (names in myRemoteHarvesterNames) {
                                if (Game.creeps[myRemoteHarvesterNames[names]].ticksToLive < minTicks){
                                    minTicks = Game.creeps[myRemoteHarvesterNames[names]].ticksToLive;
                                }
                            }
    
                            if (remoteHarvesterRoom2Names < conf.REMOTE_DROP_HARVESTER_COUNT || minTicks <= (REMOTE_HARVEST_TRAVEL_TIME + REMOTE_HARVEST_SPAWN_TIME)) {
                                Game.spawns['Spawn1'].spawnCreep(conf.REMOTE_DROP_HARVESTER_CONFIG, "RHR2" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'remoteHarvester', harvestFlag:'RemoteSource2',dropOffFlag:'Dropoff2'}, directions: [BOTTOM_RIGHT]});
                            } 
                        } else {
                            Game.spawns['Spawn1'].spawnCreep(conf.REMOTE_DROP_HARVESTER_CONFIG, "RHR2" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'remoteHarvester',harvestFlag:'RemoteSource2',dropOffFlag:'Dropoff2'}, directions: [BOTTOM_RIGHT]});
                        }
                    } 
                    
                    if (harvesterNames.length < harvestFlags.length && energyAvailable >= conf.DROP_HARVESTER_COST) {
                        var harvesterName = harvestFlags.find(function(flag) {
                            return !harvesterNames.includes(flag.name);
                        }).name;
                        if(harvesterName.includes("A1")) {
                            Game.spawns['Spawn1'].spawnCreep(conf.DROP_HARVESTER_CONFIG, harvesterName, {memory:{role:'harvester'}});
                        } else if (harvesterName.includes("B1Left")) {
                            Game.spawns['Spawn1'].spawnCreep(conf.DROP_HARVESTER_CONFIG, harvesterName, {memory:{role:'harvester'}, directions: [LEFT]});
                        }
                    } else if (upgraderNames.length < adjustedUpgraderCount && energyAvailable >= conf.UPGRADER_COST) {
            
                        while(Game.spawns['Spawn1'].spawnCreep(conf.UPGRADER_CONFIG, "Upgrader" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'upgrader'}}) == ERR_NAME_EXISTS) {
                            Game.spawns['Spawn1'].spawnCreep(conf.UPGRADER_CONFIG, "Upgrader" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'upgrader'}})
                        }
                    } else if (builderNames <conf. BUILDER_COUNT && energyAvailable >= conf.BUILDER_COST) {
                        let myRoom = '';
                        let mySearchFlag = false;
                        if (Math.floor(Math.random() * Math.floor(100)) >= 50) {
                            myRoom = 'RemoteRoom';
                            mySearchFlag = 'RemoteRoom';
                        } else {
                            myRoom = 'RemoteRoom2';
                            mySearchFlag = 'RemoteRoom2';
                        }
                        while(Game.spawns['Spawn1'].spawnCreep(conf.BUILDER_CONFIG, "Builder" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'builder', room: myRoom, withdrawFlag: 'RemoteDropOff'}}) == ERR_NAME_EXISTS) {
                            Game.spawns['Spawn1'].spawnCreep(conf.BUILDER_CONFIG, "Builder" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'builder',room: myRoom, withdrawFlag: 'RemoteDropOff'}})
                        }
                    } else if (scavengerNames.length < conf.SCAVENGER_COUNT && energyAvailable >= conf.SCAVENGER_COST) {
                        while(Game.spawns['Spawn1'].spawnCreep(conf.SCAVENGER_CONFIG, "Scavenger" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'scavenger'}}) == ERR_NAME_EXISTS) {
                            Game.spawns['Spawn1'].spawnCreep(conf.SCAVENGER_CONFIG, "Scavenger" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'scavenger'}})
                        }
                    } else if (transporterNames.length < conf.TRANSPORTER_COUNT && energyAvailable >= conf.TRANSPORTER_COST) {
                        while(Game.spawns['Spawn1'].spawnCreep(conf.TRANSPORTER_CONFIG, "Transporter" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'transporter'}}) == ERR_NAME_EXISTS) {
                            Game.spawns['Spawn1'].spawnCreep(conf.TRANSPORTER_CONFIG, "Transporter" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'transporter'}})
                        }
                    } else if (harvesterNames.length < harvestFlags.length && energyAvailable >= conf.CHEAP_HARVESTER_COST) {
                        var harvesterName = harvestFlags.find(function(flag) {
                            return !harvesterNames.includes(flag.name);
                        }).name;
                        
                        var spawnDir = [];
                        
                        if(harvesterName.includes("BottomLeft")) {
                            spawnDir.push(BOTTOM_LEFT);
                        } else if (harvesterName.includes("Left")) {
                            spawnDir.push(LEFT);
                        }
                        if (spawnDir.length > 0) {
                            Game.spawns['Spawn1'].spawnCreep(conf.CHEAP_HARVESTER_CONFIG, harvesterName, {memory:{role:'harvester'}, directions: spawnDir});
                        } else {
                            Game.spawns['Spawn1'].spawnCreep(conf.CHEAP_HARVESTER_CONFIG, harvesterName, {memory:{role:'harvester'}});
                        }
                    } else if (builderNames < conf.BUILDER_COUNT && energyAvailable >= conf.CHEAP_BUILDER_COST) {
                        while(Game.spawns['Spawn1'].spawnCreep(conf.CHEAP_BUILDER_CONFIG, "Builder" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'builder', room:'RemoteRoom2'}}) == ERR_NAME_EXISTS) {
                            Game.spawns['Spawn1'].spawnCreep(conf.CHEAP_BUILDER_CONFIG, "Builder" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'builder',room:'RemoteRoom2'}})
                        }
                    }
                    let meleeBodyGuardCount = Object.keys(Game.creeps).filter(x=>x.match(/MBG/gi));
                    for (guard in meleeBodyGuardCount) {
                        if (Game.creeps[meleeBodyGuardCount[guard]] && Game.creeps[meleeBodyGuardCount[guard]].ticksToLive < 150) {
                            meleeBodyGuardCount = meleeBodyGuardCount.filter(x => x != meleeBodyGuardCount[guard]);
                        }
                    }
                    let guardPostFlags = ['guardPost1','guardPost2'];
                    for (flag in guardPostFlags) {
                        let guard = _.find(meleeBodyGuardCount, function(o) { return Game.creeps[o].memory.guardPostFlag === guardPostFlags[flag]; })
                        if (!guard) {
                            if (meleeBodyGuardCount.length < conf.MELEE_BODYGUARD_COUNT && energyAvailable >= conf.MELEE_BODYGUARD_COST) {
                                while(Game.spawns['Spawn1'].spawnCreep(conf.MELEE_BODYGUARD_CONFIG, "MBG" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'meleeBodyGuard', guardPostFlag: guardPostFlags[flag]}}) == ERR_NAME_EXISTS) {
                                    Game.spawns['Spawn1'].spawnCreep(conf.MELEE_BODYGUARD_CONFIG, "MBG" + Math.floor(Math.random() * Math.floor(100)), {memory:{role:'meleeBodyGuard',guardPostFlag: guardPostFlags[flag]}})
                                }
                            }
                        }
                    }
                }
            } catch (err) {
                console.log(err);
            }
            
        }
    }
    
    
    let fromLink = Game.flags['Dropoff1'].pos.findInRange(FIND_MY_STRUCTURES,0)[0];
    let fromLink2 = Game.flags['Dropoff2'].pos.findInRange(FIND_MY_STRUCTURES,0)[0];
    let toLink = Game.flags['toLink'].pos.findInRange(FIND_MY_STRUCTURES,0)[0];
    if (fromLink && fromLink.energy >= 400) {
        let energyToSend = toLink.energyCapacity - toLink.energy;
        if (fromLink.energy < energyToSend) {
            energyToSend = fromLink.energy;
        }
        if (energyToSend >= 350) {
            fromLink.transferEnergy(toLink,energyToSend);
        }
    }
    if (fromLink2 && fromLink2.energy >= 400) {
        let energyToSend = toLink.energyCapacity - toLink.energy;
        if (fromLink2.energy < energyToSend) {
            energyToSend = fromLink2.energy;
        }
        if (energyToSend >= 350) {
            fromLink2.transferEnergy(toLink,energyToSend);
        }
    }
    
    if (Game.spawns['Spawn2'].room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.memory.role=='builder' || object.memory.role=='repairer';
        }
    }).length < 3 && Game.spawns['Spawn2'].room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.memory.role=='harvester' ;
        }}).length >=5) {
        Game.spawns['Spawn2'].spawnCreep([WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE], 'bu' + Game.time.toString(), {memory: {role: 'builder', withdrawFlag: 'S2', room: 'S2R2'}})
    }
    
    if (Game.spawns['Spawn2'].room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.memory.role=='dropHarvester';
        }
    }).length < 1) {
        Game.spawns['Spawn2'].spawnCreep([WORK,WORK,WORK,WORK,WORK,MOVE,MOVE,MOVE], "dh" + Game.time.toString(), {memory: {role: 'dropHarvester', myFlag: 'R2Source1', sourceId: '59f19fad82100e1594f35641'}})
    }
    
    if (Game.spawns['Spawn2'].room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.memory.role=='scavenger';
        }
    }).length < 2) {
        Game.spawns['Spawn2'].spawnCreep([CARRY,CARRY,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE], "scav" + Game.time.toString(), {memory: {role: 'scavenger', myDropOffFlag: 'Room2Spawn', mySpawn: 'Spawn2', harvestFlag: 'R2Source1'}})
    }
    
    if (Game.spawns['Spawn2'].room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.memory.role=='upgraderStarter';
        }
    }).length < 0) {
        Game.spawns['Spawn2'].spawnCreep([WORK,WORK,WORK,WORK,WORK,WORK,CARRY,CARRY,CARRY,CARRY,MOVE,MOVE,MOVE,MOVE,MOVE], "up" + Game.time.toString(), {memory: {role: 'upgraderStarter'}})
    }
    if (Game.spawns['Spawn2'].room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.memory.role=='harvester';
        }
    }).length < 5) {
        if (Game.spawns['Spawn2'].spawnCreep([WORK,WORK,WORK,CARRY,MOVE,MOVE], 'harv' + Game.time.toString(), {memory: {role: 'harvester'}})==-6) {
            //Game.spawns['Spawn2'].spawnCreep([WORK,CARRY,MOVE,MOVE], 'harv' + Game.time.toString(), {memory: {role: 'harvester'}})
        }
    }
    

    /* END RESPAWNING LOGIC */
    
    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if (creep.memory.role == 'remoteBuilder') {
            roleRemoteBuilder.run(creep);
        }
        else if (creep.memory.role == 'manualAttack') {
            roleManualAttack.run(creep)
        } else if (creep.memory.role == 'drainer') {
            roleDrainer.run(creep)
        } else if (creep.memory.role == 'manualRange') {
            roleManualRange.run(creep)
        }  else if (creep.memory.role == 'manualHeal') {
            roleManualHeal.run(creep)
        } else if (creep.memory.role == 'meleeBodyGuard') {
            try {
                creep.say('🛡️');
                roleMeleeBodyGuard.run(creep);
            } catch (err) {
                console.log(err);
            }     
        } else if(creep.memory.role == 'meleeDefender') {
            try {
                creep.say('DIE');
                roleMeleeDefender.run(creep);
            } catch (err) {
                console.log(err);
            }     
        } else if (creep.memory.role == 'scout') {
            try {
                creep.say('hello');
                roleScout.run(creep);
            } catch (err) {
                    console.log(err);
            }
        }else if(creep.memory.role == 'claimer') {
            try {
                creep.say('🚩');
                roleClaimer.run(creep);
            } catch (err) {
                console.log(err);
            }
        } else if (creep.pos.findInRange(FIND_HOSTILE_CREEPS,10).length) {
            try {
                creep.moveTo(Game.flags['DefenseWaiting']);
                creep.say('RUNNNN')
            } catch (err) {
                    console.log(err);
            }     
        } else {
            let repairers = creep.room.find(FIND_MY_CREEPS, {
                filter: function(object) {
                    return object.memory.role === 'repairer';
                }
            });
            
            var adjustedMaxRepairers = conf.MAXREPAIRERS;
            if (creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)) {
                try {
                    adjustedMaxRepairers--;
                } catch (err) {
                    console.log(err);
                }
            }
    
            if (creep.ticksToLive <= 10) {
                try {
                    creep.say("💀 RIP");
                    creep.moveTo( Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#272626'}});
                    Game.spawns['Spawn1'].recycleCreep(creep);
                } catch (err) {
                        console.log(creep.name + " | " + err);
                    }     
            } else {
                if(creep.memory.role == 'repairer') {
                    try {
                        creep.say('🔧');
                        roleRepairer.run(creep, repairers.length >= adjustedMaxRepairers);
                    } catch (err) {
                       console.log('REPAIRER ERROR: ' + err);
                    }     
                }
                
                if(creep.memory.role == 'remoteHarvester') {
                    try {
                        creep.say('✈️🔋');
                        roleRemoteHarvester.run(creep);
                    } catch (err) {
                       console.log('REMOTE HARVESTER ERROR: ' + err);
                    }     
                }
                
                if(creep.memory.role == 'remoteTransfer') {
                    try {
                        roleRemoteTransfer.run(creep);
                    } catch (err) {
                       console.log('REMOTE Transfer: ' + err);
                    }     
                }
                
                if(creep.memory.role == 'harvester') {
                    try {
                        creep.say('🔋');
                        roleHarvester.run(creep);
                    } catch (err) {
                       console.log('HARVESTER: ' + err);
                    }     
                }
                if(creep.memory.role == 'transporter') {
                    try {
                        creep.say('🚌');
                        //let shouldWait = harvesterNames.length < harvestFlags.length || upgraderNames.length < conf.UPGRADER_COUNT || builderNames < conf.BUILDER_COUNT;
                        let shouldWait = false;
                        roleTransporter.run(creep, shouldWait);
                    } catch (err) {
                       console.log('TRANSPORTER: ' + err);
                    }                        
                }
                if(creep.memory.role == 'scavenger') {
                    try {
                        creep.say('🦉');
                        //let shouldWait = harvesterNames.length < harvestFlags.length || upgraderNames.length < conf.UPGRADER_COUNT || builderNames < conf.BUILDER_COUNT;
                        let shouldWait = false;                
                        roleScavenger.run(creep, shouldWait);
                    } catch (err) {
                       console.log('SCAVENGER: ' + err);
                    }
                }
                if(creep.memory.role == 'dropHarvester') {
                    try {
                        creep.say('Drop');
                        //let shouldWait = harvesterNames.length < harvestFlags.length || upgraderNames.length < conf.UPGRADER_COUNT || builderNames < conf.BUILDER_COUNT;
                        roleDropHarvester.run(creep, Game.flags[creep.memory.myFlag], Game.getObjectById(creep.memory.sourceId));
                    } catch (err) {
                       console.log('DROP HARVESTER: ' + err);
                    }
                }
                if(creep.memory.role == 'upgrader') {
                    try {
                        creep.say('⏫');
                        roleUpgrader.run(creep);
                    } catch (err) {
                        console.log('Upgrader' + err);
                    }
                }
                if(creep.memory.role == 'builder') {
                    try {
                        roleBuilder.run(creep, repairers.length >= adjustedMaxRepairers);
                    } catch (err) {
                        console.log('Builder: ' + err);
                    }
                }
                if (creep.memory.role == 'upgraderStarter') {
                    try {
                        roleUpgraderStarter.run(creep);
                    } catch (err) {
                        console.log('UpgradeStarter: ' + err);
                    }
                }
            }
        }
    }
}

getAvailableEnergy = function() {
    var energyAvailable = Game.spawns.Spawn1.energy;
    _.filter(Game.structures, function(structure){
        if (structure.structureType == STRUCTURE_EXTENSION){
            energyAvailable += structure.energy;
        }
    });
    return energyAvailable;
}