
exports.command = "config <command>";
exports.describe = "View settings";
exports.builder = function (yargs) {
    return yargs
        .command(require("./config/get.ts"))
        .command(require("./config/set.ts"))
        .demandCommand()
        .help()
        .argv;
};
exports.handler = async (argv) => {}