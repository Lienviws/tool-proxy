const { exec } = require('child_process')

const utils = require('./utils')
const store = require('./store.js')

const checkCmd = {
    npm: 'npm -v',
    git: 'git --version'
}

function toolExist (cmd) {
    return new Promise((resolve, reject) => {
        let resolveFn = utils.resolveCount(2, resolve)
        let child_process = exec(cmd, (error, stdout, stderr) => {
            let code = error ? error.code.toString() : null
            if (error) {
                if (code === '127' || code === '1') {
                    resolveFn(false)
                } else {
                    reject(error)
                }
            } else {
                resolveFn(true)
            }
        })
        child_process.on('exit', ()=> {
            resolveFn()
        })
    })
}

function checkInner () {
    return Promise.all(Object.entries(checkCmd).map(([tool, cmd]) => new Promise(resolve => {
        let resObj = {}
        resObj[tool] = false

        toolExist(cmd).then(res => {
            resObj[tool] = res
            resolve(obj)
        }).catch(error => {
            resolve(resObj)
        })
    })))
}

module.exports = function () {
    checkInner().then(res => {
        store.setTool.apply(this, res)
    })
}
