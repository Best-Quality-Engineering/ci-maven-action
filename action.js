const core = require("@actions/core");
const exec = require("@actions/exec");
const MavenArguments = require("./MavenArguments")

const action = async () => {
    try {
        await exec.exec("mvn", new MavenArguments()
            // boolean options
            .withErrors(core.getBooleanInput("errors", {required: true}))
            .withBatchMode(core.getBooleanInput("batch_mode", {required: true}))
            .withNoTransferProgress(core.getBooleanInput("no_transfer_progress", {required: true}))
            // CI-friendly properties
            .withRevisionProperty(core.getInput("revision", {required: true}))
            .withSha1Property(core.getInput("sha1", {required: true}))
            .withChangelistProperty(core.getInput("changelist", {required: true}))
            // Options
            .withFile(core.getInput("file", {required: false}))
            .withProfiles(core.getInput("profiles", {required: false}))
            .withProjects(core.getInput("projects", {required: false}))
            .withSettings(core.getInput("settings", {required: false}))
            .withToolchains(core.getInput("toolchains", {required: false}))
            .withThreads(core.getInput("threads", {required: false}))
            // Goals
            .withGoals(core.getInput("goals", {required: false}))
            // Phases
            .withPhases(core.getInput("phases", {required: false}))
            .toArray())
    } catch (error) {
        core.setFailed(error.message);
    }
}

module.exports = action;
