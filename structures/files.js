const fse = require('fs-extra');
const chalk = require('chalk');
const filesize = require('filesize');
const path = require('path');
const tmp = require('tmp');
const { sync: globSync } = require('glob');

class Files {
    constructor(local) {
        this.local = local;
        this.newLocal = null;
        this.localFormat = null;
        this.files = new Map();
    }

    async init() {
        try {
            this.newLocal = `./dist/${this.constructor.formatFileName(this.local)}`;
            await this.copyFiles();

            const filesGet = this.getFiles();
            this.filterTypes(filesGet);
            this.files = await this.setSizes('old', this.files);
        } catch (e) {
            throw new Error(chalk.bold.red(`${chalk.red.bold(e.message)}`));
        }
    }

    async copyFiles() {
        const exclude = globSync(`${this.local}/.git/**/*`);
        if (exclude) exclude.push(`${this.local}/.git`);

        const tempDir = tmp.dirSync();

        await fse.copy(this.local, tempDir.name, {
            filter: (pathThis) => {
                if (pathThis.indexOf('node_modules') > -1) return false;
                if (exclude.find((name) => path.resolve(name) === path.resolve(pathThis))) {
                    return false;
                }
                return true;
            },
        });
        await fse.move(tempDir.name, this.newLocal);

        console.log(`${chalk.bold.greenBright('[Folder copied]')}`);
    }

    getFiles() {
        this.localFormat = this.constructor.formatFileName(this.local);
        const files = globSync(`dist/${this.localFormat}/**/*`);
        if (files.length === 0) throw new Error(chalk.bold.red(`${chalk.red.bold('Error')}: Nothing to do here`));
        return files;
    }

    filterTypes(filesGet) {
        for (let index = 0; index < filesGet.length; index += 1) {
            const element = filesGet[index];
            const ext = this.getFileExtension(element);

            const newElement = {
                path: element,
            };

            if (ext) {
                if (!this.files.get(ext)) {
                    this.files.set(ext, [newElement]);
                } else {
                    const arrayFiles = this.files.get(ext);
                    arrayFiles.push(newElement)
                    this.files.set(ext, arrayFiles);
                }
            }
        }
    }

    async setSizes(type, filesMap) {
        for (const [key, value] of filesMap) {
            for (let index = 0; index < value.length; index += 1) {
                const element = value[index];

                if (type === 'old') element.oldSize = this.constructor.getSize(element.path);
                else if (type === 'new') element.newSize = this.constructor.getSize(element.path);
            }
        }
        return filesMap;
    }

    static realSize(filesMap) {
        const sizes = {
            old: 0,
            new: 0,
        };

        for (const [key, value] of filesMap) {
            for (let index = 0; index < value.length; index += 1) {
                const element = value[index];

                sizes.old += element.oldSize;
                sizes.new += element.newSize;
            }
        }

        sizes.old = filesize(sizes.old);
        sizes.new = filesize(sizes.new);
        return sizes;
    }

    async getSizeAll(files) {
        return new Promise((resolve, reject) => {
            let sizes = 0;
            for (let index = 0; index < files.length; index += 1) {
                const element = files[index];
                sizes += this.constructor.getSize(element);
            }
            resolve(sizes);
            reject(new Error('Get all Sizes failed'));
        });
    }

    static getSize(file) {
        let sizeSend = 0;
        try {
            const { size } = fse.statSync(file);
            sizeSend = size;
        } catch (e) {
            if (e.code === 'ENOENT') sizeSend = 0;
        }
        return sizeSend;
    }

    getFileExtension(filename) {
        let ext = filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
        if (!ext) {
            ext = this.constructor.IsDirectory(filename) ? 'dir' : 'undefined';
        }
        return ext;
    }

    static IsDirectory(file) {
        return fse.statSync(file).isDirectory();
    }

    static formatFileName(filename) {
        return path.basename(filename);
    }
}

module.exports = Files;
