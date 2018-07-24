var CreepReport = require('game.creepReport');
var roleBuilder = require('myBuilder'); // needs debugging
var roleRemoteClaimer = require('myRemoteClaimer');
var roleDropHarvester = require('myDropHarvester'); // needs debugging
var roleHarvester = require('myHarvester'); // needs debugging
var roleLinkMaintainer = require('myLinkMaintainer'); // needs debugging
var roleRepairer = require('myRepairer'); // needs debugging
var roleRemoteDropHarvester = require('myRemoteDropHarvester'); // needs debugging
var roleRemoteRepairer = require('myRemoteRepairer')
var roleRemoteBodyguard = require('myRemoteBodyguard')
var roleRemoteTransporter = require('myRemoteTransporter') // needs debugging
var roleScavenger = require('myScavenger'); // needs debugging
var roleUpgrader = require('myUpgrader'); // needs debugging
var roleMineralHarvester = require('myMineralHarvester'); // needs debugging
var roleMineralTransporter = require('myMineralTransporter'); // needs debugging
var roleLabManager = require('myLabManager'); // needs debugging
var roleDefenseContractor = require('myDefenseContractor');
/**
 * FEATURE: Emergency mode: push basic configs to creepQueue if #creeps is below threshold
 */
var CreepReporter = function(creeps, debug, village) {
    let creepReport = new CreepReport(debug, village.level);
    village.debugMessage.append(`\t [CreepReporter] is running for ${village.villageName}`);
    
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
            switch (creepRole) {
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
            }
        } catch (err) {
            console.log(`ERROR: ${creep.name} [ROLE: ${creepRole}] ${err.message}`);
        }
    });
    return creepReport;
}

module.exports = CreepReporter;