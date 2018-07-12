require('utils.extensions');
var DebugMessage = require('game.debugMessage');
var CreepReporter = require('game.creepReporter');
var CreepConfig = require('game.creepConfig');

// TODO: Do we really need to keep track of structures?
class Village {
    constructor(villageName, roomName, spawnName, controllerId, debug) {
        this.villageName = villageName;
        this.memoryAddr = Memory.Villages[villageName];
        this.roomName = roomName;
        this.remoteRooms = {};
        this.spawnName = spawnName;
        this.room = Game.rooms[roomName];
        this.spawn = Game.spawns[spawnName];
        this.level = 1;
        this.creeps = {};
        this.sources = {};
        this.remoteCreeps = {};
        this.structures = {};
        this.flags = {};
        this.controllerId = controllerId;
        this.controller = Game.structures[controllerId];
        this.spawnQueue = [];
        
        this.debugMessage = new DebugMessage();
        this.debug = debug;
        
        if(!this.memoryAddr['flags']) {
            this.debugMessage.append("Village.ctr: no flags initialized");
            this.initFlags();
        }
        
        if (!this.memoryAddr['creeps']) {
            this.debugMessage.append("Village.ctr: no creeps initialized");
            this.initCreeps();
        }
        if (!this.memoryAddr['structures']) {
            this.debugMessage.append("Village.ctr: no structures initialized")
            this.initStructures();
        }

        if (!this.memoryAddr['sources']) {
            this.debugMessage.append("Village.ctr: no sources initialized")
            this.initSources();
        }
        
        if(!this.memoryAddr['remoteRooms']) {
            this.debugMessage.append("Village.ctr: no remote Rooms initialized")
            this.initRemoteRooms();
        }
        
        this.registerFlags();
        this.registerRemoteRooms();
        this.registerSources();
        this.registerLevel();
        this.registerCreeps();
        this.registerStructures();
    }

    initCreeps() {
        // for each creep in the room, add it to creeps array
        //FEATURE: have remote creep be in their own array
        let that = this;
        this.memoryAddr.creeps = {};
        Game.rooms[this.roomName].find(FIND_MY_CREEPS).forEach(function(c) {
            that.memoryAddr['creeps'][c.name] = {};
        });
    }

    initRemoteRooms() {
        // initialize an empty object with keys that will be manually inserted
        //FEATURE: automate this process
        let that = this;
        this.memoryAddr.remoteRooms = {};
    }
    
    initSources() {
        // for each creep in the room, add it to creeps array
        //FEATURE: have remote creep be in their own array
        let that = this;
        this.memoryAddr.sources = {};
        Game.rooms[this.roomName].find(FIND_SOURCES).forEach(function(s) {
            that.memoryAddr['sources'][s.id] = {harvesters: 0, harvestersAmount: 3, dropHarvesters: 0}; // todo: analyze sources for harvestersAmount
        });
    }
    
    initFlags() {
        let that = this;
        this.memoryAddr.flags = {};
    }
    
    registerFlags() {
        let that = this;
        _.forEach(Object.keys(this.memoryAddr['flags']), function(r) {
            that.flags[r] = that.memoryAddr['flags'][r];            
        });        
    }
    
    registerRemoteRooms() {
        let that = this;
        _.forEach(Object.keys(this.memoryAddr['remoteRooms']), function(r) {
            that.remoteRooms[r] = that.memoryAddr['sources'][r];            
        });        
    }

    registerSources() {
        let that = this;
        _.forEach(Object.keys(this.memoryAddr['sources']), function(s) {
            that.sources[s] = that.memoryAddr['sources'][s];            
        });
    }

    registerCreeps() {
        let that = this;
        _.forEach(Object.keys(this.memoryAddr['creeps']), function(c) {
            that.creeps[c] = that.memoryAddr['creeps'][c];
        });
    }

