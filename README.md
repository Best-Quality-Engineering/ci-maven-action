# CI Maven GitHub Action

[![Build Status](https://github.com/Best-Quality-Engineering/ci-maven-action/actions/workflows/tests.yml/badge.svg)](https://github.com/Best-Quality-Engineering/ci-maven-action/actions/workflows/tests.yml)
[![Distribution Status](https://github.com/Best-Quality-Engineering/ci-maven-action/actions/workflows/verify-distribution.yml/badge.svg)](https://github.com/Best-Quality-Engineering/ci-maven-action/actions/workflows/verify-distribution.yml)

A GitHub action for use in workflows supporting patterns described in the
[Maven CI Friendly documentation](https://maven.apache.org/maven-ci-friendly.html).

:rocket:
Perfect companion to the [CI Maven Plugin](https://github.com/Best-Quality-Engineering/ci-maven-plugin)
:rocket:

## Usage

This action does not setup or prepare the Maven runtime; it assumes a previous action has
setup and configured the environment. The [`@actions/setup-java`](https://github.com/actions/setup-java)
can be used for that purpose.

## Minimal

At a minimum, a `goal` or `phase` must be provided:

```yaml
uses: actions/ci-maven@v1
with:
  goals: tools.bestquality:ci-maven-plugin:0.0.20:expand-pom
```

```yaml
uses: actions/ci-maven@v1
with:
  phases: clean, install
```

## Specifying CI-friendly properties

```yaml
uses: actions/ci-maven@v1
with:
  revision: 2.22.2
  sha1: -${{github.run_id}}
  changelist: -SNAPSHOT
  goals: tools.bestquality:ci-maven-plugin:0.0.20:expand-pom
  phases: clean, install
```

## Running with custom files

```yaml
uses: actions/ci-maven@v1
with:
  settings-file: path/to/settings.xml
  toolchains-file: path/to/toolchains.xml
  pom-file: path/to/pom.xml
  sha1: -${{github.run_id}}
  changelist: -SNAPSHOT
  phases: clean, install
```

## Defining System Properties

Multiline support:

```yaml
uses: actions/ci-maven@v1
with:
  system-properties: |
    property=value
    flag
  phases: clean, install
```

or using a single line:

```yaml
uses: actions/ci-maven@v1
with:
  system-properties: property=value, flag
  phases: clean, install
```

## Specifying `MAVEN_OPTS`

Specifying the `maven-opts` option will cause the supplied value to override an existing
`MAVEN_OPTS` environment variable for the duration of the command execution.

```yaml
uses: actions/ci-maven@v1
with:
  maven-opts: -Xms256m -Xmx512m
  phases: clean, install
```

## All Supported Options

See the [action metadata](https://github.com/Best-Quality-Engineering/ci-maven-action/blob/main/action.yml#L6)
for the complete list of supported options.