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

## Minimal Configuration

At a minimum, at least one `goal` or `phase` must be provided:

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  goals: tools.bestquality:ci-maven-plugin:0.0.20:expand-pom
```

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  phases: install
```
## Activating Profiles

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  profiles: ci
  phases: install
```

## CI-friendly Properties

Typically, the `pom.xml` file should define the CI-friendly properties in the project's
`<properties/>` block so consistent values are retained when building locally. When run as
part of a workflow, they can be overridden as needed.

### Release Build

Example when triggering a deployment from a GitHub release where the tag contains the revision:

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  revision: ${{github.ref_name}}
  changelist: ""
  goals: tools.bestquality:ci-maven-plugin:0.0.20:expand-pom
  phases: clean, deploy
```

### Snapshot Build

Example when triggering a workflow from a commit to a feature branch:

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  sha1: -${{github.run_id}}
  goals: tools.bestquality:ci-maven-plugin:0.0.20:expand-pom
  phases: clean, install
```

## Custom Files

The various configuration file locations can be customized:

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  settings-file: path/to/settings.xml
  toolchains-file: path/to/toolchains.xml
  pom-file: path/to/pom.xml
  sha1: -${{github.run_id}}
  changelist: -SNAPSHOT
  phases: clean, install
```

## Defining System Properties

### Multiline

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  system-properties: |
    property=value
    flag
  phases: clean, install
```

### Inline

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  system-properties: property=value, flag
  phases: clean, install
```

## Customizing `MAVEN_OPTS`

Specifying the `maven-opts` option will cause the supplied value to override an existing
`MAVEN_OPTS` environment variable only for the duration of the command execution:

```yaml
uses: Best-Quality-Engineering/ci-maven-action@v1
with:
  maven-opts: -Xms256m -Xmx512m
  phases: clean, install
```

## All Supported Options

See the [action metadata](https://github.com/Best-Quality-Engineering/ci-maven-action/blob/main/action.yml#L6)
for the complete list of supported options.