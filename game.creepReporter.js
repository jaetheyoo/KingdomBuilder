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
        let creepRole = creepReport.report(creep, village);
        try {
            switch (creepRole) {
                case 'builder':
                    roleBuilder.run(creep, village);
                    break;
                case 'claimer':
                    roleClaimer.run(creep);
                    break;
                case 'harvester':
                    roleHarvester.run(creep, village);
                    break;
                case 'dropHarvester':
                    roleDropHarvester.run(creep, village);
                    break;
                case 'meleeDefender':
                    roleMeleeDefender.run(creep);
                    break;
                case 'remoteHarvester':
                    roleRemoteHarvester.run(creep,village.getSource(creep.name));
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
                    roleUpgrader.run(creep, village);
                    break;
                case 'extends':
                    roleExtends.run(creep);
                    break;
            }
        } catch (err) {
            console.log(`ERROR: ${creep.name} [ROLE: ${creepRole}] ` + err);
        }
    });
    
    return creepReport;
}

module.exports = CreepReporter;