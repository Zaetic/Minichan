#!/usr/bin/env node

const { argv } = require("yargs");
const Minichan = require("../index.js");

if(argv.mini){
    return new Minichan(argv.mini).init();
}