export class jsConvention {
    install (dependencies) {
        dependencies.cmd('npm i --save-dev eslint-config-naoned eslint')
    }
}

export default new jsConvention()
