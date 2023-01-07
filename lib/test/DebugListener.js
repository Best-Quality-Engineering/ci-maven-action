const Command = require("./Command");

class DebugListener {

    constructor() {
        this.command = new Command();
        this.collectingArguments = false;
    }

    /**
     * @param {string} data
     */
    onDebug(data) {
        if (data.startsWith("exec tool: ")) {
            this.command.tool = data.substring(11);
        } else if (data.startsWith("arguments:")) {
            this.collectingArguments = true;
        } else if (data.startsWith("Exit code")) {
            this.collectingArguments = false;
        } else if (this.collectingArguments) {
            this.command.args.push(data.trim());
        }
    }
}

module.exports = DebugListener;