export default function gitConvention(errors) {
    const pattern = /^((fixup! |squash! )?(\w+)(?:\(([^\)\s]+)\))?: (.+))(?:\n|$)/
    const types = ['feat', 'fix', 'docs', 'style', 'refact', 'perf', 'test', 'misc', 'revert']
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

global.git.hooks.register('all', 'commit-msg', gitConvention)
