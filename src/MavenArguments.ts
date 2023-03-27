/**
 * Encapsulates the available Maven command line arguments
 */
export default class MavenArguments {
    private readonly toggles: Set<string>;
    private readonly options: string[];
    private readonly goals: string[];
    private readonly phases: string[];

    constructor() {
        this.toggles = new Set<string>();
        this.options = [];
        this.goals = [];
        this.phases = [];
    }

    withToggle(name: string, enabled: boolean = true): MavenArguments {
        if (enabled) {
            this.toggles.add(name);
        }
        return this;
    }

    withOption(option: string): MavenArguments {
        this.options.push(option);
        return this;
    }

    withSystemProperty(name: string, value: string | undefined = undefined): MavenArguments {
        if (value === undefined) {
            this.withOption(`-D${name}`);
        } else {
            this.withOption(`-D${name}=${value}`);
        }
        return this;
    }

    withSystemProperties(lines: string[] = []): MavenArguments {
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

    withErrors(enabled: boolean = true): MavenArguments {
        return this.withToggle("--errors", enabled);
    }

    withNoTransferProgress(enabled: boolean = true): MavenArguments {
        return this.withToggle("--no-transfer-progress", enabled);
    }

    withBatchMode(enabled: boolean = true): MavenArguments {
        return this.withToggle("--batch-mode", enabled);
    }

    withAlsoMake(enabled: boolean = true): MavenArguments {
        return this.withToggle("--also-make", enabled);
    }

    withAlsoMakeDependents(enabled: boolean = true): MavenArguments {
        return this.withToggle("--also-make-dependents", enabled);
    }

    withFailAtEnd(enabled: boolean = true): MavenArguments {
        return this.withToggle("--fail-at-end", enabled);
    }

    withFailFast(enabled: boolean = true): MavenArguments {
        return this.withToggle("--fail-fast", enabled);
    }

    withFailNever(enabled: boolean = true): MavenArguments {
        return this.withToggle("--fail-never", enabled);
    }

    withSettingsFile(file: string = ""): MavenArguments {
        if (file) {
            this.withOption(`-s=${file}`);
        }
        return this;
    }

    withToolchainsFile(file: string = ""): MavenArguments {
        if (file) {
            this.withOption(`-t=${file}`);
        }
        return this;
    }

    withPomFile(file: string = ""): MavenArguments {
        if (file) {
            this.withOption(`-f=${file}`);
        }
        return this;
    }

    withProfiles(profiles: string = ""): MavenArguments {
        profiles.split(/[ ,]+/)
            .map(profile => profile.trim())
            .filter(profile => profile !== "")
            .forEach(profile => this.withOption(`-P=${profile}`));
        return this;
    }

    withProjects(projects: string = ""): MavenArguments {
        projects.split(/[ ,]+/)
            .map(project => project.trim())
            .filter(project => project !== "")
            .forEach(project => this.withOption(`-pl=${project}`));
        return this;
    }

    withThreads(threads: string = ""): MavenArguments {
        if (threads) {
            this.withOption(`-T=${threads}`);
        }
        return this;
    }

    withRevisionProperty(revision: string | undefined): MavenArguments {
        if (revision !== undefined && revision !== "undefined") {
            this.withSystemProperty("revision", revision);
        }
        return this;
    }

    withSha1Property(sha1: string | undefined): MavenArguments {
        if (sha1 !== undefined && sha1 !== "undefined") {
            this.withSystemProperty("sha1", sha1);
        }
        return this;
    }

    withChangelistProperty(changelist: string | undefined): MavenArguments {
        if (changelist !== undefined && changelist !== "undefined") {
            this.withSystemProperty("changelist", changelist);
        }
        return this;
    }

    withGoal(goal: string): MavenArguments {
        this.goals.push(goal);
        return this;
    }

    withGoals(goals: string = ""): MavenArguments {
        this.goals.length = 0;
        goals.split(/[ ,]+/)
            .map(goal => goal.trim())
            .filter(goal => goal !== "")
            .forEach(goal => this.withGoal(goal));
        return this;
    }

    withPhase(phase: string): MavenArguments {
        this.phases.push(phase);
        return this;
    }

    withPhases(phases: string = ""): MavenArguments {
        this.phases.length = 0;
        phases.split(/[ ,]+/)
            .map(phase => phase.trim())
            .filter(phase => phase !== "")
            .forEach(phase => this.withPhase(phase));
        return this;
    }

    getToggles(): Set<string> {
        return new Set<string>(this.toggles);
    }

    getOptions(): string[] {
        return [...this.options];
    }

    getGoals(): string[] {
        return [...this.goals];
    }

    getPhases(): string[] {
        return [...this.phases];
    }

    toArray(): string[] {
        if (this.goals.length === 0 && this.phases.length === 0) {
            throw new Error("Maven goal(s) and/or phase(s) to execute must be specified");
        }
        const args: string[] = [];
        this.toggles.forEach(toggle => args.push(toggle));
        this.options.forEach(option => args.push(option));
        this.goals.forEach(goal => args.push(goal));
        this.phases.forEach(phase => args.push(phase));
        return args;
    }
}
