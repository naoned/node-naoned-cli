import sh from 'shelljs'

export class jsConvention {
    install (dependencies) {
        dependencies.cmd('npm i --save-dev eslint-config-naoned eslint')
    }

    registerHooks (gitHooks) {
        gitHooks.add('javascript', 'pre-commit', this)
    }

    preCommit(errors) {
        const filesToCheck = global.git.getStagedFiles(/\.js$/)
        if (!filesToCheck.length) {
            return errors
        }
        if (sh.exec(`node_modules/eslint/bin/eslint.js --color --no-ignore ${filesToCheck.join(' ')}`).code > 0) {
            errors.push({
                type: 'javascript',
                message: 'There are some errors in your js, fix them and try again.'
            })
        }
        global.git.clearTempStaging()
        return errors
    }
}

export default new jsConvention()
