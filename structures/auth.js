"use strict";
const fse = require('fs-extra');
const chalk = require('chalk');

class Auth {
    constructor(local){
        this.local = local;
    }

    async init(){
        let auth = await this.autentication();
        if(auth) throw new Error(chalk.bold.red(auth));
        else return console.log(`${chalk.bold.greenBright("[Auth]")} Path ok`)
    }

    async autentication(){
        if(typeof this.local != 'string') return "Invalid type path";
        else if(!await this.folderExist()) return "Invalid Path";
        return;
    }

    async folderExist(){
        let exist = fse.pathExistsSync(this.local);
        return exist;
    }
}

module.exports = Auth;