let speech = require ('utils.speech');

// TODO: make this more efficient by using the village to scan
Creep.prototype.isNearEnemy = function(range = 10) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range).length > 0;
}

Creep.prototype.nearbyEnemies = function(range = 10) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range);
}

Creep.prototype.buildMove = function(buildTarget) {
    let target =  Game.getObjectById(buildTarget);
// TODO: all not in range methods should be eradicated when pathfinding caches the nearest applicable spot for an action
    if (this.inRangeTo(target,4)) {
        this.moveTo(target); // TODO: find a place to park the builder in a way that it won't be in the way
        let status = this.build(target);
        switch(status) {
            case ERR_INVALID_TARGET:
                delete this.memory.buildTarget;
                break;
                // TODO: investigate if this was destroyed
        }
    } else {
        this.moveTo(target);
    }
}

/**
 * 
 * @param {string} role 
 * @param {string} message 
 */
Creep.prototype.emote = function(role, message) {    
    return this.say(speech.getRole(role)+(message ? message : ''))
}