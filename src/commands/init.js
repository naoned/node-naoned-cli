import inquirer from 'inquirer'
import npmInit from './npmInit'
import NpmConfig from '../utils/NpmConfig'
import colors from 'colors'

export default function init() {
    if (global.npmConfig.onDisk) {
        prompt(global.npmConfig)
    } else {
        console.log(colors.white.bgRed('Your project does not have a package.json file.\n'))
        npmInit().then((config) => {
            prompt(config)
        })
    }
}

function prompt(config) {
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
    ], save)
}

function save(answers) {
    global.npmConfig.update({
        config: {
            naoned: {
                languages: answers.languages
            }
        }
    })
}
