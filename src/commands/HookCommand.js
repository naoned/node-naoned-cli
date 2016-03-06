import Promise from 'promise'

export default class HookCommand {
    run (args) {
        return new Promise((resolve) => {
            global.git.hooks.run(args[1], global.context.get()).then(() => {
                resolve()
            })
        })
    }
}
