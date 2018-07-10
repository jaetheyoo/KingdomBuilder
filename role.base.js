let speech = require ('utils.speech');

let roleBase = {
    /** @param {Creep} creep **/
    /** @description returns a status code of -1 if behavior overrides default, else 0 */
    fight: function(creep) {
        return 0;
    },
    flight : function(creep) {
        if (creep.isNearEnemy) {
            creep.say(speech.RUN);
            let flagName = Game.spawns[creep.memory.homeBase].memory.hideoutFlag;
            creep.moveTo(Game.flags[flagName])
            return -1;
        } else {
            return 0;
        }
    },
    run: function(creep) {
        return creep.memory.protocol === 'fight' ? this.fight(creep) : this.flight(creep);
    }
};

module.exports = roleBase;

if(creep.memory.role == 'meleeDefender') {
    creep.say('DIE');
    roleMeleeDefender.run(creep);
} else if (creep.memory.role == 'scout') {
    creep.say('hello');
    roleScout.run(creep);
}else if(creep.memory.role == 'claimer') {
    creep.say('🚩');
    roleClaimer.run(creep);
} else if (creep.pos.findInRange(FIND_HOSTILE_CREEPS,10).length) {
    creep.moveTo(Game.flags['DefenseWaiting']);
    creep.say('RUNNNN')
} else {
    let repairers = creep.room.find(FIND_MY_CREEPS, {
        filter: function(object) {
            return object.memory.role === 'repairer';
        }
    });
    
    var adjustedMaxRepairers = conf.MAXREPAIRERS;
    if (creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)) {
        adjustedMaxRepairers--;
    }

    if (creep.ticksToLive <= 10) {
        creep.say("💀 RIP");
        creep.moveTo( Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#272626'}});
        Game.spawns['Spawn1'].recycleCreep(creep);
    }
}