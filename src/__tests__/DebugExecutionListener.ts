import Command from "./Command";
import ExecutionListener from "./ExecutionListener";

export default class DebugExecutionListener
    extends ExecutionListener {

    public readonly command: Command;
    private collectingArguments: boolean;

    constructor() {
        super();
        this.command = new Command();
        this.collectingArguments = false;
    }

    debug(data: string) {
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
