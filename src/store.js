const Conf = require('conf')

const store = new Conf()
const storeKey = {
    addr: 'addr',
    tool: 'tool',
    proxyStatus: 'proxyStatus'
}

function initStore () {
    if (typeof store.get(storeKey.tool) === 'undefined') {
        store.set(storeKey.tool, {})
    }
}

initStore()

exports.getProxyAddr = function () {
    return store.get(storeKey.addr)
}
exports.setProxyAddr = function (addr) {
    store.set(storeKey.addr, addr)
    return store
}

exports.getSupportTool = function () {
    const tool = store.get(storeKey.tool)
    return Object.entries(tool).filter(([key, val]) => val).map(([key, val]) => key)
}
exports.setTool = function (...args) {
    store.set(storeKey.tool, Object.assign.apply(this, [{}, ...args]))
    return store
}
exports.addTool = function (...args) {
    const tool = store.get(storeKey.tool)
    store.set(storeKey.tool, Object.assign.apply(this, [tool, ...args]))
    return store
}

exports.getStatus = function () {
    return store.get(storeKey.proxyStatus) ? 'on' : 'off'
}
exports.setStatusOn = function () {
    store.set(storeKey.proxyStatus, true)
    return store
}
exports.setStatusOff = function () {
    store.set(storeKey.proxyStatus, false)
    return store
}
