const { exec } = require('child_process')

const utils = require('./utils')
const store = require('./store')

const CMD = {
    gitProxy: 'git config --global http.proxy ',
    gitDisableSSL: 'git config --global http.sslVerify false',
    gitUnProxy: 'git config --global --unset http.proxy',
    gitDefaultSSL: 'git config --global --unset http.sslVerify',
    npmProxy: 'npm config set proxy http://',
    npmDisableSSL: 'npm config set strict-ssl=false',
    npmUnProxy: 'npm config delete proxy',
    npmDefaultSSL: 'npm config set strict-ssl=true',
}

/**
 * enable proxy cmd
 */
function getProxyCmd () {
    const proxy = store.getProxyAddr()

    return [
        CMD.gitProxy + proxy,
        CMD.gitDisableSSL,
        CMD.npmProxy + proxy,
        CMD.npmDisableSSL,
    ]
}

/**
 * disable proxy cmd
 */
function getUnProxyCmd () {
    return [
        CMD.gitUnProxy,
        CMD.gitDefaultSSL,
        CMD.npmUnProxy,
        CMD.npmDefaultSSL,
    ]
}

function doCmd (array = []) {
    return Promise.all(array.map(cmd => new Promise((resolve, reject) => {
        let resolveFn = utils.resolveCount(2, resolve)
        let child_process = exec(cmd, (error, stdout, stderr) => {
            stderr ? reject(stderr) : resolveFn()
        })
        child_process.on('exit', ()=> {
            resolveFn()
        })
    })))
}

exports.start = function () {
    return doCmd(getProxyCmd())
}
exports.stop = function () {
    return doCmd(getUnProxyCmd())
}
exports.setConf = function (addr) {
    return store.setProxyAddr(addr)
}
