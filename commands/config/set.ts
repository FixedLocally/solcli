const nconf = require('nconf');
const utils = require('../../utils.ts');

exports.command = "set <key> <value>";
exports.describe = "Change settings value";
exports.builder = {};
exports.handler = async (argv) => {
    nconf.file({ file: `${utils.HOME}/.config/solcli/solcli.json` });
    switch (argv.key) {
        case "rpc":
        case "wallet":
            nconf.set(argv.key, argv.value);
            nconf.save();
            break;
        default:
            console.log(`Invalid config key: ${argv._[1]}`);
    }
}