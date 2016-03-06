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
            this.data = merge.recursive(true, this.data, JSON.parse(fs.readFileSync(templatePath, { encoding: 'utf8' })))
            this.onDisk = true
        } catch (err) {
            // Config not on disk
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

    saveWithConfirm(newConfig) {
        return new Promise((resolve, reject) => {
            inquirer.prompt([
                {
                    type: 'confirm',
                    message: `Is this ok?\n${JSON.stringify(newConfig, null, 2)}\n`,
                    name: 'confirm'
                }
            ], (answers) => {
                if (answers.confirm) {
                    this.save(newConfig).then((conf) => {
                        resolve(conf)
                    }, (err) => {
                        reject(err)
                    })
                }
            })
        })
    }

    save(config) {
        return new Promise((resolve, reject) => {
            try {
                fs.writeFileSync(this.path, JSON.stringify(config, null, 4))
                this.data = config
                console.log(colors.white.bgGreen(`Saved npm config to ${this.path}`))
                console.log('\n')
                this.onDisk = true
                resolve(this.get())
            } catch (err) {
                console.error(err)
                reject(err)
            }
        })
    }

    update(newData, force = false) {
        if (force) {
            return this.save(merge.recursive(true, this.data, newData))
        }
        return this.saveWithConfirm(merge.recursive(true, this.data, newData))
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
        if (typeof this.data.repository !== 'undefined' && typeof this.data.repository.url !== 'undefined') {
            return this.data.repository.url
        }
        return ''
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
    private: true,
    config: {
        naoned: {
            languages: []
        }
    }
}
