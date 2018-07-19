/**
 * spawnQueue: creepConfig[] which is a priority-sorted list of CreepConfigs
 *  --pop(): returns the next highest-priority spawn and removes it from the queue
 *  --peek(): returns ref to the next highest-priority spawn
 */
class CreepReport {
    constructor(debug, level) {
        this.debug = debug;
        this.counts = {'hostiles' : 0};
        this.level = level;
    }

    configLevel1() {
        return {
            "harvester": { "priority": 5, "count": 5, "scalingFactor": 0},
            "builder": { "priority": 2, "count": 2, "scalingFactor": 0},
            "upgrader": { "priority": 3, "count": 2, "scalingFactor": 0}
        };
    }

    configLevel2() { // dont know if I can hit drop harvesters here
        return {
            "dropHarvester": { "priority": 4, "count": 2, "scalingFactor": 0},
            "scavenger": { "priority": 5, "count": 2, "scalingFactor": 0},
            "builder": { "priority": 2, "count": 3, "scalingFactor": 0},
            "upgrader": { "priority": 1, "count": 5, "scalingFactor": 2000}
        };
    }

    configLevel3() {
        return {
            "dropHarvester": { "priority": 4, "count": 2, "scalingFactor": 0},
            "scavenger": { "priority": 5, "count": 2, "scalingFactor": 0},
            "builder": { "priority": 2, "count": 2, "scalingFactor": 0},
            "upgrader": { "priority": 1, "count": 7, "scalingFactor": 2000}
        };
    }

    configLevel4() {
        return {
            "dropHarvester": { "priority": 4, "count": 2, "scalingFactor": 0},
            "remoteDropHarvester": { "priority": 4, "count": 0, "scalingFactor": 0},
            "remoteRepairer": { "priority": 3, "count": 0, "scalingFactor": 0},
            "remoteTransporter": { "priority": 4, "count": 0, "scalingFactor": 0},
            "remoteBodyguard": { "priority": 1, "count": 0, "scalingFactor": 0},
            //"scout": { "priority": 5, "count": 5, "scalingFactor": 0, "delay": 100},
            "remoteClaimer": { "priority": 1, "count": 0, "scalingFactor": 0},
            "scavenger": { "priority": 5, "count": 3, "scalingFactor": 0},
            "builder": { "priority": 2, "count": 2, "scalingFactor": 0},
            "upgrader": { "priority": 1, "count": 3, "scalingFactor": 2000}
        };
    }

    configLevel5() {
        return {
            "dropHarvester": { "priority": 4, "count": 2, "scalingFactor": 0},
            "remoteDropHarvester": { "priority": 4, "count": 0, "scalingFactor": 0},
            "remoteRepairer": { "priority": 3, "count": 0, "scalingFactor": 0},
            "remoteTransporter": { "priority": 4, "count": 0, "scalingFactor": 0},
            //"scout": { "priority": 5, "count": 5, "scalingFactor": 0, "delay": 100},
            "remoteBodyguard": { "priority": 1, "count": 0, "scalingFactor": 0},
            "remoteClaimer": { "priority": 1, "count": 0, "scalingFactor": 0},
            "scavenger": { "priority": 5, "count": 3, "scalingFactor": 0},
            "linkMaintainer": { "priority": 5, "count": 1, "scalingFactor": 0},
            "builder": { "priority": 2, "count": 3, "scalingFactor": 0},
            "upgrader": { "priority": 1, "count": 4, "scalingFactor": 2000}
        };
    }
    
    configLevel6() {
        return {
            "dropHarvester": { "priority": 4, "count": 2, "scalingFactor": 0},
            "remoteDropHarvester": { "priority": 4, "count": 0, "scalingFactor": 0},
            "remoteRepairer": { "priority": 3, "count": 0, "scalingFactor": 0},
            "remoteTransporter": { "priority": 4, "count": 0, "scalingFactor": 0},
            //"scout": { "priority": 5, "count": 5, "scalingFactor": 0, "delay": 100},
            "mineralHarvester": { "priority": 1, "count": 1, "scalingFactor": 0},
            "mineralTransporter": { "priority": 1, "count": 1, "scalingFactor": 0},
            "remoteBodyguard": { "priority": 1, "count": 0, "scalingFactor": 0},
            "remoteClaimer": { "priority": 1, "count": 0, "scalingFactor": 0},
            "scavenger": { "priority": 5, "count": 3, "scalingFactor": 0},
            "linkMaintainer": { "priority": 5, "count": 1, "scalingFactor": 0},
            "builder": { "priority": 2, "count": 3, "scalingFactor": 0},
            "upgrader": { "priority": 1, "count": 4, "scalingFactor": 2000}
        };
    }

