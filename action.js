const core = require("@actions/core");
const exec = require("@actions/exec");
const MavenArguments = require("./MavenArguments")

/**
 * @param {import("stream").Writable} outStream
 * @param {import("stream").Writable} errStream
 * @param {exec.ExecListeners} listeners
 * @return {Promise<void>}
 */
const action = async ({outStream = undefined, errStream = undefined, listeners = undefined} = {}) => {
    process.env.MAVEN_OPTS = core.getInput("maven-opts", {required: false});
    try {
        await exec.exec(
            "mvn",
            new MavenArguments()
                // Toggle Options
                .withErrors(core.getBooleanInput("errors", {required: true}))
                .withBatchMode(core.getBooleanInput("batch-mode", {required: true}))
                .withNoTransferProgress(core.getBooleanInput("no-transfer-progress", {required: true}))
                .withAlsoMake(core.getBooleanInput("also-make", {required: true}))
                .withAlsoMakeDependents(core.getBooleanInput("also-make-dependents", {required: true}))
                .withFailAtEnd(core.getBooleanInput("fail-at-end", {required: true}))
                .withFailFast(core.getBooleanInput("fail-fast", {required: true}))
                .withFailNever(core.getBooleanInput("fail-never", {required: true}))
                // Options
                .withSettingsFile(core.getInput("settings-file", {required: false}))
                .withToolchainsFile(core.getInput("toolchains-file", {required: false}))
                .withPomFile(core.getInput("pom-file", {required: false}))
                .withProfiles(core.getInput("profiles", {required: false}))
                .withProjects(core.getInput("projects", {required: false}))
                .withThreads(core.getInput("threads", {required: false}))
                // System Properties
                .withSystemProperties(core.getMultilineInput("system-properties", {required: false}))
                .withRevisionProperty(core.getInput("revision", {required: false}))
                .withSha1Property(core.getInput("sha1", {required: false}))
                .withChangelistProperty(core.getInput("changelist", {required: false}))
                // Goals
                .withGoals(core.getInput("goals", {required: false}))
                // Phases
                .withPhases(core.getInput("phases", {required: false}))
                .toArray(),
            {
                failOnStdErr: true,
                outStream,
                errStream,
                listeners
            });
    } catch (error) {
        core.setFailed(error.message);
        throw error;
    }
}

module.exports = action;
