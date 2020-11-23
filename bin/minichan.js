#!/usr/bin/env node

const { argv } = require('yargs');
const Minichan = require('../index.js');

if (argv.mini) {
    if (typeof argv.mini === 'boolean') {
        new Minichan().init(process.cwd());
    } else {
        new Minichan().init(argv.mini);
    }
} else {
    console.log("Use 'minichan --mini path'");
}
