const core = require("@actions/core");
const exec = require("@actions/exec");
const MavenArguments = require("./MavenArguments")

async function run() {
    try {
        await exec.exec("mvn", new MavenArguments()
            .withErrors(core.getBooleanInput("errors", {required: true}))
            .withBatchMode(core.getBooleanInput("batch_mode", {required: true}))
            .withNoTransferProgress(core.getBooleanInput("no_transfer_progress", {required: true}))
            .withActiveProfiles(core.getInput("profiles", {required: true}))
            .withRevisionProperty(core.getInput("revision", {required: true}))
            .withSha1Property(core.getInput("sha1", {required: true}))
            .withChangelistProperty(core.getInput("changelist", {required: true}))
            .withGoals(core.getInput("goals", {required: true}))
            .toArray())
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
