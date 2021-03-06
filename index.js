const chalk = require('chalk');
const Auth = require('./structures/auth.js');
const Files = require('./structures/files.js');
const Mini = require('./structures/minify.js');

class Minichan {
    constructor() {
        this.local = null;
        this.localFormat = null;
    }

    async init(local) {
        this.local = local;

        this.auth = new Auth(this.local);
        this.files = new Files(this.local);
        this.mini = new Mini();

        await this.auth.init();
        await this.files.init();

        let sFiles = this.files.files;
        sFiles = await this.mini.init(sFiles);
        sFiles = await this.files.setSizes('new', sFiles);

        const sizes = Files.realSize(sFiles);

        console.log(`${chalk.bold.greenBright('[Reduction Total]')} ${chalk.bold(sizes.old)} to ${chalk.bold(sizes.new)}`);
        console.log(`${chalk.bold.greenBright('[Success]')} Result folder ${chalk.bold.yellow(`./dist/${this.files.localFormat}`)}`);
    }
}

module.exports = Minichan;
