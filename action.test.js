const process = require("process");
const action = require("./action");
require("./lib/test/action-expectations");


const INPUT_ERRORS = "INPUT_ERRORS";
const INPUT_BATCH_MODE = "INPUT_BATCH-MODE";
const INPUT_NO_TRANSFER_PROGRESS = "INPUT_NO-TRANSFER-PROGRESS";

const INPUT_SETTINGS_PATH = "INPUT_SETTINGS-PATH";
const INPUT_TOOLCHAINS_PATH = "INPUT_TOOLCHAINS-PATH";
const INPUT_PROJECT_PATH = "INPUT_PROJECT-PATH";
const INPUT_PROFILES = "INPUT_PROFILES";
const INPUT_PROJECTS = "INPUT_PROJECTS";
const INPUT_THREADS = "INPUT_THREADS";

const INPUT_REVISION = "INPUT_REVISION";
const INPUT_SHA1 = "INPUT_SHA1";
const INPUT_CHANGELIST = "INPUT_CHANGELIST";

const INPUT_GOALS = "INPUT_GOALS";
const INPUT_PHASES = "INPUT_PHASES";

jest.setTimeout(10000);

describe("The action function", () => {

    beforeEach(() => {
        // Setup inputs with default values
        process.env["INPUT_ERRORS"] = "true";
        process.env["INPUT_BATCH-MODE"] = "true";
        process.env["INPUT_NO-TRANSFER-PROGRESS"] = "true";

        process.env["INPUT_REVISION"] = "undefined";
        process.env["INPUT_SHA1"] = "undefined";
        process.env["INPUT_CHANGELIST"] = "undefined";
    });

    afterEach(() => {
        delete process.env[INPUT_ERRORS];
        delete process.env[INPUT_BATCH_MODE];
        delete process.env[INPUT_NO_TRANSFER_PROGRESS];

        delete process.env[INPUT_SETTINGS_PATH];
        delete process.env[INPUT_TOOLCHAINS_PATH];
        delete process.env[INPUT_PROJECT_PATH];
        delete process.env[INPUT_PROFILES];
        delete process.env[INPUT_PROJECTS];
        delete process.env[INPUT_THREADS];

        delete process.env[INPUT_REVISION];
        delete process.env[INPUT_SHA1];
        delete process.env[INPUT_CHANGELIST];

        delete process.env[INPUT_GOALS];
        delete process.env[INPUT_PHASES];
    });

    describe("validation", () => {
        it("should fail when no goal or phase is specified", async () => {
            await expect(() => action()).rejects
                .toThrowError("Maven goal(s) and/or phase(s) to execute must be specified")
        });
    });

    async function runAction() {
        // TODO: Capture output
        const output = Buffer.from("[command]/usr/local/bin/mvn --errors --batch-mode --no-transfer-progress");
        await action({outStream: undefined});
        return output;
    }

    describe("single module project", () => {
        beforeEach(() => {
            process.env[INPUT_PROJECT_PATH] = "test-resources/single-module/pom.xml";
        });

        it("should execute single phase", async () => {
            process.env[INPUT_PHASES] = "clean";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute multiple phases", async () => {
            process.env[INPUT_PHASES] = "clean install";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute single goal", async () => {
            process.env[INPUT_GOALS] = "ci:expand-pom";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute multiple goals", async () => {
            process.env[INPUT_GOALS] = "ci:expand-pom ci:replace-content";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use revision ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_REVISION] = "22.22.22";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use sha1 ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SHA1] = "-78125784";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use sha1 ci-friendly property when empty", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SHA1] = "";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use changelist ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_CHANGELIST] = ".Release";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use changelist ci-friendly property when empty", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_CHANGELIST] = "";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should activate single profile", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "ci";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should activate multiple profiles", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "ci cd";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use settings file", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SETTINGS_PATH] = "test-resources/settings.xml";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use toolchains file", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "tools";
            process.env[INPUT_TOOLCHAINS_PATH] = "test-resources/toolchains.xml";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use thread count", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_THREADS] = "1";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute with all inputs specified", async () => {
            process.env[INPUT_REVISION] = "22.22.22";
            process.env[INPUT_SHA1] = "-235782193";
            process.env[INPUT_CHANGELIST] = ".Release";
            process.env[INPUT_PROFILES] = "ci cd tools";
            process.env[INPUT_SETTINGS_PATH] = "test-resources/settings.xml";
            process.env[INPUT_TOOLCHAINS_PATH] = "test-resources/toolchains.xml";
            process.env[INPUT_THREADS] = "1";
            process.env[INPUT_GOALS] = "ci:replace-content";
            process.env[INPUT_PHASES] = "clean install";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });
    });

    describe("multi module project", () => {
        beforeEach(() => {
            process.env[INPUT_PROJECT_PATH] = "test-resources/multi-module/pom.xml";
        });

        it("should execute single phase", async () => {
            process.env[INPUT_PHASES] = "clean";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute multiple phases", async () => {
            process.env[INPUT_PHASES] = "clean install";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute single goal", async () => {
            process.env[INPUT_GOALS] = "ci:expand-pom";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute multiple goals", async () => {
            process.env[INPUT_GOALS] = "ci:expand-pom ci:replace-content";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use revision ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_REVISION] = "22.22.22";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use sha1 ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SHA1] = "-78125784";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use sha1 ci-friendly property when empty", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SHA1] = "";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use changelist ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_CHANGELIST] = ".Release";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use changelist ci-friendly property when empty", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_CHANGELIST] = "";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute single child project", async () => {
            process.env[INPUT_PHASES] = "clean install";
            process.env[INPUT_PROJECTS] = "api";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute multiple child projects", async () => {
            process.env[INPUT_PHASES] = "clean install";
            process.env[INPUT_PROJECTS] = "api ui";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should activate single profile", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "ci";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should activate multiple profiles", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "ci cd";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use settings file", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SETTINGS_PATH] = "test-resources/settings.xml";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use toolchains file", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "tools";
            process.env[INPUT_TOOLCHAINS_PATH] = "test-resources/toolchains.xml";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should use thread count", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_THREADS] = "1";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });

        it("should execute with all inputs specified", async () => {
            process.env[INPUT_REVISION] = "22.22.22";
            process.env[INPUT_SHA1] = "-235782193";
            process.env[INPUT_CHANGELIST] = ".Release";
            process.env[INPUT_PROFILES] = "ci cd tools";
            process.env[INPUT_PROJECTS] = "api ui";
            process.env[INPUT_SETTINGS_PATH] = "test-resources/settings.xml";
            process.env[INPUT_TOOLCHAINS_PATH] = "test-resources/toolchains.xml";
            process.env[INPUT_THREADS] = "1";
            process.env[INPUT_GOALS] = "ci:replace-content";
            process.env[INPUT_PHASES] = "clean install";

            expect(await runAction())
                .toHaveRunCommand("mvn --errors --batch-mode --no-transfer-progress");
        });
    });
});

