const version = require('../package.json').version

/**
 * program arguments handle
 */
exports.ProcessArgs = class {
    constructor (cmdMap) {
        this.cmdMap = cmdMap
        this.args = process.argv.slice(2)
    }

    resolve (cb) {
        const cmd = this.args.shift()
        const options = this.objectifyArgs(this.args)

        for (const [key, val] of this.cmdMap) {
            if (Array.isArray(val)) {
                if (val.includes(cmd)) {
                    cb && cb(key, options)
                    return
                }
            } else {
                if (val === cmd) {
                    cb && cb(key, options)
                    return
                }
            }
        }
        cb && cb()
    }

    /**
     * convert args to object
     * 
     * eg:
     * ['--npm', 'cnpm']
     * -->
     * {
     *    npm: 'cnpm'
     * }
     */
    objectifyArgs (args) {
        const res = {
            args: []
        }
        const keyLike = /^--(.*)/
        while (args.length) {
            const value = args.shift()
            const [all, key] = value.match(keyLike) || []
            if (key && args.length) {
                res[key] = args.shift()
            } else {
                res.args.push(value)
            }
        }
        return res
    }
}

exports.getVersion = function () {
    return version
}

/**
 * when call created function after 'times' times, call resolve
 */
exports.resolveCount = function (times, resolve) {
    let res = undefined
    return function (data) {
        res = data
        if (--times <= 0) {
            resolve(res)
        }
    }
}
