"use strict";
const fse = require('fs-extra');
const chalk = require('chalk');

class Auth {
    constructor(local){
        this.local = local;
    }

    async init(){
        let auth = await this.autentication(this.local);
        if(auth) throw new Error(chalk.bold.red(auth));
        else return console.log(`${chalk.bold.greenBright("[Auth]")} Path ok`)
    }

    async autentication(local){
        if(typeof local != 'string') return "Invalid type path";
        else if(!await this.folderExist(local)) return "Invalid Path";
        return;
    }

    async folderExist(local){
        let exist = fse.pathExistsSync(local);
        return exist;
    }
}

module.exports = Auth;