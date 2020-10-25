"use strict";
const fse = require('fs-extra');
const Terser = require('terser');

class Mini {
    constructor(){
        this.files = new Map();
    }    

    async init(files){
        this.files = files;
        await this.minifyJS(await this.returnType(this.files, "js"));
        await this.clear(await this.returnType(this.files, "md"));
        return this.files;
    }

    async minifyJS(files){
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

    async clear(files){
        for (let index = 0; index < files.length; index++) {
            const element = files[index];
            let file = element.path;

            fse.unlinkSync(file);
        }
    }

    async returnType(files, type){
        return files.get(type);
    }
}

module.exports = Mini;