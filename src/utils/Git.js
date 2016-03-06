import GitHooks from './GitHooks'
import fs from 'fs'
import colors from 'colors'
import sh from 'shelljs'

const STAGING_DIR = '.tmp_staging'

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

    getStagedFiles (pattern) {
        let against = 'HEAD'
        sh.cd(process.cwd())
        if (sh.exec('git rev-parse --verify HEAD', { silent: true }).code > 0) {
            // Initial commit: diff against an empty tree object
            against = '4b825dc642cb6eb9a060e54bf8d69288fbee4904'
        }

        // this is the magic:
        // retrieve all files in staging area that are added, modified or renamed
        // but no deletions etc
        let files = sh.exec(`git diff-index --name-only --cached --diff-filter=ACMR ${against} --`, {
            silent: true
        }).stdout.trim().split('\n')

        if (!files.length) {
            console.error(colors.white.bgRed('No files added to stage. Use git add.'))
            process.exit(1)
        }

        // Copy contents of staged version of files to temporary staging area
        // because we only want the staged version that will be commited and not
        // the version in the working directory
        this.clearTempStaging()
        let stagedFiles = []
        files.forEach((file) => {
            let id = sh.exec(`git diff-index --cached HEAD ${file} | cut -d " " -f4`, { silent: true }).stdout.trim()
            let directory = file.replace(/[^\/]+?$/, '')
            // create staged version of file in temporary staging area with the same
            // path as the original file so that the phpcs ignore filters can be applied
            sh.exec(`mkdir -p "${STAGING_DIR}/${directory}"`)
            sh.exec(`git cat-file blob ${id} > "${STAGING_DIR}/${file}"`)
            if (typeof pattern  === 'undefined') {
                stagedFiles.push(`${STAGING_DIR}/${file}`)
            } else if (pattern.test(file)) {
                stagedFiles.push(`${STAGING_DIR}/${file}`)
            }
        })
        return stagedFiles
    }

    clearTempStaging () {
        sh.exec(`rm -rf ${STAGING_DIR}`)
    }
}
