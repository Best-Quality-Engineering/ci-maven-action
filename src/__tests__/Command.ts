export default class Command {
    public tool: string;
    public readonly args: string[];

    constructor() {
        this.tool = "";
        this.args = [];
    }
}
