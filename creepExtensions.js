let speech = require ('utils.speech');

// TODO: make this more efficient by using the village to scan
Creep.prototype.isNearEnemy = function(range = 10) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range).length > 0;
}

Creep.prototype.nearbyEnemies = function(range = 10) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range);
}

/**
 * 
 * @param {string} role 
 * @param {string} message 
 */
Creep.prototype.emote = function(role, message) {    
    return this.say(speech.getRole(role)+(message ? message : ''))
}