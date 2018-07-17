/*
 * Module code goes here. Use 'module.exports' to export things:
 * module.exports.thing = 'a thing';
 *
 * You can import it from another modules like this:
 * var mod = require('utils.speech');
 * mod.thing == 'a thing'; // true
 */

var speech = {
    getRole(role) {
        let roleEmote = '';
        switch (role) {
            case 'meleeBodyguard':
                roleEmote =  '🛡️';
                break;
            case 'builder':
                roleEmote =  '👷';
                break;
            case 'claimer':
                roleEmote =  '🚩';
                break;
            case 'harvester':
                roleEmote = '⛏️';
                 break;
            case 'dropHarvester':
                roleEmote = '👨‍🔧';
                break;
            case 'meleeDefender':
                roleEmote = '🛡️';
                 break;
            case 'remoteDropHarvester':
                roleEmote = '🏕️';
                 break;
            case 'remoteTransporter':
                roleEmote = '🚚';
                 break;
            case 'remoteRepairer':
                roleEmote = '📡'
                break;
            case 'repairer':
                roleEmote =  '🏗️';
                break;
            case 'scavenger':
                roleEmote = '🦉';
                 break;
            case 'scout':
                roleEmote  = '🕵️';
                break;
            case 'transporter':
                roleEmote = '📦';
                break;
            case 'upgrader':
                roleEmote =  '🤖';
                break;
            case 'linkMaintainer':
                roleEmote = '🔗';
                break;
        }
        return roleEmote;
    },
    
    get OLD() {
        return'👴🏻';
    },
    
    get IDLE() {
        return'🎵';
    },
    
    get DROPOFF() {
        return '📦'
    },

    get OLDBUILDER() {
        return '👷👴🏻';
    },
    
    get REFILL() {
        return '⛽';
    },

    get RUN() {
        return '😱';
    },
    
    get REPAIR() {
        return '🔧';
    },
    get ATTACKING() {
        return '🗡️';
    },
    get UPGRADE() {
        return '⚡';
    },
    
    get BUILD() {
        return '🚧';
    },
    
    get MOVING() {
        return '🚕';
    },
    
    get REMOTEMOVING() {
        return '✈️';
    },
    
    get REMOTEBUILD() {
        return '✈️👷';
    },
    
    get HARVEST() {
        return '🔋';
    },
    
    get REMOTEHARVEST() {
        return '✈️🔋';
    },
    
    get TRANSFER() {
        return '🚌';
    },
    get REMOTETRAVEL() {
        return '🗺️'
    },
    get TRANSPORT() {
        return '📦';
    },
    
    get REMOTETRANSFER() {
        return '✈️🚌';
    },
    get REMOTETRANSPORTER() {
        return '✈️🚌';
    },
    get CLAIMING() {
        return '☠️';
    },
    get SCAVENGE() {
        return '🦉';
    },
    
    get WAIT() {
        return '🛑';
    },
    get PICKUP() {
        return'✋';
    },
    get RIP() {
        return '⚰️'
    },
    get WITHDRAW() {
        return '💰'
    },
    get PATROL() {
        return '🏰';
    }
}

module.exports = speech;