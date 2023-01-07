class MavenArguments {

    constructor() {
        this.toggles = new Set();
        this.options = [];
        this.goals = [];
        this.phases = [];
    }

    withToggle(name, enabled = true) {
        if (enabled) {
            this.toggles.add(name);
        }
        return this;
    }

    withOption(option) {
        this.options.push(option);
        return this;
    }

    withErrors(enabled = true) {
        return this.withToggle("--errors", enabled);
    }

    withNoTransferProgress(enabled = true) {
        return this.withToggle("--no-transfer-progress", enabled);
    }

    withBatchMode(enabled = true) {
        return this.withToggle("--batch-mode", enabled);
    }

    withSettings(settings = "") {
        if (settings) {
            this.withOption(`-s=${settings}`);
        }
        return this;
    }

    withToolchains(toolchains = "") {
        if (toolchains) {
            this.withOption(`-t=${toolchains}`);
        }
        return this;
    }

    withFile(file = "") {
        if (file) {
            this.withOption(`-f=${file}`);
        }
        return this;
    }

    withProfiles(profiles = "") {
        profiles.split(/[ ,]+/)
            .map(profile => profile.trim())
            .filter(profile => profile !== "")
            .forEach(profile => this.withOption(`-P=${profile}`));
        return this;
    }

    withProjects(projects = "") {
        projects.split(/[ ,]+/)
            .map(project => project.trim())
            .filter(project => project !== "")
            .forEach(project => this.withOption(`-pl=${project}`));
        return this;
    }

    withThreads(threads = "") {
        if (threads) {
            this.withOption(`-T=${threads}`);
        }
        return this;
    }

    withRevisionProperty(revision) {
        if (revision !== undefined && revision !== "undefined") {
            this.withOption(`-Drevision=${revision}`);
        }
        return this;
    }

    withSha1Property(sha1) {
        if (sha1 !== undefined && sha1 !== "undefined") {
            this.withOption(`-Dsha1=${sha1}`);
        }
        return this;
    }

    withChangelistProperty(changelist) {
        if (changelist !== undefined && changelist !== "undefined") {
            this.withOption(`-Dchangelist=${changelist}`);
        }
        return this;
    }

    withGoals(goals = "") {
        this.goals = goals
            .split(/[ ,]+/)
            .map(goal => goal.trim())
            .filter(goal => goal !== "");
        return this;
    }

    withPhases(phases = "") {
        this.phases = phases
            .split(/[ ,]+/)
            .map(phase => phase.trim())
            .filter(phase => phase !== "");
        return this;
    }

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