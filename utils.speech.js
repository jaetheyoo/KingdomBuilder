var speech = {
    getRole(role) { 
        let roleEmote = '';
        switch (role) {
            case 'cattle':
                roleEmote =  '🐮';
                break;    
            case 'colonizer':
                roleEmote =  '👑';
                break;    
            case 'missionary':
                roleEmote =  '⛩️';
                break;             
            case 'conquerer':
                roleEmote =  '🏁';
                break;                
            case 'defenseContractor':
                roleEmote =  '🏯️';
                break;
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
                roleEmote = '👩‍🌾';
                break;
            case 'labManager':
                roleEmote = '⚗️️';
                 break;
            case 'meleeDefender':
                roleEmote = '🛡️';
                 break;
            case 'remoteClaimer':
                roleEmote =  '🚩';
                break;
            case 'remoteDropHarvester':
                roleEmote = '🏕️';
                 break;
            case 'remoteTransporter':
                roleEmote = '🚚';
                 break;
            case 'remoteRepairer':
                roleEmote = '🛰️';
                break;
            case 'remoteBodyguard':
                roleEmote =  '🛡️';
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
            case 'mineralTransporter':
                roleEmote = '💍'
                break;
            case 'mineralHarvester':
                roleEmote = '💎';
                break;
        }
        return roleEmote;
    },
    get MINE() {
        return '⚒️';
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
    
    get MARKET() {
        return '💱';
    },
    get MOVING() {
        return '🚕';
    },
    
    get REMOTEMOVING() {
        return '✈️';
    },
    get WAITING() {
        return '⏳';
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