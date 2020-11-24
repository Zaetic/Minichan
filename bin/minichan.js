#!/usr/bin/env node

const yargs = require('yargs');
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
    console.log('Typing minichan --help');
}