    registerStructures() {
        let that = this;
        _.forEach(Object.keys(this.memoryAddr['structures']), function(c) {
            that.structures[c] = that.memoryAddr['structures'][c];
        });
    }

    registerLevel() {
        this.level = this.memoryAddr['level'];
    }

    initStructures() {
        // for each creep in the room, add it to creeps array
        //FEATURE: have remote creep be in their own array
        let that = this;
        this.memoryAddr.structures = {};
        Game.rooms[this.roomName].find(FIND_MY_STRUCTURES).forEach(function(s) {
            that.memoryAddr['structures'][s.id] = {};
        });
    }
    
    checkLevel() {
        switch(this.level) {
            case 1: // just starting out
                if (this.controller.level >= 2 && Object.keys(this.creeps).length >= 10){
                    this.levelUp();
                }
                break;
            case 2: // focus on drop mining into containers with transportation
                if (this.controller.level >= 4 && Object.keys(this.creeps).length >= 15){
                    this.levelUp();
                }
                break;
            case 3: // start remote mining // TODO: Not yet implemented in creep Report
                if (this.controller.level >= 6 && Object.keys(this.creeps).length >= 20) {
                    this.levelUp();
                }
                break;
            // case 4: // start harvesting minerals and boosting and using links for remote mining
            //     if (this.controller.level >= 7 && Object.keys(this.creeps).length>= 25) {
            //         this.levelUp();
            //     }
            //     break;
            // case 5: // focus on defense and helping economy of smaller colonies 

        }
    }

    levelUp() {
        this.memoryAddr.level++;
        this.level++;
    }
    
    printStatus() {
        let status = 'STATUS FOR VILLAGE: ' + this.villageName + ' LV: ' + this.level;
        status += `\n\tROOM: ${this.roomName}    REMOTE ROOMS: ${JSON.stringify(this.remoteRooms)}   
        \n\tSPAWN NAME ${this.spawnName}    SPAWN ${this.spawn}
        \n\tCREEPS ${JSON.stringify(this.creeps)}
        \n\tSOURCES ${JSON.stringify(this.sources)}
        \n\tSTRUCTURES ${JSON.stringify(this.structures)}
        \n\tCONTROLLERID ${this.controllerId}
        \n\tSPAWNQUEUE ${JSON.stringify(this.spawnQueue)}`
        console.log(status);
    }
    
    execute() {
        //this.printStatus();
        this.checkLevel();
        this.scanStructures();
        let creepReport = CreepReporter(this.creeps, this.debug, this);
        this.spawnQueue = creepReport.process(); // TODO: only process if I have available energy and my spawn isnt busy
        this.spawnCreep();
    }
    
    // TODO: don't do this every tick
    // TODO: sort structures into bins: extensions, etc.
    scanStructures() {
        // let structures = _.map(this.room.find(FIND_MY_STRUCTURES), x=>x.id);
        // let myStructures = Object.keys(this.structures);
        // if (structures.length > myStructures.length) {
        //     let diff = _.difference(structures, myStructures);
        //     let that = this;
        //     // console.log("DIFF: " + diff);
        //     _.forEach(diff, function(structure) {
        //         // console.log("Structureid to add: " + structure);
        //         that.structures[structure] = {};
        //     });
        // }
    }
    
    spawnCreep() {
        //console.log("PREPARING TO SPAWN: " + this.spawnQueue)
        // TODO: depending on spawning priority, allow skipping forward in the queue
        if (this.spawnQueue.length > 0) {
            let creepToSpawn = this.spawnQueue.peek();
            let creepBuild = new CreepConfig(creepToSpawn, this.level);
            if (this.canSpawn(creepBuild)) {
                let spawnMessage = this.spawn.spawnCreep(creepBuild.body, creepBuild.name);
                if (spawnMessage === OK) {
                    console.log('SUCCESSFULLY SPAWNED: ' + creepBuild.name);
                    this.registerCreep(creepBuild);
                    Memory.creepNameCounter = (Memory.creepNameCounter + 1) % 100;
                    this.spawnQueue.shift();
                    return 0;
                } else {
                    console.log('SPAWN ERROR: ' + spawnMessage);
                    return -1;
                }
            } else {
                // can't spawn
            }
        } else {
            //nothing to spawn
        }
    }

