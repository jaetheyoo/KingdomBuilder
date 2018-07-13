var CreepReport = require('game.creepReport');
var roleExtends = require('role.extends');
var roleHarvester = require('role.harvester');
var roleBuilder = require('role.builder');
var roleUpgrader = require('role.upgrader');
var roleLinkMaintainer = require('role.linkMaintainer');
var roleDropHarvester = require('./role.dropHarvester');
var roleScavenger = require('./role.scavenger');
var roleRepairer = require('./role.repairer');
var roleRemoteDropHarvester = require('./role.remoteDropHarvester');
var roleRemoteRepairer = require('./role.remoteRepairer')

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
                case 'dropHarvester':
                    roleDropHarvester.run(creep, village);
                    break;
                case 'extends':
                    roleExtends.run(creep);
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
                    roleRepairer.run(creep);
                    break;
                case 'scavenger':
                    roleScavenger.run(creep, village);
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
            }
        } catch (err) {
            console.log(`ERROR: ${creep.name} [ROLE: ${creepRole}] ` + err);
        }
    });
    
    return creepReport;
}

module.exports = CreepReporter;