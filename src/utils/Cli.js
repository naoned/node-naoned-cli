import Promise from 'promise'
import colors from 'colors'
import shelljs from 'shelljs'

export default class Cli {
    constructor () {
        this.commands = {}
        this.sh = shelljs
    }

    register (commands) {
        commands.forEach((command) => {
            let name = this.getCommandName(command)
            if (name) {
                this.commands[name] = new command()
            }
        })
    }

    getCommandName(command) {
        if (!/Command$/.test(command.name)) {
            return false
        }
        let output = command.name.replace(/([A-Z])/g, ($1) => `-${$1.toLowerCase()}`)
        output = output.slice(1)
        output = output.replace(/\-command$/, '')
        return output
    }

    start (args) {
        if (typeof this.commands[args[0]] !== 'undefined') {
            this.run(args[0], args)
        } else {
            console.log(`No command ${args[0]}`)
        }
    }

    run (commandName, args = []) {
        return new Promise((resolve, reject) => {
            if (typeof this.commands[commandName] !== 'undefined') {
                if (typeof this.commands[commandName].run !== 'function') {
                    console.error(colors.white.bgRed(`The class of the command "${commandName}" must have a run function`))
                    process.exit(1)
                }
                let runner = this.commands[commandName].run(args)
                if (typeof runner === 'undefined' || !(runner instanceof Promise)) {
                    console.error(colors.white.bgRed(`The run function of the command "${commandName}" must return a promise`))
                    process.exit(1)
                }
                runner.then(() => {
                    resolve()
                }, () => {
                    reject()
                })
            } else {
                reject()
            }
        })
    }
}
