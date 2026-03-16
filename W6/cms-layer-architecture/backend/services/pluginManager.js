import seoPlugin from '../plugins/seoPlugin.js';
import auditLogPlugin from '../plugins/auditLogPlugin.js';

class PluginManager {
    constructor() {
        this.plugins = [seoPlugin, auditLogPlugin];
    }

    runHook(hookName, payload, context) {
        for (const plugin of this.plugins) {
            const hook = plugin[hookName];
            if (typeof hook === 'function') {
                hook(payload, context);
            }
        }
    }
}

export default new PluginManager();