import fs from 'fs'
import merge from 'merge'
import colors from 'colors'
import inquirer from 'inquirer'
import Promise from 'promise'

export default class NpmConfig {
    constructor (templatePath, template) {
        this.data = defaultTemplate
        this.onDisk = false
        this.path = templatePath

        try {
            this.data = JSON.parse(fs.readFileSync(templatePath, { encoding: 'utf8' }))
            this.onDisk = true
        } catch (err) {
            // Template not on disk
        }

        if (template) {
            if (typeof template === 'string') {
                template = JSON.parse(template)
            }
            this.data = merge.recursive(true, this.data, template)
        }
    }

    get() {
        return this.data
    }

    save(newConfig) {
        return new Promise((resolve, reject) => {
            inquirer.prompt([
                {
                    type: 'confirm',
                    message: `Is this ok?\n${JSON.stringify(newConfig, null, 2)}\n`,
                    name: 'confirm'
                }
            ], (answers) => {
                if (answers.confirm) {
                    try {
                        fs.writeFileSync(this.path, JSON.stringify(newConfig, null, 4))
                        this.data = newConfig
                        console.log(colors.white.bgGreen(`Saved npm config to ${this.path}`))
                        console.log('\n')
                        resolve(this.get())
                    } catch (err) {
                        console.error(err)
                        reject(err)
                    }
                }
            })
            this.onDisk = true
        })
    }

    update(newData) {
        return this.save(merge.recursive(true, this.data, newData))
    }

    getName() {
        return this.data.name
    }

    getVersion() {
        return this.data.version
    }

    getDescription() {
        return this.data.description
    }

    getRepository() {
        return this.data.repository.url || ''
    }

    getAuthor() {
        return this.data.author
    }

    getPrivate() {
        return this.data.private
    }
}

export const defaultTemplate = {
    name: '',
    version: '1.0.0',
    description: '',
    main: 'index.js',
    scripts: {
        test: 'echo \"Error: no test specified\" && exit 1'
    },
    author: '',
    license: 'UNLICENSED',
    private: true
}
