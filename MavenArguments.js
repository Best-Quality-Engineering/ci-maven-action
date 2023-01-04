class MavenArguments {

    constructor(initial = []) {
        this.args = initial;
    }

    withErrors(enabled = true) {
        if (enabled) {
            this.args.push("--errors");
        }
        return this;
    }

    withNoTransferProgress(enabled = true) {
        if (enabled) {
            this.args.push("--no-transfer-progress");
        }
        return this;
    }

    withBatchMode(enabled = true) {
        if (enabled) {
            this.args.push("--batch-mode");
        }
        return this;
    }

    withActiveProfiles(profiles) {
        if (profiles !== undefined && profiles !== "undefined") {
            this.args.push(`-P ${profiles}`);
        }
        return this;
    }

    withRevisionProperty(revision) {
        if (revision !== undefined && revision !== "undefined") {
            this.args.push(`-D revision="${revision}"`);
        }
        return this;
    }

    withSha1Property(sha1) {
        if (sha1 !== undefined && sha1 !== "undefined") {
            this.args.push(`-D sha1="${sha1}"`);
        }
        return this;
    }

    withChangelistProperty(changelist) {
        if (changelist !== undefined && changelist !== "undefined") {
            this.args.push(`-D changelist="${changelist}"`);
        }
        return this;
    }

    withGoals(goals) {
        this.args.push(goals);
        return this;
    }

    toArray() {
        return [...this.args];
    }
}

module.exports = MavenArguments;