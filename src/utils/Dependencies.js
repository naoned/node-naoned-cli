import sh from 'shelljs'
import colors from 'colors'

export default class Dependencies {
    constructor () {
        this.cmds = []
    }

    cmd (command) {
        this.cmds.push(command)
    }

    install () {
        if (this.cmds.length) {
            console.log(colors.inverse('Installing the dependencies...'))
            sh.exec(this.cmds.join(' && '), (code) => {
                if (code > 0) {
                    console.log(colors.white.bgRed('An error occured'))
                } else {
                    console.log(colors.white.bgGreen('Done.'))
                }
            })
        }
    }
}
