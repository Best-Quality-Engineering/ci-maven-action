const MavenArguments = require("./MavenArguments");

describe("The MavenArguments component", () => {
    let args;

    beforeEach(() => {
        args = new MavenArguments();
    });

    describe("toggles", () => {
        describe("generic", () => {
            it("should include toggle implicitly", async () => {
                args.withToggle("name");

                expect(args.toggles)
                    .toEqual(new Set(["name"]));
            });

            it("should include toggle when enabled", async () => {
                args.withToggle("name", true);

                expect(args.toggles)
                    .toEqual(new Set(["name"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withToggle("name", false);

                expect(args.toggles)
                    .toEqual(new Set());
            });
        });

        describe("batch mode", () => {
            it("should include toggle implicitly", async () => {
                args.withBatchMode();

                expect(args.toggles)
                    .toEqual(new Set(["--batch-mode"]));
            });

            it("should include toggle when enabled", async () => {
                args.withBatchMode(true);

                expect(args.toggles)
                    .toEqual(new Set(["--batch-mode"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withBatchMode(false);

                expect(args.toggles)
                    .toEqual(new Set());
            });
        });

        describe("errors", () => {
            it("should include toggle implicitly", async () => {
                args.withErrors();

                expect(args.toggles)
                    .toEqual(new Set(["--errors"]));
            });

            it("should include toggle when enabled", async () => {
                args.withErrors(true);

                expect(args.toggles)
                    .toEqual(new Set(["--errors"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withErrors(false);

                expect(args.toggles)
                    .toEqual(new Set());
            });
        });

        describe("no transfer progress", () => {
            it("should include toggle implicitly", async () => {
                args.withNoTransferProgress();

                expect(args.toggles)
                    .toEqual(new Set(["--no-transfer-progress"]));
            });

            it("should include toggle when enabled", async () => {
                args.withNoTransferProgress(true);

                expect(args.toggles)
                    .toEqual(new Set(["--no-transfer-progress"]));
            });

            it("should not include toggle when disabled", async () => {
                args.withNoTransferProgress(false);

                expect(args.toggles)
                    .toEqual(new Set());
            });
        });
    });

    describe("options", () => {
        describe("generic", () => {
            it("should add option", async () => {
                args.withOption("option");

                expect(args.options)
                    .toEqual(["option"]);
            });
        });

        describe("revision ci property", () => {
            it("should not specify option when undefined", async () => {
                args.withRevisionProperty();

                expect(args.options)
                    .toEqual([]);
            });

            it("should not specify option when value equals undefined", async () => {
                args.withRevisionProperty("undefined");

                expect(args.options)
                    .toEqual([]);
            });

            it("should specify option when value is empty", async () => {
                args.withRevisionProperty("");

                expect(args.options)
                    .toEqual(["-Drevision="]);
            });

            it("should specify option when value is present", async () => {
                args.withRevisionProperty("2.2.2");

                expect(args.options)
                    .toEqual(["-Drevision=2.2.2"]);
            });
        });

        describe("sha1 ci property", () => {
            it("should not specify option when undefined", async () => {
                args.withSha1Property();

                expect(args.options)
                    .toEqual([]);
            });

            it("should not specify option when value equals undefined", async () => {
                args.withSha1Property("undefined");

                expect(args.options)
                    .toEqual([]);
            });

            it("should specify option when value is empty", async () => {
                args.withSha1Property("");

                expect(args.options)
                    .toEqual(["-Dsha1="]);
            });

            it("should specify option when value is present", async () => {
                args.withSha1Property("-12345");

                expect(args.options)
                    .toEqual(["-Dsha1=-12345"]);
            });
        });

        describe("changelist ci property", () => {
            it("should not specify option when undefined", async () => {
                args.withChangelistProperty();

                expect(args.options)
                    .toEqual([]);
            });

            it("should not specify option when value equals undefined", async () => {
                args.withChangelistProperty("undefined");

                expect(args.options)
                    .toEqual([]);
            });

            it("should specify option when value is empty", async () => {
                args.withChangelistProperty("");

                expect(args.options)
                    .toEqual(["-Dchangelist="]);
            });

            it("should specify option when value is present", async () => {
                args.withChangelistProperty("-SNAPSHOT");

                expect(args.options)
                    .toEqual(["-Dchangelist=-SNAPSHOT"]);
            });
        });

        describe("file", () => {
            it("should ignore option when value is empty", async () => {
                args.withPomFile("");

                expect(args.options)
                    .toEqual([]);
            });

            it("should apply option when value is present", async () => {
                args.withPomFile("path/to/pom.xml");

                expect(args.options)
                    .toEqual(["-f=path/to/pom.xml"]);
            });
        });

        describe("profiles", () => {
            it("should ignore option when value is empty", async () => {
                args.withProfiles("");

                expect(args.options)
                    .toEqual([]);
            });

            it("should support a single value", async () => {
                args.withProfiles(" ci ");

                expect(args.options)
                    .toEqual(["-P=ci"]);
            });

            it("should support multiple values", async () => {
                args.withProfiles(" ci    release ");

                expect(args.options)
                    .toEqual([
                        "-P=ci",
                        "-P=release"
                    ]);
            });

            it("should support CSV", async () => {
                args.withProfiles(" ci,    release");

                expect(args.options)
                    .toEqual([
                        "-P=ci",
                        "-P=release"
                    ]);
            });
        });

        describe("projects", () => {
            it("should ignore option when empty", async () => {
                args.withProjects("");

                expect(args.options)
                    .toEqual([]);
            });

            it("should support a single value", async () => {
                args.withProjects(" api ");

                expect(args.options)
                    .toEqual(["-pl=api"]);
            });

            it("should support multiple values", async () => {
                args.withProjects(" api    ui ");

                expect(args.options)
                    .toEqual([
                        "-pl=api",
                        "-pl=ui"
                    ]);
            });

            it("should support CSV", async () => {
                args.withProjects(" api,    ui");

                expect(args.options)
                    .toEqual([
                        "-pl=api",
                        "-pl=ui"
                    ]);
            });
        });

        describe("settings", () => {
            it("should ignore option when empty", async () => {
                args.withSettingsFile("");

                expect(args.options)
                    .toEqual([]);
            });

            it("should apply option when value is present", async () => {
                args.withSettingsFile("path/to/settings.xml");

                expect(args.options)
                    .toEqual(["-s=path/to/settings.xml"]);
            });
        });

        describe("toolchains", () => {
            it("should ignore option when empty", async () => {
                args.withToolchainsFile("");

                expect(args.options)
                    .toEqual([]);
            });

            it("should apply option when value is present", async () => {
                args.withToolchainsFile("path/to/toolchains.xml");

                expect(args.options)
                    .toEqual(["-t=path/to/toolchains.xml"]);
            });
        });

        describe("threads", () => {
            it("should ignore option when empty", async () => {
                args.withThreads("");

                expect(args.options)
                    .toEqual([]);
            });

            it("should apply option when value is present", async () => {
                args.withThreads("5");

                expect(args.options)
                    .toEqual(["-T=5"]);
            });
        });

    });

    describe("goals", () => {
        it("should support single value", async () => {
            args.withGoals(" ci:expand-pom ");

            expect(args.goals)
                .toEqual(["ci:expand-pom"]);
        });

        it("should support multiples values", async () => {
            args.withGoals(" ci:expand-pom    ci:replace-content ");

            expect(args.goals)
                .toEqual([
                    "ci:expand-pom",
                    "ci:replace-content"
                ]);
        });

        it("should support CSV", async () => {
            args.withGoals(" ci:expand-pom,   ci:replace-content ");

            expect(args.goals)
                .toEqual([
                    "ci:expand-pom",
                    "ci:replace-content"
                ]);
        });
    });

    describe("phases", () => {
        it("should support single value", async () => {
            args.withPhases(" install ");

            expect(args.phases)
                .toEqual(["install"]);
        });

        it("should support multiples values", async () => {
            args.withPhases(" clean    install ");

            expect(args.phases)
                .toEqual(["clean", "install"]);
        });

        it("should support CSV", async () => {
            args.withPhases(" clean,  install ");

            expect(args.phases)
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
})