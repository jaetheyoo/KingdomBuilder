var memoryHandler = {
    init : function() {
        console.log('hi')
        Memory.config = {};
        Memory.config.init = true;
        
        let spawnKeys = Object.keys(Game.spawns); 
        for (key in spawnKeys) {
            let flag = Game.spawns[spawnKeys[key]].pos.find(FIND_FLAGS, {
               filter: (f => f.name === 'hideout' )
            })[0];
            if (flag) {
                Memory.spawns[spawnKeys[key]].hideout = flag;
            }
        }
    }
}

module.exports = memoryHandler;