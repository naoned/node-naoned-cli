import init from './commands/init'
import npmInit from './commands/npmInit'
import hook from './commands/hook'

import NpmConfig from './utils/NpmConfig'
import Context from './utils/Context'
import Git from './utils/Git'

export function bootstrap(args) {
    global.npmConfig = new NpmConfig(`${process.cwd()}/package.json`)
    global.git = new Git(`${process.cwd()}/.git`)
    global.context = new Context()
    global.args = args

    require('./components/gitConvention')

    cli()
}

export function cli() {
    switch (global.args[0]) {
    case 'init':
        init()
        break
    case 'npm-init':
        npmInit()
        break
    case 'hook':
        hook(global.args[1])
        break
    default:
        console.log(`No command ${global.args[0]}`)
    }
}
