const process = require("process");
const child = require("child_process");
const path = require("path");
const run = require("./action");

// shows how the runner will run a javascript action with env / stdout protocol
test("should execute command with only goals specified", async () => {
    process.env["INPUT_ERRORS"] = "true";
    process.env["INPUT_BATCH_MODE"] = "true";
    process.env["INPUT_NO_TRANSFER_PROGRESS"] = "true";
    process.env["INPUT_REVISION"] = "undefined";
    process.env["INPUT_SHA1"] = "undefined";
    process.env["INPUT_CHANGELIST"] = "undefined";
    process.env["INPUT_GOALS"] = "clean install";
    await run();
})