    dangerPresent() {
        return this.counts['hostiles'] > 0;
    }

    /**
     * Tallies all creep roles in a village for processing.
     * Returns a creep role 
     * @param {creep} creep 
     * @param {Village} village 
     */
    report(creep, village) {
        let myRole = village.creeps[creep.name].role;
        if (creep.my && myRole) {
            if (this.counts[myRole]) {
                this.counts[myRole]++; 
            } else {
                if (myRole == 'repairer') {
                    this.counts['builder'] ? this.counts['builder']++ : this.counts['builder'] = 1;
                } else {
                    this.counts[myRole] = 1; 
                }
            }
            return myRole;
        } else {
           this.counts.hostiles++;
           return 'enemy';
        }
    }
    
    read() {
        _.forOwn(this.counts, function(value, key) { console.log(`${key}: ${value}`) } );
        console.log(`DangerPresent: ${this.dangerPresent()}`);
    }

    process(village) {
        //village.debugMessage.append(`\t [CreepReport] BEGIN processing for ${village.villageName}`);
        //console.log(`\t [CreepReport] BEGIN processing for ${village.villageName} lv ${village.level}`);
        let config;
        switch (this.level) {
            case 1:
                config = this.configLevel1();
                break;
            case 2:
                config = this.configLevel2();
                break;
            case 3:
                config = this.configLevel3();
                break;
            case 4:
                config = this.configLevel4();
                break;
            case 5: 
                config = this.configLevel5();
                break;
            case 6: 
                config = this.configLevel6();
                break;
        }
        
        // return the first role by priority that isn't filled out
        
        // for each role
        //console.log(Object.keys(config));
        let priorityList = Object.keys(config).sort(function(a, b) {
            return config[a].priority < config[b].priority;
        });
        let that = this;
        //village.debugMessage.append(`\t\t [CreepReport] priority list: ${priorityList}`);
        var spawnQueue = [];
        //console.log("------STARTING")
        _.forEach(priorityList, function(role) {
            // Calculate differently for remote roles
            let adjustedCount = config[role].count;
            switch (role) {
                // TODO: add other conditions, like war or crash
                case 'remoteBodyguard':
                case 'remoteClaimer':
                case ('remoteDropHarvester'):
                case ('remoteRepairer'):
                case ('remoteTransporter'):
                    adjustedCount = village.getNeededRemoteRole(role);
                    break;
                // case ('mineralHarvester'):
                // case ('mineralTransporter'):
                //     adjustedCount = village.getNeededMineralRole(role);
                //     break;
            }
            //console.log(`\t\t [CreepReport] Required for role ${role}: ${config[role].count}`);
            //console.log(`\t\t [CreepReport] Have: ${that.counts[role]}`);            
            //village.debugMessage.append(`\t\t [CreepReport] Required for role ${config[role]}: ${config[role].count}`);
            //village.debugMessage.append(`\t\t [CreepReport] Have: ${that.counts[role]}`);
            if (!that.counts[role] || that.counts[role] < adjustedCount) { // TODO: scale up and down
                //console.log("--> We have 0 or fewer than necessary of role " + role);
                let creepCount = that.counts[role] ? adjustedCount - that.counts[role] : adjustedCount;
                _.times(creepCount, function() {
                    spawnQueue.push(role);
                })
            }
        });
        village.debugMessage.append(`\t\t [CreepReport] COMPLETE -- SpawnQueue for ${village.villageName}: ${spawnQueue}`);
        //console.log( " QUEUE: " +spawnQueue + ':' + spawnQueue.forEach(x=>console.log(x)))
        //console.log("------FINISHED")
        
        return spawnQueue;
    }
}

module.exports = CreepReport;