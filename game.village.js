require('utils.extensions');
var DebugMessage = require('game.debugMessage');
var CreepReporter = require('game.creepReporter');
var CreepConfig = require('game.creepConfig');
var speech = require('utils.speech');

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

    get controller() {
        return Game.structures[this.controllerId];
    }

    get creeps() {
        return Memory.Villages[this.villageName].creeps;
    }

    get labs() {
        return Memory.Villages[this.villageName].structures.labs;
    }

    get market() {
        return Memory.Villages[this.villageName].market;
    }
    
    get memoryAddr() {
        return Memory.Villages[this.villageName];
    }

    get remoteRooms() {
        return Memory.Villages[this.villageName].remoteRooms;
    }

    get room() {
        return Game.rooms[this.roomName];
    }

    get sources() {
        return Memory.Villages[this.villageName].sources;
    }

    get structures() {
        return Memory.Villages[this.villageName].structures;
    }

    get terminal() {
        return this.room.terminal;
    }

    get storage() {
        return this.room.storage;
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

    getRemoteSourceArrivalTime(remoteRoomName, remoteSourceId) {
        let arrivalTime = this.remoteRooms[remoteRoomName].remoteSources[remoteSourceId].arrivalTime;
        if (!arrivalTime) {
            return -1;
        }
        return arrivalTime;
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

    manageMarket(isPurchasing = false) {
        if (this.terminal.cooldown > 0) {
            return;
        }

        let allOrders = Game.market.getAllOrders();
        let prices = {'O':0.077,'H':[0.150],'K':[.131],'L':[.081],'Z':[.129],'U':[.145],'X':[.211],
            "G":[0.486],
            "UH2O":[0.556],
            "UHO2":[0.466],
            "ZH2O":[0.54],
            "ZHO2":[0.450],
            "KH2O":[0.542],
            "KHO2":[0.452],
            "LH2O":[0.492],
            "LHO2":[0.402],
            "GH2O":[0.897],
            "GHO2":[0.807],
            "XUH2O":[0.767],
            "XUHO2":[0.677],
            "XLH2O":[0.703],
            "XLHO2":[0.613],
            "XKH2O":[0.753],
            "XKHO2":[0.663],
            "XZH2O":[0.751],
            "XZHO2":[0.661],
            "XGH2O":[1.108],
            "XGHO2":[1.018]};
        let resources = {'O':[],'H':[],'K':[],'L':[],'Z':[],'U':[],'X':[],
            "G":[],
            "UH2O":[],
            "UHO2":[],
            "ZH2O":[],
            "ZHO2":[],
            "KH2O":[],
            "KHO2":[],
            "LH2O":[],
            "LHO2":[],
            "GH2O":[],
            "GHO2":[],
            "XUH2O":[],
            "XUHO2":[],
            "XLH2O":[],
            "XLHO2":[],
            "XKH2O":[],
            "XKHO2":[],
            "XZH2O":[],
            "XZHO2":[],
            "XGH2O":[],
            "XGHO2":[]};
        let resourcesBuy = {'O':[],'H':[],'K':[],'L':[],'Z':[],'U':[],'X':[],
            "G":[]};
        
        allOrders.forEach(o => {
            if(o.type == ORDER_SELL && resources[o.resourceType]) { 
                resources[o.resourceType].push(o);
            } else if (o.type == ORDER_BUY && resourcesBuy[o.resourceType])
                resourcesBuy[o.resourceType].push(o);
        });

        if (Memory.market.budget > 0) {
            // SELL ORDERS -- I buy minerals for credits
            for ( let res in resources) {
                let sortedOrders = resources[res].sort((x,y) => this.calculateMarketPricePerUnit(x) - this.calculateMarketPricePerUnit(y));
                if (sortedOrders.length < 1) {
                    continue;
                }
                let cheapestOption = sortedOrders[0];
                let cheapestEPPU = this.calculateMarketPricePerUnit(cheapestOption);
                let marketAvg = prices[res];
                let targetDiscount = Memory.market.markdown;
                let targetMarkdownFromMarketAvg = marketAvg * (1 - targetDiscount);
                //console.log (`Cheapest Sell Order for ${res}: ${cheapestEPPU} EPPU against ${targetMarkdownFromMarketAvg} Market Avg with ${targetDiscount} markdown`);
                //console.log (`\tReal price: ${cheapestOption.price} | Market Avg: ${marketAvg}`);
                //console.log (`\t${JSON.stringify(cheapestOption)}`)
                if (cheapestEPPU <= targetMarkdownFromMarketAvg) {
                    let amount = Memory.market.budget/cheapestOption.price;
                    if (amount > cheapestOption.remainingAmount) {
                        amount = cheapestOption.remainingAmount;
                    }
                    if (amount < 100) { // not worth small purchases
                        continue;
                    }
                    console.log(`Currently budgeted: ${Memory.market.budget} out of 20000`);
                    console.log(`\t\tPurchasing ${amount} ${res} at ${cheapestOption.id} using terminal in room ${this.roomName}`);
                    if (isPurchasing) {
                        let status = Game.market.deal(cheapestOption.id,amount,this.roomName);
                        if (status == 0) {
                            Memory.market.budget -= amount*cheapestOption.price;
                            // made a successful purchase? bring markdown back down to 20%
                            Memory.market.markdown = .20;
                            return;
                        }
                    };
                }
            }
        }

        // BUY ORDERS -- I sell minerals for credits
        for (let res in resourcesBuy) {
            let sortedOrders = resourcesBuy[res].sort((x,y) => this.calculateMarketBuyPricePerUnit(y) - this.calculateMarketBuyPricePerUnit(x));
            if (sortedOrders.length < 1) {
                continue;
            }
            let mostExpensiveOption = sortedOrders[0];
            let mostExpensiveEPPU = this.calculateMarketBuyPricePerUnit(mostExpensiveOption);
            let marketAvg = prices[res];
            let targetMarkup = Memory.market.markup;
            let targetMarkUpFromMarketAvg = marketAvg * (1 + targetMarkup);
            //console.log (`Most Expensive Buy Order for ${res}: ${mostExpensiveEPPU} EPPU against ${targetMarkUpFromMarketAvg} Market Avg with ${targetMarkup} markup`);
            //console.log (`\tReal price: ${mostExpensiveOption.price} | Market Avg: ${marketAvg}`);
            //console.log (`\t${JSON.stringify(mostExpensiveOption)}`)
            if (mostExpensiveEPPU >= targetMarkUpFromMarketAvg) {
                let amount = this.terminal.store[res];
                if (!amount || amount < 100) {
                    console.log (`\t Not enough ${res} in terminal: looking for ${mostExpensiveOption.remainingAmount}`);
                    continue;
                }

                if (amount > mostExpensiveOption.remainingAmount) {
                    amount = mostExpensiveOption.remainingAmount;
                }

                if (isPurchasing) {
                    console.log(`\t\tSelling ${amount} ${res} at ${mostExpensiveOption.id} using terminal in room ${this.roomName}`);
                    let status = Game.market.deal(mostExpensiveOption.id,amount,this.roomName);
                    if (status == 0) {
                        Memory.market.budget += amount*mostExpensiveOption.price;
                        // made a successful purchase? bring markdown back down to 20%
                        Memory.market.markup = .15;
                        return;
                    }
                };
            }
        }

        // no deals found, make margins a little smaller
        if (Memory.market.markdown > 0.15) {
            Memory.market.markdown -= 0.01;
        }

        // no deals found, make margins a little smaller
        if (Memory.market.markup > -0.05) {
            Memory.market.markup -= .01;
        }
    }

    /**
     * Calculates the transaction rate per unit resource
     * @param {Order} order 
     * @param {string} room 
     */
    calculateMarketPricePerUnit(order) {
        let energyToCredConv = .03;
        // gross cost in credits to complete an order
        let tCost = Game.market.calcTransactionCost(order.remainingAmount, order.roomName, this.roomName) * energyToCredConv;
        // gross cost to purchase all units
        let oCost = order.remainingAmount * order.price;
        return (tCost + oCost) / order.remainingAmount;
    }
    
    calculateMarketBuyPricePerUnit(order) {
        let energyToCredConv = .03;
        // gross cost in credits to complete an order
        let tCost = Game.market.calcTransactionCost(order.remainingAmount, order.roomName, this.roomName) * energyToCredConv;
        // gross revenue
        let oCost = order.remainingAmount* order.price;
        return (oCost - tCost) / order.remainingAmount;
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
    
    makeConstructionSites() {
        let structureType = STRUCTURE_ROAD;
        let flags = this.room.find(FIND_FLAGS);
        let regexes = [{regex: /v3road/, structureType: STRUCTURE_ROAD}, {regex: /v3extension/, structureType: STRUCTURE_EXTENSION},{regex: /v3terminal/, structureType: STRUCTURE_TERMINAL}]
        regexes.forEach( r => {
            let regex = r.regex;
            let type = r.structureType;
            flags.forEach(f => {
                if (regex.test(f.name)) {
                    if (this.room.createConstructionSite(f.pos, f.structureType)==0) {
                        f.remove();
                    };
                }
            })
        })
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
    hasLabs() {
        let labs = this.structures.labs;
        if (!labs) {
            return false;
        } 
        if (Object.keys(labs).length > 0) {
            return true;
        } else {
            return false;
        }
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
                    this.makeConstructionSites();
                    this.levelUp();
                }
                break;
            case 5: // focus on defense and helping economy of smaller colonies 
                if (this.controller.level >= 6 && Object.keys(this.creeps).length >= 17) {
                    this.makeConstructionSites();
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
                let spawningCreepName = spawnObj.spawning.name;
                if (!this.creeps[spawningCreepName]) {
                    this.registerCreep(spawningCreepName);
                    this.spawnQueue.shift();
                }else {
                    new RoomVisual(this.roomName)
                        .rect(spawnObj.pos.x + 1.3,spawnObj.pos.y - .8, 4, 1.2, {fill:'#000',stroke:'#fff'})
                        .text(`${speech.getRole(this.creeps[spawningCreepName].role)}: ${Math.floor(100*(spawnObj.spawning.needTime-spawnObj.spawning.remainingTime)/spawnObj.spawning.needTime)}%`, spawnObj.pos.x + 3, spawnObj.pos.y, {color: 'white', font: 0.7});    
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
            case 'remoteClaimer':
            case 'remoteRepairer':
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
    
    getMyRemoteRoomName(creep) {
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
        this.operateLabs();
    }

    operateLabs() {
        let labs = this.labs;
        let baseComponentLabs = {X:{},O:{},H:{},K:{},L:{},U:{}};
        let t1ComponentLabs = {OH:{},GO:{}};
        let t2ComponentLabs = {GHO2:{}};
        let t3ComponentLabs = {};
        if (labs) {
            for (let lab in labs) {
                switch (labs[lab].boost) {
                    case 'GHO2':
                        //console.log("Reaction lab for GHO2: " + lab);
                        t2ComponentLabs.GHO2 = lab;
                        break;
                    case 'GO': 
                        //console.log("Reaction lab for GO: " + lab);
                        t1ComponentLabs.GO = lab;
                        break;                   
                    case 'OH': 
                        //console.log("Reaction lab for OH: " + lab);
                        t1ComponentLabs.OH = lab;
                        break;
                    case 'H':
                        //console.log("Reaction lab for H: " + lab);
                        baseComponentLabs.H = lab;
                        break;
                    case 'O':
                        //console.log("Reaction lab for O: " + lab);
                        baseComponentLabs.O = lab;
                        break;                        
                }
            }
            for (let t1 in t1ComponentLabs) {
                if (t1ComponentLabs[t1]!= null) {
                    let components = this.getComponentsForReaction(t1);
                    if (!components) {
                        continue;
                    }
                    let haveComponents = components.every(x => {
                        if (baseComponentLabs[x] == null) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                    if (haveComponents) {
                        let lab1 = Game.getObjectById(baseComponentLabs[components[0]]);
                        let lab2 = Game.getObjectById(baseComponentLabs[components[1]]);
                        if (lab1 && lab2) {
                            Game.getObjectById(t1ComponentLabs[t1]).runReaction(lab1, lab2);
                        }
                    }
                }
            }
            for (let t2 in t2ComponentLabs) {
                if (t2ComponentLabs[t2]!= null) {
                    let lab = Game.getObjectById(t2ComponentLabs[t2]);
                    if (!lab) {
                        continue;
                    }
                    if (lab.cooldown > 0) {
                        continue;
                    }
                    let components = this.getComponentsForReaction(t2);
                    if (!components) {
                        continue;
                    }
                    let haveComponents = components.every(x => {
                        if (t1ComponentLabs[x] == null) {
                            return false;
                        } else {
                            return true;
                        }
                    });
                    if (haveComponents) {
                        let lab1 = Game.getObjectById(t1ComponentLabs[components[0]]);
                        let lab2 = Game.getObjectById(t1ComponentLabs[components[1]]);
                        if (lab1 && lab2) {
                            Game.getObjectById(t2ComponentLabs[t2]).runReaction(lab1, lab2);
                        }
                    }
                }
            }
        }
    }

    getComponentsForReaction(compound) {
        switch (compound) {
            case 'OH':
                return ['O','H']; 
            case 'GHO2':
                return ['GO','OH'];
        }
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
                    continue;
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
    
    getShouldRepair(room) {
        if (!memRoomAddr) {
                    Memory.Villages[this.villageName]['shouldRepair'] = shouldRepair;
                    Memory.Villages[this.villageName]['shouldRepairTime'] = Game.time;
                } else {
                    memRoomAddr['shouldRepair'] = shouldRepair;
                    memRoomAddr['shouldRepairTime'] = Game.time;
                }
    }
    
    getShouldRepair(room) {
        if (room==this.roomName) {
            return Memory.Villages[this.villageName]['shouldRepair'];
        }
        let memRoomAddr = this.getMemAddr(room);
        if (memRoomAddr) {
            return memRoomAddr['shouldRepair'];
        }
    }
    
    setRemoteSourceArrivalTime(myRemoteRoom,mySourceId, ticksToLive) {
        this.remoteRooms[myRemoteRoom].remoteSources[mySourceId].arrivalTime = ticksToLive;
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