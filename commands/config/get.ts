const utils = require('../../utils.ts');

exports.command = "get";
exports.describe = "Get settings value";
exports.builder = {};
exports.handler = async (argv) => {
    console.log(`wallet=${utils.getConfig("wallet")}`);
    console.log(`rpc=${utils.getConfig("rpc")}`);
}