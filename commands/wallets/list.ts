const { Keypair } = require('@solana/web3.js');

const utils = require('../../utils.ts');

exports.command = "list";
exports.describe = "List saved wallets";
exports.builder = {};
exports.handler = async (argv) => {
    const wallets = utils.getConfig("wallets");
    for (let i in wallets) {
        console.log(i, utils.readKeypairFromFile(wallets[i]).publicKey.toBase58());
    }
}