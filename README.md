# opentutor-web-client

react/gatsby web client for opentutor

## Usage

A docker image that serves a web client for grading opentutor sessions .

## Variables

In order to function properly the client generally requires these environment variables defined:

- DIALOG_ENDPOINT

## Development

To just run the gatsby client in locally do:

```
make develop
```

Any changes made to this repo should be covered by tests. To run the existing tests:

```
make test
```

All pushed commits must also pass format and lint checks. To check all required tests before a commit:

```
make test-all
```

To fix formatting issues:

```
make format
```

#### Cypress Testing

To run cypress tests locally you need two shells, first make sure the client is running locally:

```
cd client && make develop
```

...then you can run the full cypress test suite with

```
cd client && make test-cypress
```

```
cd client && npm run cy:open
```

...then in the cypress browser window, click a spec to run it.

## Releases

Currently, this image is semantically versioned. When making changes that you want to test in another project, create a branch and PR and then you can release a test tag one of two ways:

To build/push a work-in-progress tag of `opentutor-web-client` for the current commit in your branch

- find the `docker_tag_commit` workflow for your commit in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/opentutor-web-client)
- approve the workflow
- this will create a tag like `https://hub.docker.com/opentutor-web-client:${COMMIT_SHA}`

To build/push a pre-release semver tag of `opentutor-web-client` for the current commit in your branch

- create a [github release](https://github.com/ICTLearningSciences/opentutor-web-client/releases/new) **from your development branch** with tag format `/^\d+\.\d+\.\d+(-[a-z\d\-.]+)?$/` (e.g. `1.0.0-alpha.1`)
- find the `docker_tag_release` workflow for your git tag in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/opentutor-web-client)
- approve the workflow
- this will create a tag like `uscictdocker/opentutor-web-client:1.0.0-alpha.1`

Once your changes are approved and merged to master, you should create a release tag in semver format as follows:

- create a [github release](https://github.com/ICTLearningSciences/opentutor-web-client/releases/new) **from master** with tag format `/^\d+\.\d+\.\d$/` (e.g. `1.0.0`)
- find the `docker_tag_release` workflow for your git tag in [circleci](https://circleci.com/gh/ICTLearningSciences/workflows/opentutor-web-client)
- approve the workflow
- this will create a tag like `uscictdocker/opentutor-web-client:1.0.0`
