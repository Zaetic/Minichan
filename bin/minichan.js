#!/usr/bin/env node

const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const pkg = require('../package.json');
const Minichan = require('../index.js');

yargs
.scriptName('minichan').usage('$0 <cmd> [args]')
.command('mini [path]', 'Minify', (yarg) => {
    yarg.option('path', {
        describe: 'Project path',
        alias: 'p',
        default: process.cwd(),
    });
})
.help()
.alias('help', 'h')
.alias('version', 'v');

if (yargs.argv._[0] === 'mini') {
    new Minichan().init(yargs.argv.path);
} else {
    console.log('Type minichan --help');
}

const notifier = updateNotifier({ pkg, updateCheckInterval: 2 });
if (notifier.update) notifier.notify({ message: `Update available: ${notifier.update.latest} \n Run {updateCommand} to update.` });
