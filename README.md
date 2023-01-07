# CI Maven GitHub Action

[![Build Status](https://github.com/Best-Quality-Engineering/ci-maven-action/actions/workflows/tests.yml/badge.svg)](https://github.com/Best-Quality-Engineering/ci-maven-action/actions/workflows/tests.yml)
[![Distribution Status](https://github.com/Best-Quality-Engineering/ci-maven-action/actions/workflows/verify-distribution.yml/badge.svg)](https://github.com/Best-Quality-Engineering/ci-maven-action/actions/workflows/verify-distribution.yml)

A GitHub action for use in workflows supporting patterns described in the
[Maven CI Friendly documentation](https://maven.apache.org/maven-ci-friendly.html).

:rocket: Perfect companion to the [CI Maven Plugin](https://github.com/Best-Quality-Engineering/ci-maven-plugin) :rocket:


## Package for Distribution

GitHub Actions will run the entry point from the action.yml. Packaging assembles the code into one file that can be
checked in to Git, enabling fast and reliable execution and preventing the need to check in node_modules.

Actions are run from GitHub repos. Packaging the action will create a packaged action in the dist folder.

Run prepare

```bash
npm run prepare
```

Since the packaged index.js is run from the dist folder.

```bash
git add dist
```

## Versioning

See the [versioning documentation](https://github.com/actions/toolkit/blob/master/docs/action-versioning.md)

## Usage

You can now consume the action by referencing the v1 branch

```yaml
uses: actions/ci-maven@v1
with:
  phases: clean, install
```