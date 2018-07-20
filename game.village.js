require('utils.extensions');
var DebugMessage = require('game.debugMessage');
var CreepReporter = require('game.creepReporter');
var CreepConfig = require('game.creepConfig');

// TODO: Do we really need to keep track of structures?
class Village {
    constructor(villageName, roomName, spawnNames, controllerId, debug) {
        this.villageName = villageName;
        this.roomName = roomName;
        this.spawnNames = spawnNames;
        this.spawns = [];
        for (let mySpawnName in this.spawnNames) {
            let mySpawn = Game.spawns[this.spawnNames[mySpawnName]];
            if (mySpawn) {
                this.spawns.push(mySpawn);
            }
        }
        this.level = 1;
        this.remoteCreeps = {};
        this.flags = {};
        this.controllerId = controllerId;
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
        this.registerLevel();
    }
    
    get memoryAddr() {
        return Memory.Villages[this.villageName];
    }

    get room() {
        return Game.rooms[this.roomName];
    }

    get controller() {
        return Game.structures[this.controllerId];
    }

    get creeps() {
        return Memory.Villages[this.villageName].creeps;
    }

    get market() {
        return Memory.Villages[this.villageName].market;
    }
    get sources() {
        return Memory.Villages[this.villageName].sources;
    }

    get remoteRooms() {
        return Memory.Villages[this.villageName].remoteRooms;
    }

    get structures() {
        return Memory.Villages[this.villageName].structures;
    }
    getNeededMineralRole(role) {
        let minerals = Game.getObjectById(this.getMineralsById());
        if (!minerals || minerals.mineralAmount == 0) {
            return 0;
        }
        let extractor = Game.getObjectById(this.getMineralExtractorId());
        if (!extractor) {
            return 0;
        }
        let mineralContainer = Game.getObjectById(this.getMineralExtractionContainerId());
        if (!mineralContainer) {
            return 0;
        }
        
        return 1;
    }
    
    get terminal() {
        return this.room.terminal;
    }

    getStorageAmount(resourceType) {
        let keys = Object.keys(this.room.storage.store);
        if(!keys.includes(resourceType)) {
            return 0;
        }
        return this.room.storage.store[resourceType];
    }

    getTerminalAmount(resourceType) {
        let keys = Object.keys(this.terminal.store);
        if(!keys.includes(resourceType)) {
            return 0;
        }
        return this.terminal.store[resourceType];
    }

    canSpawn(creepBuild) {
        //console.log(`CAN SPAWN: ${(this.spawns.find(x=>x.name && !Game.spawns[x.name].spawning)!=null && this.getAvailableEnergyForSpawning() >= creepBuild.cost)}`);
        //console.log(`${this.spawns.find(function(x) {
        //    console.log(x.name);
        //    console.log(x.spawning);
        //    return (x=>x.name && !x.spawning);
        //})}`);
        //console.log(`Do I have enough energy? ${this.getAvailableEnergyForSpawning()} - ${creepBuild.cost} = ${this.getAvailableEnergyForSpawning() >= creepBuild.cost}`)
        return (this.spawns.find(x=>x.name && !Game.spawns[x.name].spawning)!=null && this.getAvailableEnergyForSpawning() >= creepBuild.cost);
    }

    /**
     * One-time only memory initialization for villages
     */
    initCreeps() {
        // for each creep in the room, add it to creeps array
        //FEATURE: have remote creep be in their own array
        let that = this;
        this.memoryAddr.creeps = {};
        Game.rooms[this.roomName].find(FIND_MY_CREEPS).forEach(function(c) {
            that.memoryAddr['creeps'][c.name] = {};
        });
    }
    
    initFlags() {
        this.memoryAddr.flags = {};
    }

    initRemoteRooms() {
        // initialize an empty object with keys that will be manually inserted
        //FEATURE: automate this process
        this.memoryAddr.remoteRooms = {};
    }
    
