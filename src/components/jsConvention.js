import sh from 'shelljs'
import EsLintConfig from '../utils/EsLintConfig'
import { es6Template } from '../utils/EsLintConfig'

export class jsConvention {
    install (dependencies, isEs6) {
        dependencies.cmd('npm i --save-dev eslint-config-naoned eslint')
        global.npmConfig.update({
            config: {
                ghooks: {
                    'pre-commit': 'naoned hook pre-commit'
                }
            }
        }, true)
        let template = isEs6 ? es6Template : null
        let esLintConfig = new EsLintConfig(`${process.cwd()}/.eslintrc`, template)
        esLintConfig.save()
    }

    registerHooks (gitHooks) {
        gitHooks.add('javascript', 'pre-commit', this)
    }

    preCommit(errors) {
        const filesToCheck = global.git.getStagedFiles(/\.js$/)
        if (!filesToCheck.length) {
            return errors
        }
        sh.cd(process.cwd())
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
