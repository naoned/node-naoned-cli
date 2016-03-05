import init from './command/init'
import npmInit from './command/npmInit'

export function cli(args) {
    switch (args[0]) {
    case 'init':
        init()
        break
    case 'npm-init':
        npmInit()
        break
    default:
        console.log(`No command ${args[0]}`)
    }
}
