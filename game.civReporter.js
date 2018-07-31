var CivReport = require('game.civReport');
var roleCattle = require('civCattle'); // needs debugging
var roleColonizer = require('civColonizer'); // needs debugging
var roleMissionary = require('civMissionary'); // needs debugging
var roleConquerer = require('civConquerer'); // needs debugging

/**
 * FEATURE: Emergency mode: push basic configs to creepQueue if #creeps is below threshold
 */
var CivReporter = function(civCreeps, debug, village) {
    let civReport = new CivReport(debug, village.civPhase);
    village.debugMessage.append(`\t [CivReporter] is running for ${village.villageName}`);
    
    _.forEach(Object.keys(civCreeps), function(creepName) {
        if (!Game.creeps[creepName]) {
            delete Memory.Villages[village.villageName].colonization.civCreeps[creepName];
            return;
        }
        let creep = Game.creeps[creepName];
        let creepRole = civReport.report(creep, village);
        village.debugMessage.append(`\t\t [civReporter] ${creepName} is running role ${creepRole}`);

        try {
            //let start = Game.cpu.getUsed();
            switch (creepRole) {
                case 'cattle':
                    roleCattle.run(creep, village);
                    break;
                case 'colonizer':
                    roleColonizer.run(creep, village);
                    break;
                case 'missionary':
                    roleMissionary.run(creep, village);
                    break;
                case 'conquerer':
                    roleConquerer.run(creep, village);
                    break;   
            }
            //let end = Game.cpu.getUsed();
            //let total = end - start;
            //console.log(`For creep ${creepName}, ${creepRole}: CPU used is ${total}`)
        } catch (err) {
            console.log(`ERROR: ${creep.name} [ROLE: ${creepRole}] ${err.message}`);
        }
    });
    return civReport;
}

module.exports = CivReporter;