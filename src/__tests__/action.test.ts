import {afterEach, beforeEach, describe, expect, it, jest} from "@jest/globals";
import action from "../action";
import Command from "./Command";
import DebugExecutionListener from "./DebugExecutionListener";
import "./action-expectations";


const INPUT_MAVEN_OPTS = "INPUT_MAVEN-OPTS";

const INPUT_ERRORS = "INPUT_ERRORS";
const INPUT_BATCH_MODE = "INPUT_BATCH-MODE";
const INPUT_NO_TRANSFER_PROGRESS = "INPUT_NO-TRANSFER-PROGRESS";
const INPUT_ALSO_MAKE = "INPUT_ALSO-MAKE";
const INPUT_ALSO_MAKE_DEPENDENTS = "INPUT_ALSO-MAKE-DEPENDENTS";
const INPUT_FAIL_AT_END = "INPUT_FAIL-AT-END";
const INPUT_FAIL_FAST = "INPUT_FAIL-FAST";
const INPUT_FAIL_NEVER = "INPUT_FAIL-NEVER";

const INPUT_SETTINGS_FILE = "INPUT_SETTINGS-FILE";
const INPUT_TOOLCHAINS_FILE = "INPUT_TOOLCHAINS-FILE";
const INPUT_POM_FILE = "INPUT_POM-FILE";
const INPUT_PROFILES = "INPUT_PROFILES";
const INPUT_PROJECTS = "INPUT_PROJECTS";
const INPUT_THREADS = "INPUT_THREADS";

const INPUT_SYSTEM_PROPERTIES = "INPUT_SYSTEM-PROPERTIES";
const INPUT_REVISION = "INPUT_REVISION";
const INPUT_SHA1 = "INPUT_SHA1";
const INPUT_CHANGELIST = "INPUT_CHANGELIST";

const INPUT_GOALS = "INPUT_GOALS";
const INPUT_PHASES = "INPUT_PHASES";

jest.setTimeout(30000);

