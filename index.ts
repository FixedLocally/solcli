#!/usr/bin/env node
const fs = require('fs');
const utils = require('./utils.ts');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

if (!fs.existsSync(utils.CONFIG_DIR)){
    fs.mkdirSync(utils.CONFIG_DIR, { recursive: true });
}
fs.access(utils.CONFIG_PATH, fs.F_OK, (err) => {
    if (err) {
        // create file
        fs.copyFile("config/default.json", utils.CONFIG_PATH, (err) => {
            if (err) throw err;
            console.log('source.txt was copied to destination.txt');
        });
        return;
    }
    //file exists
})

yargs(hideBin(process.argv))
    .command(require('./commands/balance.ts'))
    .command(require('./commands/config.ts'))
    .command(require('./commands/transfer.ts'))
    .command(require('./commands/wallets.ts'))
    .commandDir('commands')
    .demandCommand()
    .help()
    .argv;