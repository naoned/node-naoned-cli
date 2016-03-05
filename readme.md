### Npm-naoned

Add a `naoned` command line tool to configure your project according to Naoned conventions and stack.
Currently installs a javascript Linter, a git message validator and [Commitizen](https://commitizen.github.io/cz-cli/) `git cz` for easy git messaging.

#### Installation
You must first install **[node & npm](https://github.com/nodesource/distributions)** then :
```
npm install npm-naoned -g
```

#### Usage
Inside the root folder of your project type :
```
naoned init
```
By default `naoned init` configures the javascript linter to be ES6. If you are using ES5 use :
```
naoned init --es5
```
You must have a `package.json` available for `naoned init` to run.

#### Tools
`naoned init` installs [Commitizen](https://commitizen.github.io/cz-cli/)
- **`git cz`**: Start a command line prompt to write messages conforming to our conventions