describe("The action function", () => {

    async function runAction(): Promise<Command> {
        const listener = new DebugExecutionListener();
        await action(listener);
        return listener.command;
    }

    beforeEach(() => {
        // Setup inputs with default values
        process.env[INPUT_ERRORS] = "true";
        process.env[INPUT_BATCH_MODE] = "true";
        process.env[INPUT_NO_TRANSFER_PROGRESS] = "true";
        process.env[INPUT_ALSO_MAKE] = "false";
        process.env[INPUT_ALSO_MAKE_DEPENDENTS] = "false";
        process.env[INPUT_FAIL_AT_END] = "false";
        process.env[INPUT_FAIL_FAST] = "false";
        process.env[INPUT_FAIL_NEVER] = "false";

        process.env[INPUT_REVISION] = "undefined";
        process.env[INPUT_SHA1] = "undefined";
        process.env[INPUT_CHANGELIST] = "undefined";
    });

    afterEach(() => {
        delete process.env[INPUT_MAVEN_OPTS];

        delete process.env[INPUT_ERRORS];
        delete process.env[INPUT_BATCH_MODE];
        delete process.env[INPUT_NO_TRANSFER_PROGRESS];
        delete process.env[INPUT_ALSO_MAKE];
        delete process.env[INPUT_ALSO_MAKE_DEPENDENTS];
        delete process.env[INPUT_FAIL_AT_END];
        delete process.env[INPUT_FAIL_FAST];
        delete process.env[INPUT_FAIL_NEVER];

        delete process.env[INPUT_SETTINGS_FILE];
        delete process.env[INPUT_TOOLCHAINS_FILE];
        delete process.env[INPUT_POM_FILE];
        delete process.env[INPUT_PROFILES];
        delete process.env[INPUT_PROJECTS];
        delete process.env[INPUT_THREADS];

        delete process.env[INPUT_SYSTEM_PROPERTIES];
        delete process.env[INPUT_REVISION];
        delete process.env[INPUT_SHA1];
        delete process.env[INPUT_CHANGELIST];

        delete process.env[INPUT_GOALS];
        delete process.env[INPUT_PHASES];
    });

    describe("validation", () => {
        it("should fail when no goal or phase is specified", async () => {
            await expect(() => action()).rejects
                .toThrowError("Maven goal(s) and/or phase(s) to execute must be specified");
        });
    });

    describe("maven options", () => {
        beforeEach(() => {
            process.env.MAVEN_OPTS = "-Xms64m -Xmx128m";
            process.env[INPUT_MAVEN_OPTS] = "-Xms256m -Xmx512m";
            process.env[INPUT_POM_FILE] = "test-resources/single-module/pom.xml";
        });

        afterEach(() => {
            delete process.env.MAVEN_OPTS;
        });

        it("should restore original options on success", async () => {
            process.env[INPUT_PHASES] = "install";

            expect(process.env.MAVEN_OPTS)
                .toEqual("-Xms64m -Xmx128m");

            await action();

            expect(process.env.MAVEN_OPTS)
                .toEqual("-Xms64m -Xmx128m");
        });

        it("should restore original options on failure", async () => {
            expect(process.env.MAVEN_OPTS)
                .toEqual("-Xms64m -Xmx128m");

            await expect(() => action()).rejects
                .toThrowError("Maven goal(s) and/or phase(s) to execute must be specified");

            expect(process.env.MAVEN_OPTS)
                .toEqual("-Xms64m -Xmx128m");
        });
    });

    describe("single module project", () => {
        beforeEach(() => {
            process.env[INPUT_POM_FILE] = "test-resources/single-module/pom.xml";
        });

        it("should execute single phase", async () => {
            process.env[INPUT_PHASES] = "clean";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "clean"
                ]);
        });

        it("should execute multiple phases", async () => {
            process.env[INPUT_PHASES] = "clean install";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "clean",
                    "install"
                ]);
        });

        it("should execute single goal", async () => {
            process.env[INPUT_GOALS] = "ci:expand-pom";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "ci:expand-pom"
                ]);
        });

        it("should execute multiple goals", async () => {
            process.env[INPUT_GOALS] = "ci:expand-pom ci:replace-content";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "ci:expand-pom",
                    "ci:replace-content"
                ]);
        });

        it("should use revision ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_REVISION] = "22.22.22";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "-Drevision=22.22.22",
                    "install"
                ]);
        });

        it("should use sha1 ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SHA1] = "-78125784";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "-Dsha1=-78125784",
                    "install"
                ]);
        });

        it("should use sha1 ci-friendly property when empty", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SHA1] = "";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "-Dsha1=",
                    "install"
                ]);
        });

        it("should use changelist ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_CHANGELIST] = ".Release";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "-Dchangelist=.Release",
                    "install"
                ]);
        });

        it("should use changelist ci-friendly property when empty", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_CHANGELIST] = "";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "-Dchangelist=",
                    "install"
                ]);
        });

        it("should activate single profile", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "ci";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "-P=ci",
                    "install"
                ]);
        });

        it("should activate multiple profiles", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "ci cd";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "-P=ci",
                    "-P=cd",
                    "install"
                ]);
        });

        it("should use settings file", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SETTINGS_FILE] = "test-resources/settings.xml";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-s=test-resources/settings.xml",
                    "-f=test-resources/single-module/pom.xml",
                    "install"
                ]);
        });

        it("should use toolchains file", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "tools";
            process.env[INPUT_TOOLCHAINS_FILE] = "test-resources/toolchains.xml";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-t=test-resources/toolchains.xml",
                    "-f=test-resources/single-module/pom.xml",
                    "-P=tools",
                    "install"
                ]);
        });

        it("should use thread count", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_THREADS] = "1";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/single-module/pom.xml",
                    "-T=1",
                    "install"
                ]);
        });

        it("should execute with all inputs specified", async () => {
            process.env[INPUT_MAVEN_OPTS] = "-Xms256m -Xmx512m";
            process.env[INPUT_SYSTEM_PROPERTIES] = "property=value, flag";
            process.env[INPUT_REVISION] = "22.22.22";
            process.env[INPUT_SHA1] = "-235782193";
            process.env[INPUT_CHANGELIST] = ".Release";
            process.env[INPUT_PROFILES] = "ci cd tools";
            process.env[INPUT_SETTINGS_FILE] = "test-resources/settings.xml";
            process.env[INPUT_TOOLCHAINS_FILE] = "test-resources/toolchains.xml";
            process.env[INPUT_THREADS] = "1";
            process.env[INPUT_GOALS] = "ci:replace-content";
            process.env[INPUT_PHASES] = "clean install";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-s=test-resources/settings.xml",
                    "-t=test-resources/toolchains.xml",
                    "-f=test-resources/single-module/pom.xml",
                    "-P=ci",
                    "-P=cd",
                    "-P=tools",
                    "-T=1",
                    "-Dproperty=value",
                    "-Dflag",
                    "-Drevision=22.22.22",
                    "-Dsha1=-235782193",
                    "-Dchangelist=.Release",
                    "ci:replace-content",
                    "clean",
                    "install"
                ]);
        });
    });

    describe("multi module project", () => {
        beforeEach(() => {
            process.env[INPUT_POM_FILE] = "test-resources/multi-module/pom.xml";
        });

        it("should execute single phase", async () => {
            process.env[INPUT_PHASES] = "clean";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "clean"
                ]);
        });

        it("should execute multiple phases", async () => {
            process.env[INPUT_PHASES] = "clean install";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "clean",
                    "install"
                ]);
        });

        it("should execute single goal", async () => {
            process.env[INPUT_GOALS] = "ci:expand-pom";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "ci:expand-pom"
                ]);
        });

        it("should execute multiple goals", async () => {
            process.env[INPUT_GOALS] = "ci:expand-pom ci:replace-content";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "ci:expand-pom",
                    "ci:replace-content"
                ]);
        });

        it("should use revision ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_REVISION] = "22.22.22";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-Drevision=22.22.22",
                    "install"
                ]);
        });

        it("should use sha1 ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SHA1] = "-78125784";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-Dsha1=-78125784",
                    "install"
                ]);
        });

        it("should use sha1 ci-friendly property when empty", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SHA1] = "";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-Dsha1=",
                    "install"
                ]);
        });

        it("should use changelist ci-friendly property", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_CHANGELIST] = ".Release";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-Dchangelist=.Release",
                    "install"
                ]);
        });

        it("should use changelist ci-friendly property when empty", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_CHANGELIST] = "";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-Dchangelist=",
                    "install"
                ]);
        });

        it("should execute single child project", async () => {
            process.env[INPUT_PHASES] = "clean install";
            process.env[INPUT_PROJECTS] = "api";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-pl=api",
                    "clean",
                    "install"
                ]);
        });

        it("should execute multiple child projects", async () => {
            process.env[INPUT_PHASES] = "clean install";
            process.env[INPUT_PROJECTS] = "api ui";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-pl=api",
                    "-pl=ui",
                    "clean",
                    "install"
                ]);
        });

        it("should activate single profile", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "ci";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-P=ci",
                    "install"
                ]);
        });

        it("should activate multiple profiles", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "ci cd";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-P=ci",
                    "-P=cd",
                    "install"
                ]);
        });

        it("should use settings file", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_SETTINGS_FILE] = "test-resources/settings.xml";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-s=test-resources/settings.xml",
                    "-f=test-resources/multi-module/pom.xml",
                    "install"
                ]);
        });

        it("should use toolchains file", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_PROFILES] = "tools";
            process.env[INPUT_TOOLCHAINS_FILE] = "test-resources/toolchains.xml";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-t=test-resources/toolchains.xml",
                    "-f=test-resources/multi-module/pom.xml",
                    "-P=tools",
                    "install"
                ]);
        });

        it("should use thread count", async () => {
            process.env[INPUT_PHASES] = "install";
            process.env[INPUT_THREADS] = "1";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-f=test-resources/multi-module/pom.xml",
                    "-T=1",
                    "install"
                ]);
        });

        it("should execute with all inputs specified", async () => {
            process.env[INPUT_MAVEN_OPTS] = "-Xms256m -Xmx512m";
            process.env[INPUT_SYSTEM_PROPERTIES] = "property=value, flag";
            process.env[INPUT_REVISION] = "22.22.22";
            process.env[INPUT_SHA1] = "-235782193";
            process.env[INPUT_CHANGELIST] = ".Release";
            process.env[INPUT_PROFILES] = "ci cd tools";
            process.env[INPUT_PROJECTS] = "api ui";
            process.env[INPUT_SETTINGS_FILE] = "test-resources/settings.xml";
            process.env[INPUT_TOOLCHAINS_FILE] = "test-resources/toolchains.xml";
            process.env[INPUT_THREADS] = "1";
            process.env[INPUT_GOALS] = "ci:replace-content";
            process.env[INPUT_PHASES] = "clean install";

            expect(await runAction())
                .toHaveArguments([
                    "--errors",
                    "--batch-mode",
                    "--no-transfer-progress",
                    "-s=test-resources/settings.xml",
                    "-t=test-resources/toolchains.xml",
                    "-f=test-resources/multi-module/pom.xml",
                    "-P=ci",
                    "-P=cd",
                    "-P=tools",
                    "-pl=api",
                    "-pl=ui",
                    "-T=1",
                    "-Dproperty=value",
                    "-Dflag",
                    "-Drevision=22.22.22",
                    "-Dsha1=-235782193",
                    "-Dchangelist=.Release",
                    "ci:replace-content",
                    "clean",
                    "install"
                ]);
        });
    });
});
