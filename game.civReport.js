/**
 * spawnQueue: creepConfig[] which is a priority-sorted list of CreepConfigs
 *  --pop(): returns the next highest-priority spawn and removes it from the queue
 *  --peek(): returns ref to the next highest-priority spawn
 */
class CivReport {
    constructor(debug, phase) {
        this.debug = debug;
        this.counts = {'hostiles' : 0};
        this.phase = phase;
    }

    config() {
        return {
            "cattle": { "priority": 6, "count": 5},
            "colonizer": { "priority": 8, "count": 1},
            "missionary": { "priority": 7, "count": 1},
            "conquerer": { "priority": 9, "count": 1}
        };
    }

    /**
     * Tallies all creep roles in a village for processing.
     * Returns a creep role 
     * @param {creep} creep
     * @param {Village} village
     */
    report(creep, village) {
        let myRole = village.colonization.civCreeps[creep.name].role;
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

    process(village) {
        if (this.phase == 2) {
            return [];
        }
        //village.debugMessage.append(`\t [CreepReport] BEGIN processing for ${village.villageName}`);
        //console.log(`\t [CreepReport] BEGIN processing for ${village.villageName} lv ${village.level}`);
        let config = this.config();
        //console.log(this.level)

        // return the first role by priority that isn't filled out
        // for each role
        let priorityList = Object.keys(config).sort(function(a, b) {
            if (config[a].priority < config[b].priority) {
                return 1;
            } else {
                return -1;
            }
        });
        let that = this;
        //console.log(`\t\t [CreepReport] priority list: ${priorityList}`);
        //village.debugMessage.append(`\t\t [CreepReport] priority list: ${priorityList}`);
        var spawnQueue = [];
        //console.log("------STARTING")
        _.forEach(priorityList, function(role) {
            // Calculate differently for remote roles
            let adjustedCount = config[role].count;
            switch(role) {
                case 'conquerer':
                    if (village.colonization.civRoom) { // if I've claimed the controller
                        adjustedCount = 0;
                    }
                    break;
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

module.exports = CivReport;