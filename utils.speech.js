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
            case 'remoteHarvester':
                roleEmote = '✈️⛏️';
                 break;
            case 'remoteTransporter':
                roleEmote = '✈️📦';
                 break;
            case 'repairer':
                roleEmote =  '🔧';
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
        }
        return roleEmote;
    },
    get OLD() {
        return'👴🏻';
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
    
    get REMOTETRANSFER() {
        return '✈️🚌';
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
        return '🏧'
    }
}

module.exports = speech;