var CreepReport = require('game.creepReport');
var roleExtends = require('role.extends');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');

/**
 * FEATURE: Emergency mode: push basic configs to creepQueue if #creeps is below threshold
 */
var CreepReporter = function(creeps, debug, village) {
    let creepReport = new CreepReport(debug, village.level);
    _.forEach(Object.keys(creeps), function(creepName) {
        // console.log('id: ' + idx + ' | CreepName: ' + creepName)
        let creep = Game.creeps[creepName];
        creepReport.report(creep, village);
        let creepRole = village.creeps[creepName].role;
        
        switch (creepRole) {
            case 'builder':
                roleBuilder.run(creep, village.remoteRooms);
                break;
            case 'claimer':
                roleClaimer.run(creep);
                break;
            case 'harvester':
                roleHarvester.run(creep, village);
                break;
            case 'dropHarvester':
                roleDropHarvester.run(creep, village.getDropHarvestLocation(creepName), village.getSource(creepName));
                break;
            case 'meleeDefender':
                roleMeleeDefender.run(creep);
                break;
            case 'remoteHarvester':
                roleRemoteHarvester.run(creep);
                break;
            case 'remoteTransporter':
                roleRemoteTransporter.run(creep);
                break;
            case 'repairer':
                roleRepairer.run(creep);
                break;
            case 'scavenger':
                roleScavenger.run(creep);
                break;
            case 'scout':
                roleScout.run(creep);
                break;
            case 'transporter':
                roleTransporter.run(creep);
                break;
            case 'upgrader':
                roleUpgrader.run(creep);
                break;
            case 'extends':
                roleExtends.run(creep);
                break;
        }
    });
    
    return creepReport;
}

module.exports = CreepReporter;