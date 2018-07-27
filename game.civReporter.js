var CivReport = require('game.civReport');
var cattle = require('civCattle'); // needs debugging
var colonizer = require('civColonizer'); // needs debugging
var missionary = require('civMissionary'); // needs debugging
var conquerer = require('conquerer'); // needs debugging

/**
 * FEATURE: Emergency mode: push basic configs to creepQueue if #creeps is below threshold
 */
var CivReporter = function(civCreeps, debug, village) {
    let civReport = new CivReport(debug, village.level);
    village.debugMessage.append(`\t [CivReporter] is running for ${village.villageName}`);
    
    _.forEach(Object.keys(creeps), function(creepName) {
        if (!Game.creeps[creepName]) {
            village.deregister(creepName);
            delete Memory.Villages[village.villageName].creeps[creepName];
            delete village.creeps[creepName];
            return;
        }
        let creep = Game.creeps[creepName];
        let creepRole = creepReport.report(creep, village);
        village.debugMessage.append(`\t\t [CreepReporter] ${creepName} is running role ${creepRole}`);

        try {
            //let start = Game.cpu.getUsed();
            switch (creepRole) {
                case 'warDrainer':
                    warDrainer.run(creep,village);
                    break;
                case 'defenseContractor':
                    roleDefenseContractor.run(creep,village);
                    break;
                case 'builder':
                    roleBuilder.run(creep, village);
                    break;
                case 'remoteClaimer':
                    roleRemoteClaimer.run(creep, village);
                    break;
                case 'dropHarvester':
                    roleDropHarvester.run(creep, village);
                    break;
                case 'harvester':
                    roleHarvester.run(creep, village);
                    break;
                case 'linkMaintainer':
                    roleLinkMaintainer.run(creep,village);
                    break;
                case 'meleeDefender':
                    roleMeleeDefender.run(creep);
                    break;
                case 'remoteDropHarvester':
                    roleRemoteDropHarvester.run(creep,village);
                    break;
                case 'remoteBodyguard':
                    roleRemoteBodyguard.run(creep,village);
                    break;                    
                case 'remoteHarvester':
                    roleRemoteHarvester.run(creep,village);
                    break;
                case 'remoteRepairer':
                    roleRemoteRepairer.run(creep,village);
                    break;
                case 'remoteTransporter':
                    roleRemoteTransporter.run(creep,village);
                    break;
                case 'repairer':
                    roleRepairer.run(creep, village);
                    break;
                case 'scavenger':
                    roleScavenger.run(creep, village);
                    break;
                case 'scout':
                    roleScout.run(creep);
                    break;
                case 'upgrader':
                    roleUpgrader.run(creep, village);
                    break;
                case 'mineralHarvester':
                    roleMineralHarvester.run(creep, village);
                    break;
                case 'mineralTransporter':
                    roleMineralTransporter.run(creep, village);
                    break;
                case 'labManager': 
                    roleLabManager.run(creep,village);
                    break;
                case 'warSeigeBreaker': 
                    warSeigeBreaker.run(creep,village);
                    break;
                case 'warGuardianAngel': 
                    warGuardianAngel.run(creep,village);
                    break;    
            }
            //let end = Game.cpu.getUsed();
            //let total = end - start;
            //console.log(`For creep ${creepName}, ${creepRole}: CPU used is ${total}`)
        } catch (err) {
            console.log(`ERROR: ${creep.name} [ROLE: ${creepRole}] ${err.message}`);
        }
    });
    return creepReport;
}

module.exports = CivReporter;