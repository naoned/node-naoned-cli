export default function hook(hookName) {
    global.git.hooks.run(hookName, global.context.get())
}
