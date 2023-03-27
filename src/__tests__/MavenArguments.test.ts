import {beforeEach, describe, expect, it} from "@jest/globals";
import MavenArguments from "../MavenArguments";

describe("The MavenArguments component", () => {
    let args: MavenArguments;

    beforeEach(() => {
        args = new MavenArguments();
    });

    describe("toggles", () => {
        describe("generic", () => {
            it("should include toggle implicitly", async () => {
                args.withToggle("name");

                expect(args.getToggles())
                    .toEqual(new Set(["name"]));
            });

            it("should include toggle when enabled", async () => {
                args.withToggle("name", true);

                expect(args.getToggles())
                    .toEqual(new Set(["name"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withToggle("name", false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });

        describe("batch mode", () => {
            it("should include toggle implicitly", async () => {
                args.withBatchMode();

                expect(args.getToggles())
                    .toEqual(new Set(["--batch-mode"]));
            });

            it("should include toggle when enabled", async () => {
                args.withBatchMode(true);

                expect(args.getToggles())
                    .toEqual(new Set(["--batch-mode"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withBatchMode(false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });

        describe("errors", () => {
            it("should include toggle implicitly", async () => {
                args.withErrors();

                expect(args.getToggles())
                    .toEqual(new Set(["--errors"]));
            });

            it("should include toggle when enabled", async () => {
                args.withErrors(true);

                expect(args.getToggles())
                    .toEqual(new Set(["--errors"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withErrors(false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });

        describe("no transfer progress", () => {
            it("should include toggle implicitly", async () => {
                args.withNoTransferProgress();

                expect(args.getToggles())
                    .toEqual(new Set(["--no-transfer-progress"]));
            });

            it("should include toggle when enabled", async () => {
                args.withNoTransferProgress(true);

                expect(args.getToggles())
                    .toEqual(new Set(["--no-transfer-progress"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withNoTransferProgress(false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });

        describe("also make", () => {
            it("should include toggle implicitly", async () => {
                args.withAlsoMake();

                expect(args.getToggles())
                    .toEqual(new Set(["--also-make"]));
            });

            it("should include toggle when enabled", async () => {
                args.withAlsoMake(true);

                expect(args.getToggles())
                    .toEqual(new Set(["--also-make"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withAlsoMake(false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });

        describe("also make dependents", () => {
            it("should include toggle implicitly", async () => {
                args.withAlsoMakeDependents();

                expect(args.getToggles())
                    .toEqual(new Set(["--also-make-dependents"]));
            });

            it("should include toggle when enabled", async () => {
                args.withAlsoMakeDependents(true);

                expect(args.getToggles())
                    .toEqual(new Set(["--also-make-dependents"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withAlsoMakeDependents(false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });

        describe("fail at end", () => {
            it("should include toggle implicitly", async () => {
                args.withFailAtEnd();

                expect(args.getToggles())
                    .toEqual(new Set(["--fail-at-end"]));
            });

            it("should include toggle when enabled", async () => {
                args.withFailAtEnd(true);

                expect(args.getToggles())
                    .toEqual(new Set(["--fail-at-end"]));
            });

            it("should include toggle when disabled", async () => {
                args.withFailAtEnd(false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });

        describe("fail fast", () => {
            it("should include toggle implicitly", async () => {
                args.withFailFast();

                expect(args.getToggles())
                    .toEqual(new Set(["--fail-fast"]));
            });

            it("should include toggle when enabled", async () => {
                args.withFailFast(true);

                expect(args.getToggles())
                    .toEqual(new Set(["--fail-fast"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withFailFast(false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });

        describe("fail never", () => {
            it("should include toggle implicitly", async () => {
                args.withFailNever();

                expect(args.getToggles())
                    .toEqual(new Set(["--fail-never"]));
            });

            it("should include toggle when enabled", async () => {
                args.withFailNever(true);

                expect(args.getToggles())
                    .toEqual(new Set(["--fail-never"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withFailNever(false);

                expect(args.getToggles())
                    .toEqual(new Set());
            });
        });
    });

    describe("options", () => {
        describe("generic", () => {
            it("should add option", async () => {
                args.withOption("option");

                expect(args.getOptions())
                    .toEqual(["option"]);
            });
        });

        describe("file", () => {
            it("should ignore option when value is empty", async () => {
                args.withPomFile("");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should apply option when value is present", async () => {
                args.withPomFile("path/to/pom.xml");

                expect(args.getOptions())
                    .toEqual(["-f=path/to/pom.xml"]);
            });
        });

        describe("profiles", () => {
            it("should ignore option when value is empty", async () => {
                args.withProfiles("");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should support a single value", async () => {
                args.withProfiles(" ci ");

                expect(args.getOptions())
                    .toEqual(["-P=ci"]);
            });

            it("should support multiple values", async () => {
                args.withProfiles(" ci    release ");

                expect(args.getOptions())
                    .toEqual([
                        "-P=ci",
                        "-P=release"
                    ]);
            });

            it("should support CSV", async () => {
                args.withProfiles(" ci,    release");

                expect(args.getOptions())
                    .toEqual([
                        "-P=ci",
                        "-P=release"
                    ]);
            });
        });

        describe("projects", () => {
            it("should ignore option when empty", async () => {
                args.withProjects("");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should support a single value", async () => {
                args.withProjects(" api ");

                expect(args.getOptions())
                    .toEqual(["-pl=api"]);
            });

            it("should support multiple values", async () => {
                args.withProjects(" api    ui ");

                expect(args.getOptions())
                    .toEqual([
                        "-pl=api",
                        "-pl=ui"
                    ]);
            });

            it("should support CSV", async () => {
                args.withProjects(" api,    ui");

                expect(args.getOptions())
                    .toEqual([
                        "-pl=api",
                        "-pl=ui"
                    ]);
            });
        });

        describe("settings", () => {
            it("should ignore option when empty", async () => {
                args.withSettingsFile("");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should apply option when value is present", async () => {
                args.withSettingsFile("path/to/settings.xml");

                expect(args.getOptions())
                    .toEqual(["-s=path/to/settings.xml"]);
            });
        });

        describe("toolchains", () => {
            it("should ignore option when empty", async () => {
                args.withToolchainsFile("");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should apply option when value is present", async () => {
                args.withToolchainsFile("path/to/toolchains.xml");

                expect(args.getOptions())
                    .toEqual(["-t=path/to/toolchains.xml"]);
            });
        });

        describe("threads", () => {
            it("should ignore option when empty", async () => {
                args.withThreads("");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should apply option when value is present", async () => {
                args.withThreads("5");

                expect(args.getOptions())
                    .toEqual(["-T=5"]);
            });
        });

    });

    describe("system properties", () => {
        describe("generic", () => {
            it("should add system property with no value", async () => {
                args.withSystemProperty("property");

                expect(args.getOptions())
                    .toEqual(["-Dproperty"]);
            });

            it("should add system property with value", async () => {
                args.withSystemProperty("property", "value");

                expect(args.getOptions())
                    .toEqual(["-Dproperty=value"]);
            });

            it("should parse single line input containing one property with no value", async () => {
                args.withSystemProperties(["property"]);

                expect(args.getOptions())
                    .toEqual(["-Dproperty"]);
            });

            it("should parse single line input containing one property with value", async () => {
                args.withSystemProperties(["property=value"]);

                expect(args.getOptions())
                    .toEqual(["-Dproperty=value"]);
            });

            it("should parse single line input containing multiple properties", async () => {
                args.withSystemProperties(["property-1=value-1, property-2"]);

                expect(args.getOptions())
                    .toEqual([
                        "-Dproperty-1=value-1",
                        "-Dproperty-2"
                    ]);
            });

            it("should parse multi line input containing multiple properties", async () => {
                args.withSystemProperties([
                    "property-1=value-1, property-2",
                    "property-3, property-4=value-4"
                ]);

                expect(args.getOptions())
                    .toEqual([
                        "-Dproperty-1=value-1",
                        "-Dproperty-2",
                        "-Dproperty-3",
                        "-Dproperty-4=value-4"
                    ]);
            });
        });

        describe("revision", () => {
            it("should not specify option when undefined", async () => {
                args.withRevisionProperty(undefined);

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should not specify option when value equals undefined", async () => {
                args.withRevisionProperty("undefined");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should specify option when value is empty", async () => {
                args.withRevisionProperty("");

                expect(args.getOptions())
                    .toEqual(["-Drevision="]);
            });

            it("should specify option when value is present", async () => {
                args.withRevisionProperty("2.2.2");

                expect(args.getOptions())
                    .toEqual(["-Drevision=2.2.2"]);
            });
        });

        describe("sha1", () => {
            it("should not specify option when undefined", async () => {
                args.withSha1Property(undefined);

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should not specify option when value equals undefined", async () => {
                args.withSha1Property("undefined");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should specify option when value is empty", async () => {
                args.withSha1Property("");

                expect(args.getOptions())
                    .toEqual(["-Dsha1="]);
            });

            it("should specify option when value is present", async () => {
                args.withSha1Property("-12345");

                expect(args.getOptions())
                    .toEqual(["-Dsha1=-12345"]);
            });
        });

        describe("changelist", () => {
            it("should not specify option when undefined", async () => {
                args.withChangelistProperty(undefined);

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should not specify option when value equals undefined", async () => {
                args.withChangelistProperty("undefined");

                expect(args.getOptions())
                    .toEqual([]);
            });

            it("should specify option when value is empty", async () => {
                args.withChangelistProperty("");

                expect(args.getOptions())
                    .toEqual(["-Dchangelist="]);
            });

            it("should specify option when value is present", async () => {
                args.withChangelistProperty("-SNAPSHOT");

                expect(args.getOptions())
                    .toEqual(["-Dchangelist=-SNAPSHOT"]);
            });
        });
    });

    describe("goals", () => {
        it("should support single value", async () => {
            args.withGoals(" ci:expand-pom ");

            expect(args.getGoals())
                .toEqual(["ci:expand-pom"]);
        });

        it("should support multiples values", async () => {
            args.withGoals(" ci:expand-pom    ci:replace-content ");

            expect(args.getGoals())
                .toEqual([
                    "ci:expand-pom",
                    "ci:replace-content"
                ]);
        });

        it("should support CSV", async () => {
            args.withGoals(" ci:expand-pom,   ci:replace-content ");

            expect(args.getGoals())
                .toEqual([
                    "ci:expand-pom",
                    "ci:replace-content"
                ]);
        });
    });

    describe("phases", () => {
        it("should support single value", async () => {
            args.withPhases(" install ");

            expect(args.getPhases())
                .toEqual(["install"]);
        });

        it("should support multiples values", async () => {
            args.withPhases(" clean    install ");

            expect(args.getPhases())
                .toEqual(["clean", "install"]);
        });

        it("should support CSV", async () => {
            args.withPhases(" clean,  install ");

            expect(args.getPhases())
                .toEqual(["clean", "install"]);
        });
    });

    describe("arguments", () => {
        it("should raise error when goals and phases are not specified", async () => {
            expect(() => args.toArray())
                .toThrowError("Maven goal(s) and/or phase(s) to execute must be specified");
        });

        it("should produce arguments in correct order when specified out of order", async () => {
            args.withProfiles("ci")
                .withRevisionProperty("2.2.2")
                .withPhases("clean install")
                .withGoals("ci:expand-pom ci:replace-content")
                .withBatchMode()
                .withSha1Property("-397868")
                .withErrors()
                .withNoTransferProgress()
                .withChangelistProperty("-SNAPSHOT")
                .withProjects("api")
                .withSettingsFile("path/to/settings.xml")
                .withPomFile("path/to/pom.xml")
                .withToolchainsFile("path/to/toolchains.xml")
                .withThreads("5");

            expect(args.toArray())
                .toEqual([
                    "--batch-mode",
                    "--errors",
                    "--no-transfer-progress",
                    "-P=ci",
                    "-Drevision=2.2.2",
                    "-Dsha1=-397868",
                    "-Dchangelist=-SNAPSHOT",
                    "-pl=api",
                    "-s=path/to/settings.xml",
                    "-f=path/to/pom.xml",
                    "-t=path/to/toolchains.xml",
                    "-T=5",
                    "ci:expand-pom",
                    "ci:replace-content",
                    "clean",
                    "install"
                ]);
        });
    });
});
