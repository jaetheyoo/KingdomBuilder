
Creep.prototype.work = function() {
    this.task.run();
}

// TaskGiver(creep, task)
//     gives a task to a creep

TaskGiver(creep, task)

task (creep)
/**
 * Tasks: 
 *      overriding -- do no more tasks
 *      blocking -- don't get interrupted
 *      priority: 1 emergency: interruptes everything, interrupted by nothing
 *              2 busy, but can be interrupted: interrupted by priority 1 only
 *              3 small tasks that can be interrupted: interrupted by 1-3
 *              4 idle: overriden by anything
 */


//Scavenger: 
/*
    role: scavenger
    tasks: [scan, getTombstones, getresources, ]


    scan(): look for tombstones in map
*/

//Citizen Screep:
/*
    role: citizen
    tasks: [run-priority 3, ]
*/

// Harvester:
/*
    role: harvester
    tasks: [moveTo, harvest]
*/

/*
Palantir:
    role: palantir
    tasks: [scan]
    scavengers: creep[]

    scan: look for stimuli on map and notify appropriate creeps
        find(stimuli, notifyTarget)
        find closest scavenger and notify
*/