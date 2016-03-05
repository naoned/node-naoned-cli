export default class Context {
    // @todo: Detect context from actual project files instead of npmConfig
    // ie: maybe if we find composer.json we assume php is in the context
    get () {
        return ['all', ...global.npmConfig.get().config.naoned.languages]
    }
}
