var roleRemoteDropHarvester = {

    /** @param {Creep} creep **/
    run: function(creep,flag) {
        if (!creep.pos.isEqualTo(flag.pos)) {
                creep.moveTo(flag, {visualizePathStyle: {stroke: '#ffffff'}});    
        } else {
            var source = creep.pos.findClosestByRange(FIND_SOURCES);
            creep.harvest(source);
        }
    }
};

module.exports = roleRemoteDropHarvester;