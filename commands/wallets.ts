
exports.command = "wallets <command>";
exports.describe = "Wallet settings";
exports.builder = function (yargs) {
    return yargs
        .command(require("./wallets/list.ts"))
        .demandCommand()
        .help()
        .argv;
};
exports.handler = async (argv) => {}