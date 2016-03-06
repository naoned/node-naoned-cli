import colors from 'colors'
import alert from './alert'

export default class GitHooks {
    constructor() {
        this.hooks = {}
        this.hooksOrder = [
            'applypatch-msg',
            'pre-applypatch',
            'post-applypatch',
            'pre-commit',
            'prepare-commit-msg',
            'commit-msg',
            'post-commit',
            'pre-rebase',
            'post-checkout',
            'post-merge',
            'pre-push',
            'pre-receive',
            'update',
            'post-receive',
            'post-update',
            'pre-auto-gc',
            'post-rewrite'
        ]
    }

    register (context, hookName, callback) {
        if (this.hooksOrder.indexOf(hookName) === -1) {
            throw new Error('Wrong hook name')
        }
        if (typeof this.hooks[hookName] === 'undefined') {
            this.hooks[hookName] = {}
        }
        if (typeof this.hooks[hookName][context] === 'undefined') {
            this.hooks[hookName][context] = []
            if (this.isHookFiredLast(hookName, context)) {
                this.lastHook = hookName
            }
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
            alert.error()
            process.exit(1)
        } else if (hookName === this.lastHook) {
            alert.success()
        }
    }

    isHookFiredLast (hookName, context) {
        const contextList = global.context.get()

        if (contextList.indexOf(context) !== -1) {
            if (typeof this.lastHook === 'undefined') {
                return true
            } else if (this.hooksOrder.indexOf(this.lastHook) < this.hooksOrder.indexOf(hookName)) {
                return true
            }
        }

        return false
    }
}
