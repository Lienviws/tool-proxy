const version = require('../package.json').version

/**
 * program arguments handle
 */
exports.ProcessArgs = class {
    constructor (options) {
        this.options = options
        this.args = process.argv.slice(2)
    }

    resolve (cb) {
        const cmd = this.args[0]
        const value = this.args[1]

        let entries = Object.entries(this.options)
        for (const [key, val] of entries) {
            if (Array.isArray(val)) {
                if (val.includes(cmd)) {
                    cb && cb(key, value)
                    return
                }
            } else {
                if (val === cmd) {
                    cb && cb(key, value)
                    return
                }
            }
        }
        cb && cb()
    }
}

exports.getVersion = function () {
    return version
}

exports.resolveCount = function (times, resolve) {
    let res = undefined
    return function (data) {
        res = data
        if (--times <= 0) {
            resolve(res)
        }
    }
}
