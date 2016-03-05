import GitHooks from './GitHooks'
import fs from 'fs'
import colors from 'colors'

export default class Git {
    constructor (path) {
        this.path = path
        this.hooks = new GitHooks()

        try {
            fs.accessSync(`${this.path}/config`, fs.F_OK)
        } catch (e) {
            console.error(colors.white.bgRed(`Can't access the git config at ${this.path}/config`))
            process.exit(1)
        }
    }

    getCommitMsg () {
        const commitMsgFile = `${this.path}/COMMIT_EDITMSG`
        let msg = null

        try {
            msg = fs.readFileSync(commitMsgFile)
        } catch (err) {
            console.error(colors.white.bgRed(err))
            process.exit(1)
        }

        return typeof msg.toString === 'function' && msg.toString().split('\n').shift()
    }
}