    initSources() {
        let that = this;
        this.memoryAddr.sources = {};
        Game.rooms[this.roomName].find(FIND_SOURCES).forEach(function(s) {
            that.memoryAddr['sources'][s.id] = {harvester: 0, harvestersAmount: 3, dropHarvester: 0}; // todo: analyze sources for harvestersAmount
        });
    }

    hasLinks() {
        let links = this.structures.links;
        if (!links) {
            return false;
        }
        let toLinks = links.toLinks.length;
        let fromLinks = links.fromLinks.length;
        return toLinks && fromLinks;
    }

    getToLinks() {
        let links = this.structures.links;
        if (!links) {
            return null;
        }
        return links.toLinks;
    }

    getFromLinks() {
        let links = this.structures.links;
        if (!links) {
            return null;
        }
        return links.fromLinks;
    }

    initStructures() {
        // for each creep in the room, add it to creeps array
        //FEATURE: have remote creep be in their own array
        let that = this;
        this.memoryAddr.structures = {};
        // Game.rooms[this.roomName].find(FIND_MY_STRUCTURES).forEach(function(s) { // TODO: do we need to track all strucutres?
        //     that.memoryAddr['structures'][s.id] = {};
        // });
        this.memoryAddr.structures.links = {};
    }
    
    increaseSourceHarvesters() { // TEST: does this actually work?
        for (let key in this.memoryAddr.sources) {
            this.memoryAddr.sources[key].harvestersAmount++;
        }
    }

    checkLevel() {
        switch(this.level) {
            case 1: // just starting out
                if (this.controller.level >= 2 && Object.keys(this.creeps).length >= 9){
                    this.increaseSourceHarvesters();
                    this.levelUp();
                }
                break;
            case 2: // focus on drop mining into containers with transportation
                if (this.controller.level >= 3 && Object.keys(this.creeps).length >= 11){
                    this.levelUp(); // TODO: add condition to check for containers
                }
                break;
            case 3: // start remote mining // TODO: Not yet implemented in creep Report
                if (this.controller.level >= 4 && Object.keys(this.creeps).length >= 13) {
                    this.levelUp();
                }
                break;
            case 4: // start harvesting minerals and boosting and using links for remote mining
                if (this.controller.level >= 5 && Object.keys(this.creeps).length>= 15) {
                    this.levelUp();
                }
                break;
            case 5: // focus on defense and helping economy of smaller colonies 
                if (this.controller.level >= 6 && Object.keys(this.creeps).length >= 17) {
                    this.levelUp();
                }
                break;
        }
    }

    levelUp() {
        this.memoryAddr.level++;
        this.level++;
        this.debugMessage.append(`\t${this.villageName} has leveled up to lv ${this.level}`);
    }
    
