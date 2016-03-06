export default class Dependencies {
    constructor () {
        this.cmds = []
    }

    cmd (command) {
        this.cmds.push(command)
    }

    install () {
        console.log('Installing the dependencies...')
        console.log(this.cmds)
    }
}
