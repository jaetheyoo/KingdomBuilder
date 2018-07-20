let speech = require ('utils.speech');

let roleBase = {
    /** @param {Creep} creep **/
    /** @description returns a status code of -1 if behavior overrides default, else 0 */
    fight: function(creep) {
        return 0;
    },
    flight : function(creep, village) {
        let flag = Game.flags[village.getHideoutFlag()];
        if (!flag) {
            throw new Error(`${creep.name}-role.base: flight() ERROR: no hideoutFlag`);
        }
        if (creep.isNearEnemy()) {
            let myRemoteRoom = village.creeps[creep.name].remoteRoom ? village.creeps[creep.name].remoteRoom : village.creeps[creep.name].myRemoteRoom;
            if (myRemoteRoom) {
                let remoteRoom = village.remoteRooms[myRemoteRoom];
                if (remoteRoom) {
                    remoteRoom.underAttack = true;
                }
            }
            creep.say(speech.RUN);
            creep.moveTo(flag);
            return -1;
        } else {
            return 0;
        }
    },
    run: function(creep, village) {
        return creep.memory.protocol === 'fight' ? this.fight(creep) : this.flight(creep, village);
    }
};

module.exports = roleBase;

// TODO: maximize uptime by making creep move back to base before they die and starting the spawn process before the previous creep is dead

// if(creep.memory.role == 'meleeDefender') {
//     creep.say('DIE');
//     roleMeleeDefender.run(creep);
// } else if (creep.memory.role == 'scout') {
//     creep.say('hello');
//     roleScout.run(creep);
// }else if(creep.memory.role == 'claimer') {
//     creep.say('ð©');
//     roleClaimer.run(creep);
// } else if (creep.pos.findInRange(FIND_HOSTILE_CREEPS,10).length) {
//     creep.moveTo(Game.flags['DefenseWaiting']);
//     creep.say('RUNNNN')
// } else {
//     let repairers = creep.room.find(FIND_MY_CREEPS, {
//         filter: function(object) {
//             return object.memory.role === 'repairer';
//         }
//     });
    
//     var adjustedMaxRepairers = conf.MAXREPAIRERS;
//     if (creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES)) {
//         adjustedMaxRepairers--;
//     }

//     if (creep.ticksToLive <= 10) {
//         creep.say("ð RIP");
//         creep.moveTo( Game.spawns['Spawn1'], {visualizePathStyle: {stroke: '#272626'}});
//         Game.spawns['Spawn1'].recycleCreep(creep);
//     }
// }