    /**
     * register sources to this creep and add this creep to memory
     * @param {creepBuild} creepBuild 
     */
    registerCreep(creepBuild) {
        console.log(``)
        this.creeps[creepBuild.name] = creepBuild.memoryConfig; // TODO: is this necessary?
        this.memoryAddr.creeps[creepBuild.name] = creepBuild.memoryConfig;
        // console.log('CREEP BUILD ROLE NAME: ' + creepBuild.roleName)
        let mySource;
        switch (creepBuild.roleName) {
            case 'harvester':
                for (let source in this.sources) {
                    if (this.sources[source].harvesters < this.sources[source].harvestersAmount) {
                        mySource = source;
                        this.sources[source].harvesters = this.sources[source].harvesters + 1;
                        break;
                    }
                }
                this.memoryAddr.creeps[creepBuild.name].mySource = mySource;
                break;
            case 'dropHarvester':
                for (let source in this.sources) {
                    if (this.sources[source].harvesters < 1) {
                        mySource = source;
                        this.sources[source].harvesters = this.sources[source].dropHarvesters + 1;
                        break;
                    }
                }
                this.memoryAddr.creeps[creepBuild.name].mySource = mySource;
                break;                
        }
    }

    /**
     * Deregister sources associated with these creeps
     */
    deregister(creepName) {
        //console.log(this.villageName + ' DEREGISTERING: ' + creepName);
        //this.printStatus();
        let source;
        switch(this.creeps[creepName].role) {
            case 'dropHarvester':
                source = this.creeps[creepName].mySource;
                Memory.Villages[this.villageName].sources[source].harvesters--
                break;
            case 'harvester':
                source = this.creeps[creepName].mySource;
                //console.log("IN HEAP: " + JSON.stringify(this.sources[source]));
                //console.log("IN MEM: " + JSON.stringify(this.memoryAddr.sources[source].harvesters));
                Memory.Villages[this.villageName].sources[source].harvesters--
                //console.log("IN MEM: " + JSON.stringify(this.memoryAddr.sources[source].harvesters));
                //console.log("IN HEAP: " + JSON.stringify(this.sources[source]));
                break;
        }
        //this.printStatus();
    }

    canSpawn(creepBuild) {
        return (!this.spawn.spawning && this.getAvailableEnergyForSpawning() >= creepBuild.cost);
    }
    
    getSource(creepName) {
        return Game.getObjectById(this.creeps[creepName].mySource);
    }

    getDropHarvestLocation(creepName) {
        // find the nearest container to my source
        // if you can't find one, return null
        let mySource = getSource(creepName);
        if(!this.sources[mySource.id].container) {
            let containers = mySource.findInRange(FIND_STRUCTURES, 1,  {filter: {structureType: STRUCTURE_CONTAINER}})[0];
            if (containers.length > 0) {
                this.memoryAddr.sources[mySource.id].container = containers[0].id;
            }
        }

        if (this.sources[mySource.id].container) {
            if ( Game.structures(this.sources[mySource.id].container)) {
                return this.sources[mySource.id].container;
            } else {
                delete Memory.Villages[this.villageName].sources[mySource.id].container;
            }
        } 

        return null;
    }

