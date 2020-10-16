"use strict";
const fse = require('fs-extra')
const {sync: globSync} = require('glob')
const filesize = require('filesize')
const Terser = require('terser');
const chalk = require('chalk');

class Minichan {
    constructor(folder = null){
        this.local = folder;
        this.localFormat = null;
    }

    async init(){
        await this.autentication(this.local);
        await this.copyFiles(this.local);
        
        let files = await this.getFiles(this.local);
        let size = {
            old: 0,
            new: 0,
            rOld: null,
            rNew: null
        }
        
        await this.getSize(files).then(result => size.old += result);
        await this.minify(files);
        await this.getSize(files).then(result => size.new += result);
    
        size.rOld = filesize(size.old);
        size.rNew = filesize(size.new);
    
        console.log(`${chalk.bold.greenBright("[Reduction]")} ${chalk.bold(size.rOld)} to ${chalk.bold(size.rNew)}`)
        console.log(`${chalk.bold.greenBright("[Success]")} Result folder ${chalk.bold.yellow(`./dist/${this.localFormat}`)}`)
    }

    async minify(files){
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            let file = element;

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

    async getFiles(local){
        this.localFormat = await this.formatFileName(local);
        const files = globSync(`dist/${this.localFormat}/**/*.js`);
        if(files.length === 0) throw new Error(chalk.bold.red(`${chalk.red.bold("Error")}: Nothing to do here`));

        return files;
    }

    async getSize(files){
        return new Promise((resolve, reject) => {
            let sizes = 0;
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                const {size} = fse.statSync(element)
                sizes += size;
            }
            resolve(sizes)
            reject("Error")
        });
    }

    async autentication(local){
        if(typeof local != 'string') throw new Error(chalk.bold.red("Invalid Path !!"));
    }

    async copyFiles(local){
        await fse.copy(local, `./dist/${await this.formatFileName(local)}`)
        console.log(`${chalk.bold.greenBright("[Folder copied]")}`);
    }

    async formatFileName(filename){
        filename = filename.replace(/^.*[\\\/]/, '');
        return filename;
    }
}

module.exports = Minichan;