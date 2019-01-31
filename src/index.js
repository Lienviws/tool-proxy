const chalk = require('chalk')

const checkTool = require('./checkTool')
const utils = require('./utils.js')
const store = require('./store.js')
const cmd = require('./cmd.js')

const PARAMS = {
    START: 'start',
    STOP: 'stop',
    SET: 'set',
    STATUS: 'status',
    VERSION: ['-V', '--version']
}

async function start () {
    if (typeof store.getProxyAddr() === 'undefined') {
        console.log('you should set proxy first')
        console.log('like: ' + chalk.green('toolProxy set 127.0.0.1:8899'))
        return
    }
    try {
        await cmd.start()
        store.setStatusOn()
        console.log(`${store.getSupportTool().join(' & ')} proxy on, at ${store.getProxyAddr()}`)
    } catch (error) {
        console.log('proxy start failed\n' + error)
    }
}

async function stop () {
    try {
        await cmd.stop()
        store.setStatusOff()
        console.log(`${store.getSupportTool().join(' & ')} proxy off`)
    } catch (error) {
        console.log('proxy off failed\n' + error)
    }
}

function setConf (value) {
    store.setProxyAddr(value)
    console.log('set success, new proxy address is ' + store.getProxyAddr())
}

/**
 * show help
 */
function showHelp () {
    let help = `
    Usage: toolProxy [options]

    Options:

        start               start all proxy
        stop                stop all proxy
        set xx.xx.xx.xx     set global proxy address
        status              show proxy status
        --version, -V       show version
    `
    console.log(help)
}

function showStatus () {
    let status = `
    proxyAddr: ${store.getProxyAddr()}
    proxy: ${chalk.green(store.getStatus())}
    supported:
        ${store.getSupportTool().join(', ')}
    `
    console.log(status)
}

function showVersion () {
    console.log(utils.getVersion())
}

checkTool()

module.exports = function () {
    let argsProcess = new utils.ProcessArgs(PARAMS)
    argsProcess.resolve((type, value) => {
        switch (type) {
            case 'START':
                start()
                break;
            case 'STOP':
                stop()
                break;
            case 'SET':
                setConf(value)
                break;
            case 'STATUS':
                showStatus()
                break;
            case 'VERSION':
                showVersion()
                break;
            default:
                showHelp()
                break;
        }
    })
}
