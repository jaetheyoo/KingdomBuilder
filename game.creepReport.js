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
            "harvester": {
                "priority": 5,
                "count": 5,
                "scalingFactor": 0
            },
            "builder": {
                "priority": 2,
                "count": 2,
                "scalingFactor": 0
            },
            "upgrader": {
                "priority": 3,
                "count": 2,
                "scalingFactor": 0
            }
        };
    }

    configLevel2() { // dont know if I can hit drop harvesters here
        return {
            "harvester": {
                "priority": 5,
                "count": 8,
                "scalingFactor": 0
            },
            "builder": {
                "priority": 3,
                "count": 3,
                "scalingFactor": 0
            },
            "upgrader": {
                "priority": 2,
                "count": 3,
                "scalingFactor": 0
            }
        };
    }

    configLevel3() {
        return {
            "dropHarvester": {
                "priority": 5,
                "count": 2,
                "scalingFactor": 0
            },
            "remoteDropHarvester": {
                "priority": 4,
                "count": 4,
                "scalingFactor": 0
            },
            "remoteTransfer": {
                "priority": 3,
                "count": 3,
                "scalingFactor": 0
            },
            "scavenger": {
                "priority": 5,
                "count": 2,
                "scalingFactor": 0
            },
            "builder": {
                "priority": 2,
                "count": 4,
                "scalingFactor": 0
            },
            "upgrader": {
                "priority": 1,
                "count": 4,
                "scalingFactor": 2000
            }
        };
    }

    configLevel4() {
        return {
            "dropHarvester": {
                "priority": 5,
                "count": 2,
                "scalingFactor": 0
            },
            "remoteDropHarvester": {
                "priority": 4,
                "count": 4,
                "scalingFactor": 0
            },
            "scout": {
                "priority": 5,
                "count": 5,
                "scalingFactor": 0,
                "delay": 100
            },
            "scavenger": {
                "priority": 5,
                "count": 2,
                "scalingFactor": 0
            },
            "linkMaintainer": {
                "priority": 5,
                "count": 1,
                "scalingFactor": 0
            },
            "builder": {
                "priority": 2,
                "count": 4,
                "scalingFactor": 0
            },
            "upgrader": {
                "priority": 1,
                "count": 4,
                "scalingFactor": 2000
            }
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
                this.counts[myRole] = 1; 
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

    process() {
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
        }
        
        // return the first role by priority that isn't filled out
        
        // for each role
        //console.log(Object.keys(config));
        let priorityList = Object.keys(config).sort(function(a, b) {
            return config[a].priority < config[b].priority;
        });
        let that = this;
        //console.log(priorityList);
        var spawnQueue = [];
        //console.log("------STARTING")
        _.forEach(priorityList, function(role) {
            // console.log('Required: ' + config[role].count);
            // console.log('Have: ' + that.counts[role])
            if (!that.counts[role] || that.counts[role] < config[role].count) {
                // console.log("--> We have 0 or fewer than necessary of role " + role);
                let creepCount = that.counts[role] ? config[role].count - that.counts[role] : config[role].count;
                _.times(creepCount, function() {
                    spawnQueue.push(role);
                })
            }
        });
        //console.log( " QUEUE: " +spawnQueue + ':' + spawnQueue.forEach(x=>console.log(x)))
        //console.log("------FINISHED")
        
        return spawnQueue;
    }
}

module.exports = CreepReport;