const process = require("process");
const child = require("child_process");
const path = require("path");

// shows how the runner will run a javascript action with env / stdout protocol
test("should execute command with only goals specified", () => {
    process.env["INPUT_ERRORS"] = "true";
    process.env["INPUT_BATCH_MODE"] = "true";
    process.env["INPUT_NO_TRANSFER_PROGRESS"] = "true";
    process.env["INPUT_PROFILES"] = "undefined";
    process.env["INPUT_REVISION"] = "undefined";
    process.env["INPUT_SHA1"] = "undefined";
    process.env["INPUT_CHANGELIST"] = "undefined";
    process.env["INPUT_GOALS"] = "clean install";
    const script = path.join(__dirname, "index.js");
    const result = child.execSync(`node ${script}`, {env: process.env}).toString();
    console.log(result);
})
