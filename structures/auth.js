const fse = require('fs-extra');
const chalk = require('chalk');

class Auth {
    constructor(local) {
        this.local = local;
    }

    async init() {
        const auth = this.autentication(this.local);
        if (auth) throw new Error(chalk.bold.red(auth));
        else return console.log(`${chalk.bold.greenBright('[Auth]')} Path ok`);
    }

    autentication(local) {
        if (typeof local !== 'string') return 'Invalid type path';
        if (!this.folderExist(local)) return 'Invalid Path';
        return null;
    }

    static folderExist(local) {
        return fse.pathExistsSync(local);
    }
}

module.exports = Auth;
