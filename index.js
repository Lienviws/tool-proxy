const program = require('commander')

const run = require('./src_p/run')
const setting = require('./src_p/setting')
const printText = require('./src_p/printText')

program
    .version('1.0.0')

program
    .command('start [toolName]')
    .description('start the tool proxy')
    .action(function (toolName, cmd) {
        run({ 
            type: 'start', 
            toolName,
        })
    })

program.command('stop [toolName]')
    .description('stop the tool proxy')
    .action((toolName, cmd) => {
        run({ 
            type: 'stop', 
            toolName
        })
    })

program.command('set <proxy>')
    .description('set proxy address')
    .action((proxy) => {
        setting.setProxy(proxy)
    })

program.command('alias [aliasName] [parentTool]')
    .description('set tool alias')
    .option('-r, --remove <aliasName>', 'remove alias')
    .option('-l, --list', 'alias list')
    .action((aliasName, parentTool, cmd) => {
        if (cmd.remove) {
            setting.removeAlias(cmd.remove)
        } else if (cmd.list) {
            printText.aliasTable()
        } else {
            setting.setAlias(aliasName, parentTool)
        }
    })

program.command('status')
    .description('check the proxy tool status')
    .action((cmd) => {
        printText.toolStatus()
    })

program.parse(process.argv)
