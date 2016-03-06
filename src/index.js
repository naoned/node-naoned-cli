// import init from './commands/init'
// import npmInit from './commands/npmInit'
// import hook from './commands/hook'

import InitCommand from './commands/InitCommand'
import NpmInitCommand from './commands/NpmInitCommand'
import HookCommand from './commands/HookCommand'

import NpmConfig from './utils/NpmConfig'
import Context from './utils/Context'
import Git from './utils/Git'
import Cli from './utils/Cli'

import gitConvention from './components/gitConvention'
import jsConvention from './components/jsConvention'

export function bootstrap(args) {
    global.npmConfig = new NpmConfig(`${process.cwd()}/package.json`)
    global.git = new Git(`${process.cwd()}/.git`)
    global.context = new Context()
    global.cli = new Cli()

    global.git.hooks.register([
        gitConvention,
        jsConvention
    ])

    global.cli.register([
        InitCommand,
        NpmInitCommand,
        HookCommand
    ])

    global.cli.start(args)
}