    printStatus() {
        let status = 'STATUS FOR VILLAGE: ' + this.villageName + ' LV: ' + this.level;
        status += `\n\tROOM: ${this.roomName}    REMOTE ROOMS: ${JSON.stringify(this.remoteRooms)}   
        \n\tSPAWN 1 NAME ${this.spawnNames[0]}    SPAWN ${this.spawns[0]}
        \n\tSPAWN 2 NAME ${this.spawnNames[1]}    SPAWN ${this.spawns[1]}
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
        this.operateStructures();
        let creepReport = CreepReporter(this.creeps, this.debug, this);
        this.spawnQueue = creepReport.process(this); // TODO: only process if I have available energy and my spawn isnt busy
        
        this.spawnNames.forEach(function(s) {
            let spawnObj = Game.spawns[s];
            if (!spawnObj) {
                return;
            }
            if (spawnObj.spawning) {
                if (!this.creeps[spawnObj.spawning.name]) {
                    this.registerCreep(spawnObj.spawning.name);
                    this.spawnQueue.shift();
                }
            } else {
                this.spawnCreep(s); // turn this into a prototype    
                this.spawnQueue.shift(); // TODO: currently, this is calculated every tick
                                    // but when it gets time to save it, work on popping off the specific role

            }
        }.bind(this));;
        this.debugMessage.append(`\$${this.villageName} has successfully finished execution`);
    }
    
    /**
     * Deregister sources associated with these creeps
     */
    deregister(creepName) {
        console.log(this.villageName + ' DEREGISTERING: ' + creepName);
        //this.printStatus();
        let source;
        let role = this.creeps[creepName].role;
        let myRoom;
        let i;
        switch(role) {
            case 'dropHarvester':
            case 'harvester':
                //console.log("IN HEAP: " + JSON.stringify(this.sources[source]));
                //console.log("IN MEM: " + JSON.stringify(this.memoryAddr.sources[source].harvesters));
                source = this.creeps[creepName].mySource;
                if (source) {
                    i = Memory.Villages[this.villageName].sources[source][role]--;
                    console.log(`\tROLE: ${this.creeps[creepName].role} | SOURCE: ${source} ${i} -> ${Memory.Villages[this.villageName].sources[source][role]}`);
                };
                //console.log("IN MEM: " + JSON.stringify(this.memoryAddr.sources[source].harvesters));
                //console.log("IN HEAP: " + JSON.stringify(this.sources[source]));                
                break;
            case 'remoteRepairer':
            case 'remoteClaimer':
            case 'remoteBodyguard':
                myRoom = this.creeps[creepName].myRemoteRoom;
                if (myRoom) {
                    i = Memory.Villages[this.villageName].remoteRooms[myRoom][role]--;
                    console.log(`\tROLE: ${this.creeps[creepName].role} | REMOTE ROOM: ${myRoom} ${i} -> ${Memory.Villages[this.villageName].remoteRooms[myRoom][role]}`);
                }
                break;
            case 'remoteTransporter':
            case 'remoteDropHarvester':
                // for each remote room, find a source
                source = this.creeps[creepName].mySource;
                if (source) {
                    i = Memory.Villages[this.villageName].remoteRooms[this.creeps[creepName].remoteRoom].remoteSources[source][role]--
                    console.log(`\tROLE: ${this.creeps[creepName].role} | REMOTE ROOM: ${this.creeps[creepName].remoteRoom} | REMOTE SOURCE: ${source} ${i} -> ${Memory.Villages[this.villageName].remoteRooms[this.creeps[creepName].remoteRoom].remoteSources[source][role]}`);
                };
                break;
        }
        //this.printStatus();
    }
    
    /**
     * Return the first source that doesn't have the required role
     * If a source is found, log the room it was found in the creep registry
     * TODO: break this down into smaller functions
     * @param {creepRole} role 
     */
    findRemoteSourceForRole(creepName, role) {
        console.log(`>     FINDING REMOTE SOURCE FOR ${creepName}`)
        for (let room in this.remoteRooms) {
            console.log('>>     ROOM: ' + room);
            for (let source in this.remoteRooms[room].remoteSources) {
                console.log('>>>    Source: ' + source);
                if(this.remoteRooms[room].remoteSources[source][role] < 1) {
                    this.remoteRooms[room].remoteSources[source][role]++;
                    this.creeps[creepName].remoteRoom = room;
                    console.log('>>>>   SET ROOM TO: ' + room);
                    console.log('>>>>   SET SOURCE TO: ' + source);
                    return source;
                }
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
        
        let energyInSpawn = this.spawns[0].energy;
        //console.log(energyInSpawn + " energy in spawn")
        //console.log(energyInExtensions + " energy in extensions")
        return energyInExtensions + energyInSpawn;
    }
    
    /**
     * returns the drop container objects associated with this village
     */
    getDropContainers() {
        let dropContainers = [];
        for (let source in this.sources) {
            if (this.sources[source].container) {
                dropContainers.push(Game.getObjectById(this.sources[source].container));
            }
        }
        return dropContainers;
    }

    getMineralExtractionContainerId() {
        if(!this.memoryAddr.mineralExtractionContainer) {
            let extractorId = this.getMineralExtractorId();
            if (!extractorId) {
                return;
            }

            let containers = Game.getObjectById(extractorId).pos.findInRange(FIND_STRUCTURES, 1, {
                filter: {structureType: STRUCTURE_CONTAINER}});
            if(!containers.length) {
                return;
            }

            this.memoryAddr.mineralExtractionContainer = containers[0].id;
        }
        return this.memoryAddr.mineralExtractionContainer;
    }

    getMineralExtractorId() { // TODO: remote rooms
        if (!this.memoryAddr.mineralExtractor) {
            let mineralId = this.getMineralsById();
            if (!mineralId) {
                return;
            }

            let structures = Game.getObjectById(mineralId).pos.lookFor(LOOK_STRUCTURES);
            if (!structures.length) {
                return; 
            }
            
            let extractor;
            if (structures.length == 1) {
                if (!structures[0].structureType == STRUCTURE_EXTRACTOR) {
                    return;
                }
                extractor = structures[0];
            } else {
                extractor = structures.find(x => x.structureType == STRUCTURE_EXTRACTOR);
                if (!extractor.length) {
                    return;
                }
                extractor = extractor[0];
            }

            console.log(extractor)
            this.memoryAddr.mineralExtractor = extractor.id;
        }
        
        return this.memoryAddr.mineralExtractor;
    }

    /**
     * Returns the container obj for a drop harvester
     * @param {string} creepName 
     * @param {string} remoteRoomName 
     */
    getDropHarvestLocation(creepName, remoteRoomName) {
        // find the nearest container to my source
        // if you can't find one, return null
        //console.log('>>>>>>>>' + creepName)
        let mySource = this.getSource(creepName);
        let villageSources = this.sources;
        let isRemoteRoom = false;
        if (remoteRoomName) {
            isRemoteRoom = true;
            villageSources = this.remoteRooms[remoteRoomName].remoteSources;
        }
        //console.log('DROP MINING SOURCE FOR ' + creepName + ' | '+ mySource);
        //console.log(Object.keys(villageSources))
        if(!villageSources[mySource.id].container) {
            let containers = mySource.pos.findInRange(FIND_STRUCTURES, 1,  {filter: {structureType: STRUCTURE_CONTAINER}});
            if (containers.length > 0) {
                villageSources[mySource.id].container = containers[0].id;
                if (!isRemoteRoom) {
                    this.memoryAddr.sources[mySource.id].container = containers[0].id;
                } else {
                    this.memoryAddr.remoteRooms[remoteRoomName].remoteSources[mySource.id].container = containers[0].id;
                }
            }
        }
        
        if (villageSources[mySource.id].container) {
            if ( Game.getObjectById([villageSources[mySource.id].container])) {
                return villageSources[mySource.id].container;
            } else {
                delete villageSources[mySource.id].container; // TEST if this actually deletes the container
            }
        } else {
            
            //throw new Error (`ERROR: ${creepName} at ${remoteRoomName? remoteRoomName : this.villageName} does not have a container available for drop harvesting`);
        }
        return null;
    }

    /**
     * Returns the spawn object with less than full capacity
     */
    getEmptySpawn() {
        return this.spawns.find(x => x.energy < x.energyCapacity);
    }

    getHideoutFlag() {
        //console.log("FLAGS: " + this.memoryAddr['flags']);
        //console.log(this.memoryAddr['flags'].hideoutFlag);
        return this.memoryAddr.flags.hideoutFlag;
    }

    getMaximumEnergyForSpawning() {
        let energyInExtensions = 0;
        _.forEach(this.room.find(FIND_MY_STRUCTURES, {
            filter: function(o) {
                return o.structureType == STRUCTURE_EXTENSION
            }
        }), function(structure) {
            energyInExtensions += 50;
        });
        // ADD $$ for extra spawns
        return energyInExtensions + 300;
    }

    // TEST: does this actually write to memory;
    getMemAddr(room) {
        let memRoomAddr;
        if (room == this.roomName) {
            return this.memoryAddr;
        } else {
            let remoteRoom = this.remoteRooms[room];
            if (remoteRoom) {
                memRoomAddr = this.memoryAddr.remoteRooms[room];
            } else {
                // throw error: this is not a room in my domain
                return;
            }
        }
        return memRoomAddr;
    }
    
    getNeededRemoteRole(role) {
        // return the number of remoteSources that dont have any {role} assigned to them
        // ACTUALLY: this returns the max number of creeps needed
        let neededRemoteRole = 0;
        //console.log(this.villageName + ' GETTING REMOTE ROLES')
        switch (role) {
            case 'remoteBodyguard':
                for (let room in this.remoteRooms) {
                    let myRoom = this.remoteRooms[room];
                    if (role in myRoom && myRoom.underAttack) {
                        neededRemoteRole++;
                    }
                }
                break;
            case 'remoteRepairer':
            case 'remoteClaimer':
                for (let room in this.remoteRooms) {
                    //if (this.remoteRooms[room][role] == 0) {
                    if (role in this.remoteRooms[room]) {
                        neededRemoteRole++;
                    }
                    //}
                }
                break;
            case 'remoteDropHarvester':
            case 'remoteTransporter':
                for (let room in this.remoteRooms) {
                    for (let source in this.remoteRooms[room].remoteSources) {
                        //console.log(room + ' | ' + source + ' | ' + this.remoteRooms[room].remoteSources[source][role])
                        //if(this.remoteRooms[room].remoteSources[source][role] == 0) {
                        if(role in this.remoteRooms[room].remoteSources[source]) {
                            neededRemoteRole++;
                        }
                        //}
                    }
                }
                break;
        }
        //console.log(`   NEEDED REMOTE ${role}: ${neededRemoteRole}`)
        return neededRemoteRole;
    }

    getNextRemoteRoomName(currentRoomName) {
        let remoteRoomKeys = Object.keys(this.remoteRooms);
        if (!remoteRoomKeys.length) {
            return null;
        }

        if(currentRoomName == this.roomName) {
            return Object.keys(this.remoteRooms)[0];
        } else {
            let idx = remoteRoomKeys.findIndex(remoteRoom => currentRoomName == remoteRoom);
            idx = (idx + 1) % remoteRoomKeys.length;
            //console.log(" CASE 2 : " + remoteRoomKeys[idx])
            //console.log(" CASE 2 : " + Object.keys(this.remoteRooms[remoteRoomKeys[idx]]))
            return (remoteRoomKeys[idx]);
        }
    }
    
    getMyRemoteRoom(creep) {
        return this.creeps[creep.name].remoteRoom;
    }

    /**
     * Returns the source objec this creep is associated with
     * @param {string} creepName 
     */
    getSource(creepName) {
        //console.log('GETSOUCE ' + creepName)
        //console.log('WHETDFKLS     ' + Object.keys(this.creeps[creepName]))
        //console.log(`WHETDFKLS     ${this.creeps[creepName].mySource}`)
        let source = Game.getObjectById(this.creeps[creepName].mySource);
        return source;
    }

    hasCreep(creepName) {
        return this.creeps[creepName] ? true : false;
    }

    inRemoteRoom(room) {
        return this.remoteRooms[room] ? true : false;
    }

    isStale(ticks) {
        // TODO: decrease stale timer according to stimulus (ie. in war)
        if (!ticks || Game.time - ticks > 500) {
            return true;
        } else {
            return false;
        }
    }
    operateStructures() {
        this.operateLinks();
        this.operateTowers();
    }

    operateLinks() {
        this.structures.links.fromLinks.forEach( fromLink => {
            let fromLinkObj = Game.structures[fromLink];
            //console.log(fromLinkObj)
            let toLink = this.structures.links.toLinks.find(x => Game.structures[x].energy <= 400); // TODO: find a way to not hardcode this number
            let toLinkObj = Game.structures[toLink];
            if (fromLinkObj && toLinkObj) {
                let energyToSend = toLinkObj.energyCapacity - toLinkObj.energy;
                if (fromLinkObj.energy < energyToSend) {
                    energyToSend = fromLink.energy;
                }
                if (energyToSend >= 400) {
                    fromLinkObj.transferEnergy(toLinkObj,energyToSend);
                }
            }
        })
    }
    
    operateTowers() {
        for (let tower in this.structures.towers) {
            let towerObj = Game.structures[tower];
            if(towerObj) {
                var closestDamagedStructure = towerObj.pos.findClosestByRange(FIND_STRUCTURES, {
                     filter: (structure) => structure.hits < structure.hitsMax*.5 && 
                        structure.structureType != STRUCTURE_WALL && structure.structureType != STRUCTURE_RAMPART
                }); // TODO: do I really want to do this?
        
                var closestHostile = towerObj.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if(closestHostile) {
                    towerObj.attack(closestHostile);
                    return;
                }
                if(closestDamagedStructure) {
                    towerObj.repair(closestDamagedStructure);
                }
            }
        }
    }

    /**
     * register sources to this creep and add this creep to memory
     * @param {string} myCreepName 
     */
    registerCreep(myCreepName) {
        console.log('REGISTERING CREEP: ' + myCreepName + ' | ' + Game.creeps[myCreepName].role);
        let mySource;
        let myRoom;
        let roleName = Game.creeps[myCreepName].memory.role;
        this.creeps[myCreepName] = {role: roleName};
        switch (roleName) {
            case 'harvester':
                for (let source in this.sources) {
                    if (this.sources[source][roleName] < this.sources[source].harvestersAmount) {
                        mySource = source;
                        this.sources[source][roleName]++;
                        this.creeps[myCreepName].mySource = mySource;
                        return;
                    }
                }
                break;
            case 'dropHarvester':
                for (let source in this.sources) {
                    console.log('\t\tSOURCE : ' + source + '|' + this.sources[source][roleName])
                    if (this.sources[source][roleName] == 0) {
                        console.log("\tFOUND A SOURCE: " + source);
                        mySource = source;
                        this.sources[source][roleName]++;
                        // creepBuild.memoryConfig = {'role': 'dropHarvester', 'mySource': mySource}
                        this.creeps[myCreepName].mySource = mySource; // TODO: is this necessary?
                        return;
                    } else if (this.sources[source][roleName] < 0) {
                        this.sources[source][roleName] = 0;
                    }
                }
                if (mySource==null) {
                    for (let source in this.sources) {
                        console.log('\t\tSOURCE : ' + source + '|' + this.sources[source][roleName])
                        if (this.sources[source][roleName] == 0) {
                            console.log("\tFOUND A SOURCE: " + source);
                            mySource = source;
                            this.sources[source][roleName]++;
                            // creepBuild.memoryConfig = {'role': 'dropHarvester', 'mySource': mySource}
                            this.creeps[myCreepName].mySource = mySource; // TODO: is this necessary?
                            return;
                        } else if (this.sources[source][roleName] < 0) {
                            this.sources[source][roleName] == 0;
                        }
                    }
                }
                this.creeps[myCreepName].mySource = mySource;
                break;
            case 'remoteBodyguard':
                for(let room in this.remoteRooms) {
                    console.log( '\t' + room + ' | ' + this.remoteRooms[room][roleName]);
                    if (this.remoteRooms[room][roleName] < 1 && this.remoteRooms[room].underAttack) {
                        myRoom = room;
                        this.remoteRooms[room][roleName]++;
                        this.creeps[myCreepName].myRemoteRoom = myRoom;
                        console.log('\tSET TO: ' + myRoom + ' | ' + this.remoteRooms[myRoom][roleName]);
                        return;
                    }
                }
                break;
            case 'remoteRepairer':
            case 'remoteClaimer':
                for(let room in this.remoteRooms) {
                    console.log( '\t' + room + ' | ' + this.remoteRooms[room][roleName]);
                    if (this.remoteRooms[room][roleName] < 1) {
                        myRoom = room;
                        this.remoteRooms[room][roleName]++;
                        this.creeps[myCreepName].myRemoteRoom = myRoom;
                        console.log('\tSET TO: ' + myRoom + ' | ' + this.remoteRooms[myRoom][roleName]);
                        return;
                    }
                }
                break;
            case 'remoteTransporter':
            case 'remoteDropHarvester':
                // for each remote room, find a source
                mySource = this.findRemoteSourceForRole(myCreepName, roleName);
                console.log('\tFINISHING REGISTRATION: SET MYSOURCE TO ' + mySource);
                if (mySource) {
                    this.creeps[myCreepName].mySource = mySource;
                }
                break;
        }
        console.log('REGISTRATION COMPLETE: ' + myCreepName + ' | ' + Game.creeps[myCreepName].role);
    }
    
    registerFlags() {
        for (let flag in this.memoryAddr.flags) {
            this.flags[flag] = this.memoryAddr.flags[flag];
        }
    }
    
    registerLevel() {
        this.level = this.memoryAddr.level;
    }

    registerRemoteRooms() {
        for (let room in this.memoryAddr.remoteRooms) {
            this.remoteRooms[room] = this.memoryAddr.remoteRooms[room];
        }
    }

    registerSources() {
        for (let source in this.memoryAddr.sources) {
            this.sources[source] = this.memoryAddr.sources[source];
        }
    }

    registerStructures() {
        for (let structure in this.memoryAddr.structures) {
            this.structures[structure] = this.memoryAddr.structures[structure];
        }
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

    setShouldNotRepair(room) {
        if (room==this.roomName) {
            Memory.Villages[this.villageName]['shouldRepair'] = false;
            Memory.Villages[this.villageName]['shouldRepairTime'] = Game.time;
            return;
        }
        let memRoomAddr = this.getMemAddr(room);

        if (memRoomAddr) {
            memRoomAddr['shouldRepair'] = false;
            memRoomAddr['shouldRepairTime'] = Game.time;    
        }
    }

    getMineralsById() {
        if (!this.memoryAddr.minerals) {
            let minerals = this.room.find(FIND_MINERALS);
            if (!minerals.length) {
                return null;
            }
            this.memoryAddr.minerals = minerals[0].id;
        }
        return this.memoryAddr.minerals;
    }

    setShouldRepair(room) {
        if (room==this.roomName) {
            Memory.Villages[this.villageName]['shouldRepair'] = true;
            Memory.Villages[this.villageName]['shouldRepairTime'] = Game.time;
            return;
        }
        let memRoomAddr = this.getMemAddr(room);
        if (memRoomAddr) {
            memRoomAddr['shouldRepair'] = true;
            memRoomAddr['shouldRepairTime'] = Game.time;    
        }
    }

    /**
     * @param {string} room 
     */
    shouldRepair(room) {
        // if there are buildings under their respective hit thresholds, return true
        // TODO: store these thresholds in memory or have them accessible through the village
        // TODO: you only really need to do this once per room per village, and not all that often
        let memRoomAddr = this.getMemAddr(room);
        //console.log('SHOULD REPAIR: ' + room + ' | ' + memRoomAddr)
        if (memRoomAddr) {
            let shouldRepairTime = memRoomAddr.shouldRepairTime;
            //console.log(room + ' | ' + this.isStale(shouldRepairTime))
            if (this.isStale(shouldRepairTime)) {
                let containerThreshold = 100000 + this.level * 10000;
                let roadThreshold = .4 + this.level + .05;
                //let roadThreshold = 1;
                let wallThreshold = 10000 + 10000 * this.level * this.level;
                let rampartThreshold = 10000 + 10000 * this.level * this.level;
                let structureThreshold = .6;
                
                let shouldRepair = false;
                let visibleRoom = Game.rooms[room];
                if (! visibleRoom) {
                    throw new Error(`ERROR: in ${this.villageName}, shouldRepair for room ${room} failed because room is not accessible`);
                }
                let structures = Game.rooms[room].find(FIND_STRUCTURES); // TODO: optimize this
                if (structures.length) {
                    let repairTarget = _.find(structures, function (s) {
                        let type = s.structureType;
                        //console.log('>          ' + type);
                        //console.log('>          ' + s.hits);
                        //console.log('>          ' + containerThreshold)
                        //console.log((type == STRUCTURE_CONTAINER && s.hits < containerThreshold));
                        return ((type == STRUCTURE_CONTAINER && s.hits < containerThreshold) ||
                            (type == STRUCTURE_ROAD && s.hits < roadThreshold * s.hitsMax) ||
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
                        console.log("GOTTA REPAIR " + room)
                        shouldRepair = true;
                    } else {
                        shouldRepair = false;
                    }
                }
                if (!memRoomAddr) {
                    Memory.Villages[this.villageName]['shouldRepair'] = shouldRepair;
                    Memory.Villages[this.villageName]['shouldRepairTime'] = Game.time;
                } else {
                    memRoomAddr['shouldRepair'] = shouldRepair;
                    memRoomAddr['shouldRepairTime'] = Game.time;
                }

                
                return shouldRepair;
            } else {
                return memRoomAddr.shouldRepair;
            }
        }
    }

    /**
     * 
     * @param {string} spawn 
     */
    spawnCreep(spawn) {
        //this.debugMessage.append(`\t ${this.villageName} PREPARING TO SPAWN -- Spawn Queue: ${this.spawnQueue}`);

        // TODO: depending on spawning priority, allow skipping forward in the queue
        if (this.spawnQueue.length > 0) {
            //console.log(this.villageName + " > PREPARING TO SPAWN: " + this.spawnQueue)
            let creepToSpawn = this.spawnQueue.peek();
            let creepBuild = new CreepConfig(creepToSpawn, this.level, this.getMaximumEnergyForSpawning(), this.getAvailableEnergyForSpawning());
            //console.log(creepBuild.body + " | " + creepBuild.name)
            if (this.canSpawn(creepBuild)) {
                //this.debugMessage.append(`\t\t ${this.villageName} ${creepBuild.body} | ${creepBuild.name}`);
                //console.log(spawn + ' in ' + this.spawnNames);
                let myCreepName = creepBuild.name;
                let spawnMessage = Game.spawns[spawn].spawnCreep(creepBuild.body, myCreepName, {memory: creepBuild.memoryConfig});
                //console.log("SPAWNED " + myCreepName + ' with status ' + spawnMessage);
                //let spawnMessage;
                this.debugMessage.append(`\t\t SPAWN MESSAGE: ${spawnMessage}`);
                if (spawnMessage === OK) {
                    //console.log(`${this.villageName} | ${spawn} SUCCESSFULLY SPAWNED ${myCreepName}: ${creepBuild.body}`);
                    Memory.creepNameCounter = (Memory.creepNameCounter + 1) % 100;
                    return 0;
                } else if (spawnMessage === ERR_BUSY){
                    return -1;
                } else if (spawnMessage === -6) {
                    return -1;
                    // not enough cash
                } else {
                    //console.log('SPAWN ERROR: ' + spawnMessage);
                    return -1;
                }
            } else {
                // can't spawn
            }
        } else {
            //nothing to spawn
        }
    }

    
    toString() {
        return ("ROOM: " + this.roomName + " | SPAWNS: " + this.spawnNames + " | CONTROLLER: " + this.controllerId);
    }
}

module.exports = Village;