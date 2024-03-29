#!/usr/bin/env node

const yargs = require('yargs');
const updateNotifier = require('update-notifier');
const { Confirm } = require('enquirer');
const pkg = require('../package.json');
const Minichan = require('../index');

yargs
    .scriptName('minichan')
    .usage('$0 <cmd> [args]')
    .command('mini', '- Minify and build dist', (yarg) => {
        yarg.option('path', {
            describe: 'Project path',
            alias: 'p',
            default: process.cwd(),
        });
        yarg.option('force', {
            describe: 'Force minichan',
            alias: 'f',
            default: false,
            boolean: true,
        });
    })
    .help()
    .alias('help', 'h')
    .alias('version', 'v');

if (yargs.argv._[0] === 'mini') {
    const { force } = yargs.argv;
    if (!force) {
        const prompt = new Confirm({
            initial: true,
            name: 'question',
            message: `Is the path correct? : [${yargs.argv.path}]`,
        });

        prompt
            .run()
            .then((answer) => {
                if (answer) {
                    new Minichan().init(yargs.argv.path);
                } else {
                    console.log('- Operation canceled -');
                }
            })
            .catch((error) => console.log('- Operation failed -', error));
    } else {
        new Minichan().init(yargs.argv.path);
    }
} else {
    console.log('Type minichan --help');
}

const notifier = updateNotifier({ pkg, updateCheckInterval: 2 });
if (notifier.update) notifier.notify({ message: `Update available: ${notifier.update.latest} \n Run {updateCommand} to update.` });
