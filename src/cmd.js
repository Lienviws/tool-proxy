const { exec } = require('child_process')

const utils = require('./utils')
const store = require('./store')
const npmCache = {}

function getGitCMD () {
    return {
        proxy: 'git config --global http.proxy ',
        disableSSL: 'git config --global http.sslVerify false',
        unProxy: 'git config --global --unset http.proxy',
        defaultSSL: 'git config --global --unset http.sslVerify',
    }
}

function getNpmCMD (toolName) {
    if (npmCache[toolName]) return npmCache[toolName]
    const CMD = {
        proxy: '<% toolName %> config set proxy http://',
        httpsProxy: '<% toolName %> config set https-proxy http://',
        disableSSL: '<% toolName %> config set strict-ssl=false',
        unProxy: '<% toolName %> config delete proxy',
        unHttpsProxy: '<% toolName %> config delete https-proxy',
        defaultSSL: '<% toolName %> config set strict-ssl=true',
    }
    const res = {}
    for (const [key, value] of Object.entries(CMD)) {
        res[key] = value.replace(/<%\s*toolName\s*%>/, toolName)
    }
    Object.assign(npmCache, {
        toolName: res
    })
    return res
}

/**
 * enable git proxy cmd
 */
function getGitProxyCmd () {
    const proxy = store.getProxyAddr()

    return [
        getGitCMD().proxy + proxy,
        getGitCMD().disableSSL,
    ]
}

/**
 * enable npm proxy cmd
 */
function getNpmProxyCmd (toolName = 'npm') {
    const proxy = store.getProxyAddr()

    return [
        getNpmCMD(toolName).proxy + proxy,
        getNpmCMD(toolName).httpsProxy + proxy,
        getNpmCMD(toolName).disableSSL,
    ]
}

/**
 * disable git proxy cmd
 */
function getGitUnProxyCmd () {
    return [
        getGitCMD().unProxy,
        getGitCMD().defaultSSL,
    ]
}

/**
 * disable npm proxy cmd
 */
function getNpmUnProxyCmd (toolName = 'npm') {
    return [
        getNpmCMD(toolName).unProxy,
        getNpmCMD(toolName).unHttpsProxy,
        getNpmCMD(toolName).defaultSSL,
    ]
}

function doCmd (array = []) {
    let cmd = array.join(' && ')
    return new Promise((resolve, reject) => {
        let resolveFn = utils.resolveCount(2, resolve)
        let child_process = exec(cmd, (error, stdout, stderr) => {
            stderr ? reject(stderr) : resolveFn()
        })
        child_process.on('exit', ()=> {
            resolveFn()
        })
    })
}

exports.start = function ({
    npmTool,
    git
} = {}) {
    let cmdList = []
    let saveObj = store.getActivedTool()

    if (npmTool) {
        cmdList = [...cmdList, ...getNpmProxyCmd(npmTool)]
        saveObj.npm.push(npmTool)
    }
    if (git) {
        cmdList = [...cmdList, ...getGitProxyCmd()]
        saveObj.git = true
    }
    if (!npmTool && !git) {
        cmdList = [...cmdList, ...getNpmProxyCmd(), ...getGitProxyCmd()]
        saveObj.npm.push('npm')
        saveObj.git = true
    }
    
    store.setActivedTool('npm', ['npm', 'cnpm'])
    store.setActivedTool('git', true)
    return new Promise((resolve, reject) => {
        doCmd(cmdList).then((res) => {

            resolve(res)
        }).catch(err => {
            reject(err)
        })
    })
    return 
}
exports.stop = function () {
    let cmdList = []
    let {npm: npmTool, git: gitTool} = store.getActivedTool()

    for (const toolName of npmTool) {
        cmdList = [...cmdList, ...getNpmUnProxyCmd(toolName)]
    }

    if (gitTool) {
        cmdList = [...cmdList, ...getGitUnProxyCmd()]
    }

    return doCmd(cmdList)
}
exports.setConf = function (addr) {
    return store.setProxyAddr(addr)
}
