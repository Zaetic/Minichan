"use strict";
const fse = require('fs-extra');
const Terser = require('terser');
const chalk = require('chalk');
const Auth = require("./structures/auth.js");
const Files = require("./structures/files.js");

class Minichan {
    constructor(folder = null){
        this.local = folder;
        this.localFormat = null;
        this.auth = new Auth(this.local);
        this.files = new Files(this.local);
    }

    async init(){
        await this.auth.init();
        await this.files.init();

        let sFiles = this.files.files;
        await this.minify(sFiles.get("js"));
        sFiles = await this.files.setSizes("new", sFiles);

        let sizes = await this.files.realSize(sFiles);
    
        console.log(`${chalk.bold.greenBright("[Reduction Total]")} ${chalk.bold(sizes.old)} to ${chalk.bold(sizes.new)}`)
        console.log(`${chalk.bold.greenBright("[Success]")} Result folder ${chalk.bold.yellow(`./dist/${this.localFormat}`)}`)
    }

    async minify(files){
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            let file = element.path;

            await Terser.minify(fse.readFileSync(file, 'utf8')).then(result => {
        
                if(result.code) {
                fse.writeFileSync(file, result.code, 'utf8');
                };

            }).catch(e => {
                if(e.name.toLowerCase() === "syntaxerror"){
                    if(e.message === "Unexpected character '#'"){
                        return
                    }
                }
                console.log(`${chalk.red.bold("Error")} ${file}:`, e)
            })
        }
    }
}

module.exports = Minichan;