#!/usr/bin/env node

const { argv } = require('yargs');
const Minichan = require('../index.js');

if (argv.mini) {
    new Minichan().init(argv.mini);
} else {
    console.log("Use 'minichan --mini path'");
}
