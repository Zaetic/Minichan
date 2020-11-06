const fse = require('fs-extra');
const Terser = require('terser');
const chalk = require('chalk');

class Mini {
    constructor() {
        this.files = new Map();
    }

    async init(files) {
        try {
            this.files = files;
            this.constructor.minifyJS(this.constructor.returnType(this.files, 'js'));
            this.constructor.minifyJSON(this.constructor.returnType(this.files, 'json'));
            this.constructor.clear(this.constructor.returnType(this.files, 'md'));
            return this.files;
        } catch (e) {
            throw new Error(chalk.bold.red(`${chalk.red.bold(e.message)}`));
        }
    }

    static minifyJS(files) {
        for (let index = 0; index < files.length; index += 1) {
            const element = files[index];
            const file = element.path;

            Terser.minify(fse.readFileSync(file, 'utf8')).then((result) => {
                if (result.code) {
                    fse.writeFileSync(file, result.code, 'utf8');
                }
            }).catch((e) => {
                if (e.name.toLowerCase() === 'syntaxerror') {
                    if (e.message === "Unexpected character '#'") {
                        return;
                    }
                }
                console.log(`${chalk.red.bold('Error')} ${file}:`, e);
            });
        }
    }

    static minifyJSON(files) {
        for (let index = 0; index < files.length; index += 1) {
            const element = files[index];
            const file = element.path;
            const fileRequire = fse.readJsonSync(file, 'utf8');

            fse.writeFileSync(file, JSON.stringify(fileRequire), 'utf8');
        }
    }

    static clear(files) {
        for (let index = 0; index < files.length; index += 1) {
            const element = files[index];
            const file = element.path;

            fse.unlinkSync(file);
        }
    }

    static returnType(files, type) {
        return files.get(type);
    }
}

module.exports = Mini;
