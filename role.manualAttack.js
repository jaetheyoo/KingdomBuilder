var roleManualAttack = {

    /** @param {Creep} creep **/
    run: function(creep) {
        attackFlag = Game.flags[creep.memory.attackFlag];
        healFlag = Game.flags[creep.memory.healFlag];
        if (creep.memory.attack && attackFlag && !creep.room.find(attackFlag).length) {
            creep.moveTo(attackFlag, {visualizePathStyle: {stroke: '#ffffff'}})
        }
        
        if (creep.hits <= creep.hitsMax - 10) {
            creep.memory.attack = false;
            creep.moveTo(healFlag,{visualizePathStyle: {stroke: '#ffffff'}});
        } 
        if (creep.hits === creep.hitsMax) {
            creep.memory.attack = true;
        }
        
        if (!creep.memory.attack) {
            creep.moveTo(healFlag,{visualizePathStyle: {stroke: '#ffffff'}});
        } else {
            
        }
         let target = creep.pos.findClosestByRange(FIND_HOSTILE_STRUCTURES, {filter: (structure) => {
                    return (structure.structureType == STRUCTURE_RAMPART)}});
            if(target) {
                
                if(creep.attack(target) == ERR_NOT_IN_RANGE) {
                    console.log(target)
                    creep.moveTo(target)
                }
            } else {
                target = creep.pos.findInRange(FIND_HOSTILE_CREEPS,1);
                if(target[0]) {
                    if(creep.attack(target[0]) == ERR_NOT_IN_RANGE) {
                        console.log('die ' + target)
                        creep.moveTo(target);
                    }
                }
            }
    }
}

module.exports = roleManualAttack;