import inquirer from 'inquirer'
import colors from 'colors'
import Dependencies from '../utils/Dependencies'
import jsConvention from '../components/jsConvention'
import gitConvention from '../components/gitConvention'
import Promise from 'promise'

export default class InitCommand {
    run () {
        return new Promise((resolve) => {
            if (global.npmConfig.onDisk) {
                this.prompt(global.npmConfig)
            } else {
                console.log(colors.white.bgRed('Your project does not have a package.json file.\n'))
                global.cli.run('npm-init').then((config) => {
                    this.prompt(config).then(() => resolve())
                })
            }
        })
    }

    prompt () {
        return new Promise((resolve) => {
            console.log(colors.inverse('Starting the installation of Naoned conventions tools...\n'))
            inquirer.prompt([
                {
                    type: 'checkbox',
                    message: 'What languages does your project uses?',
                    name: 'languages',
                    choices: [
                        {
                            name: 'javascript'
                        }
                    ],
                    default: ['javascript']
                },
                {
                    type: 'confirm',
                    message: 'Is the project using ES6',
                    default: true,
                    name: 'es6',
                    when: (answers) => {
                        return answers.languages.indexOf('javascript') > -1
                    }
                },
                {
                    type: 'confirm',
                    message: 'Do you want a gulp setup to manage sass compilation?',
                    default: true,
                    name: 'gulp',
                    when: (answers) => {
                        return answers.languages.indexOf('sass') > -1
                    }
                }
            ], (answers) => {
                this.updateNpmConfig(answers).then(() => {
                    this.installConventions(answers, new Dependencies())
                    resolve()
                })
            })
        })
    }

    updateNpmConfig (answers) {
        return global.npmConfig.update({
            config: {
                naoned: {
                    languages: answers.languages
                }
            }
        }, true)
    }

    installConventions (answers, dependencies) {
        gitConvention.install(dependencies)

        if (answers.languages.indexOf('javascript') > -1) {
            jsConvention.install(dependencies)
        }

        dependencies.install()
    }
}

