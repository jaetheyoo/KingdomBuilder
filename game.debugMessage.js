class DebugMessage {
    constructor() {
        this.baseMessage = 'DebugLogs:'
        this.message = '';
    }

    append(message) {
        this.message += ('\n' + message);
    }

    log() {
        if (this.message != '') {
            let consumedMessage = this.baseMessage + this.message;
            this.message = '';
            console.log(consumedMessage);
        }
    }
}

module.exports = DebugMessage;