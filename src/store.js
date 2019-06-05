const Conf = require('conf')

const store = new Conf()
const storeKey = {
    ADDR: 'addr',
    TOOL: 'tool',
    PROXY_STATUS: 'proxyStatus',
    ACTIVED_TOOL: 'activedTool'
}

function initStore () {
    if (typeof store.get(storeKey.TOOL) === 'undefined') {
        store.set(storeKey.TOOL, {})
    }
}

initStore()

/**
 * get/set proxy address
 */
exports.getProxyAddr = function () {
    return store.get(storeKey.ADDR)
}
exports.setProxyAddr = function (addr) {
    store.set(storeKey.ADDR, addr)
    return store
}

/**
 * check if system supported tool
 */
exports.getSupportTool = function () {
    const tool = store.get(storeKey.TOOL)
    return Object.entries(tool).filter(([key, val]) => val).map(([key, val]) => key)
}
exports.setTool = function (...args) {
    store.set(storeKey.TOOL, Object.assign.apply(this, [{}, ...args]))
    return store
}
exports.addTool = function (...args) {
    const tool = store.get(storeKey.TOOL)
    store.set(storeKey.TOOL, Object.assign.apply(this, [tool, ...args]))
    return store
}

/**
 * system status
 */
exports.getStatus = function () {
    return store.get(storeKey.PROXY_STATUS) ? 'on' : 'off'
}
exports.setStatusOn = function () {
    store.set(storeKey.PROXY_STATUS, true)
    return store
}
exports.setStatusOff = function () {
    store.set(storeKey.PROXY_STATUS, false)
    return store
}

/**
 * manage system actived tool
 * @param toolObj
 * @param toolObj.npm
 * @param toolObj.git
 */
exports.setActivedTool = function (toolName, value) {
    let activedTool = getActiveTool()
    
    activedTool[toolName] = value

    store.set(storeKey.ACTIVED_TOOL, activedTool)
}
exports.getActivedTool = function () {
    return getActiveTool()
}
exports.removeActivedTool = function () {
    store.set(storeKey.ACTIVED_TOOL, {})
}
function getActiveTool () {
    let activedTool = store.get(storeKey.ACTIVED_TOOL)
    
    if (!Object.prototype.toString.call(activedTool)) { // todo 这个数据怎么安排
        activedTool = {
            npm: [],
            git: false
        }
    }
    return activedTool
}
