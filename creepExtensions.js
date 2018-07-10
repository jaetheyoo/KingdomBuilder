let speech = require ('utils.speech');

Creep.prototype.isNearEnemy = function(range = 10) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range).length > 0;
}

Creep.prototype.nearbyEnemies = function(range = 10) {
    return this.pos.findInRange(FIND_HOSTILE_CREEPS, range);
}

Creep.prototype.emote = function(message) {
    let myRole = speech.getRole(this.memory.role);
    
    return this.say(myRole+(message ? message : ''))
}