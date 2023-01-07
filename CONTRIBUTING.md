# CI Maven GitHub Action

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
