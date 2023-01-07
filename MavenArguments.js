/**
 * Encapsulates the available Maven command line arguments
 */
class MavenArguments {

    constructor() {
        this.toggles = new Set();
        this.options = [];
        this.goals = [];
        this.phases = [];
    }

    /**
     * @param {string} name
     * @param {boolean} enabled
     * @return {MavenArguments}
     */
    withToggle(name, enabled = true) {
        if (enabled) {
            this.toggles.add(name);
        }
        return this;
    }

    /**
     * @param {string} option
     * @return {MavenArguments}
     */
    withOption(option) {
        this.options.push(option);
        return this;
    }

    /**
     * @param {string} name
     * @param {string} value
     * @return {MavenArguments}
     */
    withSystemProperty(name, value = undefined) {
        if (value === undefined) {
            this.withOption(`-D${name}`);
        } else {
            this.withOption(`-D${name}=${value}`);
        }
        return this;
    }

    /**
     * @param {string[]} lines
     * @return {MavenArguments}
     */
    withSystemProperties(lines = []) {
        lines.flatMap(line =>
            line.split(",")
                .map(definition => definition.trim())
                .filter(definition => definition !== ""))
            .forEach(definition => {
                const [name, value] = definition.split("=");
                this.withSystemProperty(name, value);
            });
        return this;
    }

    /**
     * @param {boolean} enabled
     * @return {MavenArguments}
     */
    withErrors(enabled = true) {
        return this.withToggle("--errors", enabled);
    }

    /**
     * @param {boolean} enabled
     * @return {MavenArguments}
     */
    withNoTransferProgress(enabled = true) {
        return this.withToggle("--no-transfer-progress", enabled);
    }

    /**
     * @param {boolean} enabled
     * @return {MavenArguments}
     */
    withBatchMode(enabled = true) {
        return this.withToggle("--batch-mode", enabled);
    }

    /**
     * @param {string} file
     * @return {MavenArguments}
     */
    withSettingsFile(file = "") {
        if (file) {
            this.withOption(`-s=${file}`);
        }
        return this;
    }

    /**
     * @param {string} file
     * @return {MavenArguments}
     */
    withToolchainsFile(file = "") {
        if (file) {
            this.withOption(`-t=${file}`);
        }
        return this;
    }

    /**
     * @param {string} file
     * @return {MavenArguments}
     */
    withPomFile(file = "") {
        if (file) {
            this.withOption(`-f=${file}`);
        }
        return this;
    }

    /**
     * @param {string} profiles
     * @return {MavenArguments}
     */
    withProfiles(profiles = "") {
        profiles.split(/[ ,]+/)
            .map(profile => profile.trim())
            .filter(profile => profile !== "")
            .forEach(profile => this.withOption(`-P=${profile}`));
        return this;
    }

    /**
     * @param {string} projects
     * @return {MavenArguments}
     */
    withProjects(projects = "") {
        projects.split(/[ ,]+/)
            .map(project => project.trim())
            .filter(project => project !== "")
            .forEach(project => this.withOption(`-pl=${project}`));
        return this;
    }

    /**
     * @param {string} threads
     * @return {MavenArguments}
     */
    withThreads(threads = "") {
        if (threads) {
            this.withOption(`-T=${threads}`);
        }
        return this;
    }

    /**
     * @param {string} revision
     * @return {MavenArguments}
     */
    withRevisionProperty(revision) {
        if (revision !== undefined && revision !== "undefined") {
            this.withSystemProperty("revision", revision);
        }
        return this;
    }

    /**
     * @param {string} sha1
     * @return {MavenArguments}
     */
    withSha1Property(sha1) {
        if (sha1 !== undefined && sha1 !== "undefined") {
            this.withSystemProperty("sha1", sha1);
        }
        return this;
    }

    /**
     * @param {string} changelist
     * @return {MavenArguments}
     */
    withChangelistProperty(changelist) {
        if (changelist !== undefined && changelist !== "undefined") {
            this.withSystemProperty("changelist", changelist);
        }
        return this;
    }

    /**
     * @param {string} goals
     * @return {MavenArguments}
     */
    withGoals(goals = "") {
        this.goals = goals
            .split(/[ ,]+/)
            .map(goal => goal.trim())
            .filter(goal => goal !== "");
        return this;
    }

    /**
     * @param {string} phases
     * @return {MavenArguments}
     */
    withPhases(phases = "") {
        this.phases = phases
            .split(/[ ,]+/)
            .map(phase => phase.trim())
            .filter(phase => phase !== "");
        return this;
    }

    /**
     * @return {string[]}
     */
    toArray() {
        if (this.goals.length === 0 && this.phases.length === 0) {
            throw new Error("Maven goal(s) and/or phase(s) to execute must be specified")
        }
        const args = [];
        this.toggles.forEach(toggle => args.push(toggle));
        this.options.forEach(option => args.push(option));
        this.goals.forEach(goal => args.push(goal));
        this.phases.forEach(phase => args.push(phase));
        return args;
    }
}

module.exports = MavenArguments;