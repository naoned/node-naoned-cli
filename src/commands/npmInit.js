import inquirer from 'inquirer'
import Promise from 'promise'
import colors from 'colors'

export default function npmInit() {
    return new Promise((resolve, reject) => {
        let config = global.npmConfig
        if (config.onDisk) {
            inquirer.prompt([
                {
                    type: 'confirm',
                    name: 'overwrite',
                    message: 'This process will overwrite your current package.json file. Are you sure?',
                    default: true
                }
            ], (answers) => {
                if (answers.overwrite) {
                    prompt(config).then((res) => {
                        resolve(res)
                    })
                } else {
                    reject()
                }
            })
        } else {
            prompt(config).then((res) => {
                resolve(res)
            })
        }
    })
}

function prompt(config) {
    return new Promise((resolve) => {
        console.log(colors.inverse('Starting your new package.json...\n'))
        inquirer.prompt([
            {
                name: 'name',
                type: 'input',
                message: 'Project name',
                default: () => config.getName(),
                validate: (input) => {
                    if (input === '') {
                        return 'You must specify a project name'
                    }
                    if (/[A-Z]/.test(input)) {
                        return 'Only lowercase letters are allowed'
                    }
                    if (!/^[a-zA-Z0-9\-]+$/.test(input)) {
                        return 'Only use a-z, 0-9 and - in the project name'
                    }
                    return true
                }
            },
            {
                name: 'description',
                type: 'input',
                message: 'Description',
                default: () => config.getDescription()
            },
            {
                name: 'version',
                type: 'input',
                message: 'Version',
                default: () => config.getVersion()
            },
            {
                name: 'repository',
                type: 'input',
                message: 'Git repository',
                filter: (input) => {
                    if (input === '') {
                        return null
                    }
                    return {
                        type: 'git',
                        url: input
                    }
                },
                default: () => config.getRepository()
            },
            {
                name: 'author',
                type: 'input',
                message: 'Author',
                default: () => config.getAuthor()
            },
            {
                name: 'private',
                type: 'confirm',
                message: 'Private',
                default: () => config.getPrivate()
            }
        ], (answers) => {
            config.update(answers).then((savedConfig) => {
                resolve(savedConfig)
            })
        })
    })
}
