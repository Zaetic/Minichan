"use strict";
const fse = require('fs-extra');
const chalk = require('chalk');
const filesize = require('filesize');
const {sync: globSync} = require('glob')

class Files {
    constructor(local){
        this.local = local;
        this.newLocal = null;
        this.files = new Map();
    }

    async init(){
        this.newLocal = `./dist/${await this.formatFileName(this.local)}`;

        await this.copyFiles();

        let filesGet = await this.getFiles();
        await this.filterTypes(filesGet);
        this.files = await this.setSizes("old", this.files);
    }

    async realSize(filesMap){
        let sizes = {
            old: 0,
            new: 0
        }

        for (var [key, value] of filesMap) {
            for (let index = 0; index < value.length; index++) {
                const element = value[index];
                
                sizes.old += element.oldSize;
                sizes.new += element.newSize;
            }   
        }

        sizes.old = filesize(sizes.old);
        sizes.new = filesize(sizes.new);
        return sizes;
    }

    async getSizeAll(files){
        return new Promise( async (resolve, reject) => {
            let sizes = 0;
            for (let index = 0; index < files.length; index++) {
                const element = files[index];
                sizes += await getSize(element);
            }
            resolve(sizes)
            reject("Error")
        });
    }

    async getSize(file){
        try{
            let {size} = fse.statSync(file);
            return size;
        }catch(e){
            if(e.code === "ENOENT") return 0;
        }
    }

    async copyFiles(){
        await fse.copy(this.local, this.newLocal);
        console.log(`${chalk.bold.greenBright("[Folder copied]")}`);
    }

    async getFiles(){
        this.localFormat = await this.formatFileName(this.local);
        const files = globSync(`dist/${this.localFormat}/**/*`);
        if(files.length === 0) throw new Error(chalk.bold.red(`${chalk.red.bold("Error")}: Nothing to do here`));
        return files;
    }

    async setSizes(type, filesMap){

        for (var [key, value] of filesMap) {
            for (let index = 0; index < value.length; index++) {
                const element = value[index];
                
                if(type === "old") element.oldSize = await this.getSize(element.path);
                else if(type === "new") element.newSize = await this.getSize(element.path);
            } 
        }
        return filesMap;
    }

    async filterTypes(filesGet){
        for (let index = 0; index < filesGet.length; index++) {
            const element = filesGet[index];
            let ext = await this.getFileExtension(element);
            
            let newElement = {
                path: element
            }

            if(ext){
                if (!this.files.get(ext)){
                    this.files.set(ext, [newElement]);
                }else{
                    let arrayFiles = this.files.get(ext);
                    arrayFiles.push(newElement)
                    this.files.set(ext, arrayFiles);
                }
            }
            
        }
    }

    async getFileExtension(filename){
        return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
    }

    async formatFileName(filename){
        filename = filename.replace(/^.*[\\\/]/, '');
        return filename;
    }
}

module.exports = Files;