    // TODO: associate these with in-memory structures
    getAvailableEnergyForSpawning() {
        let energyInExtensions = 0;
        _.forEach(this.room.find(FIND_MY_STRUCTURES, {
            filter: function(o) {
                return o.structureType == STRUCTURE_EXTENSION && o.energy > 0
            }
        }), function(structure) {
            energyInExtensions += structure.energy
        });
        //console.log('EnergyInExtension: ' + energyInExtensions);
        
        // _.forEach(Object.keys(this.structures), function(structureId) {
        //     let structure = Game.structures[structureId];
        //     if (structure.structureType == STRUCTURE_EXTENSION) {
        //         // console.log("EXTENSION WITH CAPACITY: " +  structure.energyCapacity)
        //         energyInExtensions += structure.energy;
        //     }
        // })
        
        let energyInSpawn = this.spawn.energy;
        //console.log(energyInSpawn + " energy in spawn")
        //console.log(energyInExtensions + " energy in extensions")
        return energyInExtensions + energyInSpawn;
    }
    
    hasCreep(creepName) {
        return this.creeps[creepName] ? true : false;
    }

    inRemoteRoom(room) {
        return this.remoteRooms[room] ? true : false;
    }

    getHideoutFlag() {
        return this.memoryAddr['flags'].hideoutFlag;
    }

    isStale(ticks) {
        // TODO: decrease stale timer according to stimulus (ie. in war)
        if (!ticks || Game.time - ticks > 500) {
            return true;
        } else {
            return false;
        }
    }

    // TEST: does this actually write to memory;
    getMemAddr(room) {
        let memRoomAddr;
        if (room == this.roomName) {
            memRoomAddr = this.memoryAddr;
        } else {
            let remoteRoom = this.remoteRooms[room];
            if (remoteRoom) {
                let memRoomAddr = this.memoryAddr.remoteRooms[room];
            } else {
                // throw error: this is not a room in my domain
                return;
            }
        }

        return memRoomAddr;
    }

    setShouldNotRepair(room) {
        let memRoomAddr = this.getMemAddr(room);

        memRoomAddr['shouldRepair'] = false;
        memRoomAddr['shouldRepairTime'] = Game.time;
    }

    /**
     * @param {string} room 
     */
    shouldRepair(room) {
        // if there are buildings under their respective hit thresholds, return true
        // TODO: store these thresholds in memory or have them accessible through the village
        // TODO: you only really need to do this once per room per village, and not all that often
        let memRoomAddr = this.getMemAddr(room);
        if (memRoomAddr) {
            let shouldRepairTime = memRoomAddr.shouldRepairTime;

            if (this.isStale(shouldRepairTime)) {
                let containerThreshold = 100000 + villageLevel * 20000;
                let roadThreshold = .6 + villageLevel + .05;
                let wallThreshold = 10000 + 10000 * i * i;
                let rampartThreshold = 10000 + 10000 * i * i;
                let structureThreshold = .8;
                
                let shouldRepair = false;
                let structures = Game.rooms[room].find(FIND_STRUCTURES); // TODO: optimize this
                if (structures.length) {
                    let repairTarget = _.find(structures, function (s) {
                        let type = s.structureType;
                        return ((type == STRUCTURE_CONTAINER && s.hits < containerThreshold) ||
                            (type == STRUCTURE_ROAD && s.hits < roadThreshold) ||
                            (type == STRUCTURE_WALL && s.hits < wallThreshold) ||
                            (type == STRUCTURE_RAMPART && s.hits < rampartThreshold) ||
                            (type == !STRUCTURE_CONTAINER &&
                                type == !STRUCTURE_ROAD && 
                                type == !STRUCTURE_WALL && 
                                type == !STRUCTURE_RAMPART && 
                                s.hits < structureThreshold)
                        );
                    });
                    if (repairTarget) {
                        shouldRepair = true;
                    } else {
                        shouldRepair = false;
                    }
                }
    
                memRoomAddr['shouldRepair'] = shouldRepair;
                memRoomAddr['shouldRepairTime'] = Game.time;
                
                return shouldRepair;
            }
        }
    }
    
    toString() {
        return ("ROOM: " + this.roomName + " | SPAWN: " + this.spawnName + " | CONTROLLER: " + this.controllerId);
    }
}

module.exports = Village;