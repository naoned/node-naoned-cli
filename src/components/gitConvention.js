import colors from 'colors'

export default class gitConvention {
    install (dependencies) {
        dependencies.cmd('npm i --save-dev ghooks naoned-cz-conventional-changelog')

        console.log(colors.inverse('Configuring Commitizen...\n'))
        global.npmConfig.update({
            config: {
                ghooks: {
                    'commit-msg': 'naoned hook commit-msg'
                },
                commitizen: {
                    path: './node_modules/naoned-cz-conventional-changelog'
                }
            }
        }, true)
    }

    registerHooks (gitHooks) {
        gitHooks.add('all', 'commit-msg', this)
    }

    commitMsg (errors) {
        const pattern = /^((fixup! |squash! )?(\w+)(?:\(([^\)\s]+)\))?: (.+))(?:\n|$)/
        const types = ['feat', 'fix', 'docs', 'style', 'refact', 'perf', 'test', 'misc', 'revert', 'git']
        const maxLength = 100
        const msg = global.git.getCommitMsg()
        const match = pattern.exec(msg)

        if (!match) {
            errors.push({
                type: 'git',
                message: `"${msg}" does not match "<type>(<scope>): <subject>" !`
            })
        } else {
            const firstLine = match[1]
            const squashing = Boolean(match[2])
            const type = match[3]
            // const scope = match[4]
            // const subject = match[5]

            if (firstLine.length > maxLength && !squashing) {
                errors.push({
                    type: 'git',
                    message: `Your message is longer than ${maxLength} characters !`
                })
            }

            if (types !== '*' && types.indexOf(type) === -1) {
                errors.push({
                    type: 'git',
                    message: `"${type}" is not allowed type !`
                })
            }
        }

        return errors
    }
}

export default new gitConvention()
