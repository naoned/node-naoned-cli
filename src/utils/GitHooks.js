import colors from 'colors'

export default class GitHooks {
    constructor() {
        this.hooks = {
            'applypatch-msg': {},
            'pre-applypatch': {},
            'post-applypatch': {},
            'pre-commit': {},
            'prepare-commit-msg': {},
            'commit-msg': {},
            'post-commit': {},
            'pre-rebase': {},
            'post-checkout': {},
            'post-merge': {},
            'pre-push': {},
            'pre-receive': {},
            update: {},
            'post-receive': {},
            'post-update': {},
            'pre-auto-gc': {},
            'post-rewrite': {}
        }
    }

    register (context, hookName, callback) {
        if (typeof this.hooks[hookName] === 'undefined') {
            throw new Error('Wrong hook name')
        }
        if (typeof this.hooks[hookName][context] === 'undefined') {
            this.hooks[hookName][context] = []
        }
        this.hooks[hookName][context].push(callback)
    }

    run (hookName, contextList) {
        let errors = []
        contextList.forEach((context) => {
            if (typeof this.hooks[hookName][context] !== 'undefined') {
                this.hooks[hookName][context].forEach((callback) => {
                    callback(errors)
                })
            }
        })

        if (errors.length) {
            errors.forEach((error) => {
                console.error(colors.white.bgRed(`${error.type}: ${error.message}`))
            })
            process.exit(1)
        }
    }
}
